import React, { createContext, useContext, useState, useCallback } from 'react';
import * as templateService from '../../../services/questionTemplateService';
import { parseErrorMessage } from '../utils/templateHelpers';

const TemplateContext = createContext();

/**
 * Template Context Provider
 * Manages global state for question templates
 */
export const TemplateProvider = ({ children }) => {
    const [templates, setTemplates] = useState([]);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [filters, setFilters] = useState({
        module: '',
        category: '',
        difficulty: '',
        status: '', // Empty to fetch all statuses
        limit: 50,
        offset: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    /**
     * Fetch templates with current filters
     */
    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔍 Fetching templates with filters:', filters);
            const response = await templateService.listTemplates(filters);
            console.log('📦 API Response:', response);

            if (response.success) {
                // Backend returns { templates: [], total: number, limit: number, offset: number }
                const templatesArray = response.data?.templates || [];
                const total = response.data?.total || 0;
                console.log('✅ Templates array:', templatesArray, 'Total:', total);
                setTemplates(templatesArray);
                setTotalCount(total);
            } else {
                console.error('❌ API returned error:', response.error);
                throw new Error(response.error?.message || 'Failed to fetch templates');
            }
        } catch (err) {
            console.error('💥 Exception during fetch:', err);
            setError(parseErrorMessage(err));
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    /**
     * Create a new template
     */
    const createTemplate = useCallback(async (templateData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await templateService.createTemplate(templateData);

            if (response.success) {
                // Refresh templates list
                await fetchTemplates();
                return { success: true, data: response.data };
            } else {
                throw new Error(response.error?.message || 'Failed to create template');
            }
        } catch (err) {
            const errorMsg = parseErrorMessage(err);
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, [fetchTemplates]);

    /**
     * Update an existing template
     */
    const updateTemplate = useCallback(async (templateId, updateData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await templateService.updateTemplate(templateId, updateData);

            if (response.success) {
                // Update local state
                setTemplates(prev =>
                    prev.map(t => t.template_id === templateId ? response.data : t)
                );

                if (currentTemplate?.template_id === templateId) {
                    setCurrentTemplate(response.data);
                }

                return { success: true, data: response.data };
            } else {
                throw new Error(response.error?.message || 'Failed to update template');
            }
        } catch (err) {
            const errorMsg = parseErrorMessage(err);
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, [currentTemplate]);

    /**
     * Delete a template
     */
    const deleteTemplate = useCallback(async (templateId) => {
        setLoading(true);
        setError(null);

        try {
            await templateService.deleteTemplate(templateId);

            // Remove from local state
            setTemplates(prev => prev.filter(t => t.template_id !== templateId));

            if (currentTemplate?.template_id === templateId) {
                setCurrentTemplate(null);
            }

            return { success: true };
        } catch (err) {
            const errorMsg = parseErrorMessage(err);
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, [currentTemplate]);

    /**
     * Get a single template by ID
     */
    const getTemplate = useCallback(async (templateId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await templateService.getTemplate(templateId);

            if (response.success) {
                setCurrentTemplate(response.data);
                return { success: true, data: response.data };
            } else {
                throw new Error(response.error?.message || 'Failed to fetch template');
            }
        } catch (err) {
            const errorMsg = parseErrorMessage(err);
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Preview a template
     */
    const previewTemplate = useCallback(async (templateId, count = 3) => {
        setLoading(true);
        setError(null);

        try {
            const response = await templateService.previewTemplate(templateId, count);

            if (response.success) {
                return { success: true, data: response.data };
            } else {
                throw new Error(response.error?.message || 'Failed to preview template');
            }
        } catch (err) {
            const errorMsg = parseErrorMessage(err);
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Update filters
     */
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
    }, []);

    /**
     * Clear filters
     */
    const clearFilters = useCallback(() => {
        setFilters({
            module: '',
            category: '',
            difficulty: '',
            status: '', // Empty to fetch all statuses
            limit: 50,
            offset: 0
        });
    }, []);

    /**
     * Load more templates (pagination)
     */
    const loadMore = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            offset: prev.offset + prev.limit
        }));
    }, []);

    const value = {
        // State
        templates,
        currentTemplate,
        filters,
        loading,
        error,
        totalCount,

        // Actions
        fetchTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        getTemplate,
        previewTemplate,
        updateFilters,
        clearFilters,
        loadMore,
        setCurrentTemplate,
        setError
    };

    return (
        <TemplateContext.Provider value={value}>
            {children}
        </TemplateContext.Provider>
    );
};

/**
 * Hook to use template context
 */
export const useTemplateContext = () => {
    const context = useContext(TemplateContext);

    if (!context) {
        throw new Error('useTemplateContext must be used within a TemplateProvider');
    }

    return context;
};

export default TemplateContext;
