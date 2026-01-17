"use client";
import { createContext, useContext, useEffect, useState, useMemo } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userType, setUserType] = useState(null); // 'student', 'parent', 'teacher'
    const [activeChildId, setActiveChildId] = useState(null);
    const [activeChildLoading, setActiveChildLoading] = useState(true);
    const [loading, setLoading] = useState(true);

    // Compute active child from userData + activeChildId
    const activeChild = useMemo(() => {
        if (!userData?.children || !activeChildId) return null;
        return userData.children[activeChildId] || null;
    }, [userData, activeChildId]);

    // Compute if user is a teacher
    const isTeacher = useMemo(() => {
        return userType === 'teacher';
    }, [userType]);

    // Function to fetch and normalize user data from Backend API (PostgreSQL)
    const fetchUserData = async (uid, overrideToken = null) => {
        if (!uid && !overrideToken) { // If no uid and no token (implied /me), we might be just refreshing
            // Actually, for /me we don't strictly need uid if we have token. 
        }

        const token = overrideToken || localStorage.getItem('authToken');
        if (!token) {
            setUserData(null);
            setUserType(null);
            return;
        }

        try {
            // Fetch from Python Backend (using /me endpoint for current user)
            const response = await fetch(`/api/v1/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const apiData = await response.json();
                // Backend returns UserDetail directly (no success wrapper)

                const role = apiData.role || apiData.user_type || 'student'; // Backend uses user_type

                // Handle Teacher
                if (role === 'teacher') {
                    setUserType('teacher');
                    const teacherData = {
                        ...apiData,
                        uid: apiData.user_id, // Map user_id to uid
                        isTeacher: true,
                        userType: 'teacher'
                    };
                    setUserData(teacherData);
                    setUser(teacherData);
                    localStorage.setItem('authUser', JSON.stringify(teacherData));
                    return;
                }

                // Handle Parent/Student
                let normalizedChildren = apiData.children || {};

                // If user is a student, mapping themselves as a "child" so Dashboard can render activeChild
                if (role === 'student' && Object.keys(normalizedChildren).length === 0) {
                    normalizedChildren = {
                        [apiData.user_id]: {
                            id: apiData.user_id,
                            name: apiData.display_name || apiData.first_name,
                            grade: apiData.grade || 'Grade 5', // Default if missing
                            school: apiData.school_name || 'My School',
                            board: 'CBSE',
                            uid: apiData.user_id
                        }
                    };
                }

                const normalizedData = {
                    ...apiData,
                    uid: apiData.user_id, // Map user_id to uid
                    phoneNumber: apiData.phone_number || "",
                    parentPhone: apiData.phone_number || "",
                    authProvider: 'email',
                    userType: role,
                    children: normalizedChildren
                };

                setUserType(role);
                setUserData(normalizedData);
                // Also update user state to include uid for compatibility
                const simpleUser = { ...apiData, uid: apiData.user_id, username: apiData.user_id };
                setUser(simpleUser);
                localStorage.setItem('authUser', JSON.stringify(simpleUser));
            } else {
                console.warn("User fetch failed");
                setUserData(null);
                setUserType(null);
            }
        } catch (error) {
            console.error("Error fetching user data from API:", error);
            setUserData(null);
            setUserType(null);
        }
    };

    // Check for existing session
    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('authUser');

            if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser); // Set basic user info
                    await fetchUserData(parsedUser.uid); // Fetch full profile
                } catch (e) {
                    console.error("Session restore error", e);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('authUser');
                }
            }
            setLoading(false);
        };
        checkSession();
    }, []);

    // Initialize activeChildId from localStorage
    useEffect(() => {
        if (!user || !userData?.children) {
            setActiveChildLoading(false);
            return;
        }

        const storedChildId = typeof window !== "undefined"
            ? window.localStorage.getItem(`activeChild_${user.uid}`)
            : null;

        const childKeys = Object.keys(userData.children);

        if (storedChildId && childKeys.includes(storedChildId)) {
            setActiveChildId(storedChildId);
        } else if (childKeys.length > 0) {
            setActiveChildId(childKeys[0]);
        }
        setActiveChildLoading(false);
    }, [user, userData]);

    const updateActiveChild = (childId) => {
        setActiveChildId(childId);
        if (user && typeof window !== "undefined") {
            window.localStorage.setItem(`activeChild_${user.uid}`, childId);
        }
    };

    // New Login Function
    const login = async (email, password) => {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();



        if (response.ok) {
            // Backend returns { access_token, token_type }
            const token = data.access_token;
            localStorage.setItem('authToken', token);

            // We need to fetch user details since login doesn't return them
            await fetchUserData(null, token); // Pass token explicitly to ensure it's used immediately

            // We can't immediately return user object from login response, 
            // but fetchUserData updates the state. 
            // We can assume success.
            return { success: true };
        } else {
            return { success: false, message: data.detail || "Login failed" };
        }
    };

    // Google Login Function
    const loginWithGoogle = async () => {
        try {
            const { signInWithPopup } = await import("firebase/auth");
            const { auth, googleProvider } = await import("../../../firebase");

            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Sync with backend
            const response = await fetch('/api/v1/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || user.email.split('@')[0],
                    photoURL: user.photoURL
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('authUser', JSON.stringify(data.user));
                setUser(data.user);
                await fetchUserData(data.user.uid);
                return { success: true, user: data.user };
            } else {
                return { success: false, message: "Backend sync failed" };
            }

        } catch (error) {
            console.error("Google Sign In Error:", error);
            return { success: false, message: error.message };
        }
    };

    // New Register Function
    const register = async (payload) => {
        // Payload expected: email, password, name, role, grade (opt), etc.
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();



        if (response.ok) {
            // Backend returns UserResponse directly (user_id, email, etc)
            // It does NOT return a token.
            // Map keys for formatting
            const userObj = {
                ...data,
                uid: data.user_id,
                username: data.user_id, // Map for ticket code compat
            };

            // Since we don't get a token from register, we should auto-login using the password we have.
            // This provides a seamless experience (no need to manually sign in).
            if (payload.email && payload.password) {
                try {
                    const loginResult = await login(payload.email, payload.password);
                    if (loginResult && loginResult.success) {
                        return { success: true, user: userObj };
                    }
                } catch (e) {
                    console.error("Auto-login failed:", e);
                    // Continue to return success for registration even if auto-login fails
                }
            }

            // If auto-login fails (shouldn't happen) or no credentials, return success but user needs to login
            return { success: true, user: userObj };
        } else {
            return { success: false, message: data.detail || "Registration failed" };
        }
    };

    const logout = async () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setUser(null);
        setUserData(null);
        setUserType(null);
        setActiveChildId(null);
    };

    const refreshUserData = async () => {
        if (user) {
            await fetchUserData(user.uid);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userData,
            userType,
            isTeacher,
            activeChild,
            activeChildId,
            activeChildLoading,
            setActiveChildId: updateActiveChild,
            loading,
            login,
            loginWithGoogle,
            register,
            logout,
            setUserData,
            refreshUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
