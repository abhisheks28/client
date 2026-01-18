/**
 * Template helper utilities
 * Provides formatting and display helpers for templates
 */

/**
 * Format template data for display
 * @param {Object} template - Template object
 * @returns {Object} Formatted template
 */
export const formatTemplateData = (template) => {
    if (!template) return null;

    return {
        ...template,
        created_at: new Date(template.created_at).toLocaleDateString(),
        updated_at: new Date(template.updated_at).toLocaleDateString(),
        difficulty: template.difficulty?.charAt(0).toUpperCase() + template.difficulty?.slice(1),
        type: formatQuestionType(template.type)
    };
};

/**
 * Get color for difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {string} Color code
 */
export const getDifficultyColor = (difficulty) => {
    const colors = {
        easy: '#10b981',      // Green
        medium: '#f59e0b',    // Orange
        hard: '#ef4444',      // Red
        expert: '#8b5cf6'     // Purple
    };

    return colors[difficulty?.toLowerCase()] || '#6b7280'; // Gray as default
};

/**
 * Get status badge configuration
 * @param {string} status - Template status
 * @returns {Object} Badge config
 */
export const getStatusBadge = (status) => {
    const badges = {
        draft: {
            label: 'Draft',
            color: '#6b7280',
            bgColor: 'rgba(107, 114, 128, 0.1)',
            icon: '📝'
        },
        active: {
            label: 'Active',
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)',
            icon: '✅'
        },
        inactive: {
            label: 'Inactive',
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.1)',
            icon: '🚫'
        }
    };

    return badges[status?.toLowerCase()] || badges.draft;
};

/**
 * Format question type for display
 * @param {string} type - Question type
 * @returns {string} Formatted type
 */
export const formatQuestionType = (type) => {
    const types = {
        mcq: 'Multiple Choice',
        user_input: 'User Input',
        image_based: 'Image Based',
        code_based: 'Code Based'
    };

    return types[type?.toLowerCase()] || type;
};

/**
 * Get icon for question type
 * @param {string} type - Question type
 * @returns {string} Icon emoji
 */
export const getQuestionTypeIcon = (type) => {
    const icons = {
        mcq: '📋',
        user_input: '✏️',
        image_based: '🖼️',
        code_based: '💻'
    };

    return icons[type?.toLowerCase()] || '❓';
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Generate preview HTML for code snippet
 * @param {string} code - Python code
 * @returns {string} HTML preview
 */
export const generateCodePreview = (code) => {
    if (!code) return '';

    const lines = code.split('\n').slice(0, 5); // First 5 lines
    const preview = lines.join('\n');

    if (code.split('\n').length > 5) {
        return preview + '\n...';
    }

    return preview;
};

/**
 * Get difficulty level options
 * @returns {Array} Difficulty options
 */
export const getDifficultyOptions = () => [
    { value: 'easy', label: 'Easy', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'hard', label: 'Hard', color: '#ef4444' },
    { value: 'expert', label: 'Expert', color: '#8b5cf6' }
];

/**
 * Get question type options
 * @returns {Array} Question type options
 */
export const getQuestionTypeOptions = () => [
    { value: 'mcq', label: 'Multiple Choice', icon: '📋' },
    { value: 'user_input', label: 'User Input', icon: '✏️' },
    { value: 'image_based', label: 'Image Based', icon: '🖼️' },
    { value: 'code_based', label: 'Code Based', icon: '💻' }
];

/**
 * Get Grade 1 module options
 * @returns {Array} Module options
 */
export const getGrade1ModuleOptions = () => [
    { value: 'Math Skill', label: 'Math Skill' },
    { value: 'Number Sense', label: 'Number Sense' },
    { value: 'Geometry', label: 'Geometry' },
    { value: 'Measurement', label: 'Measurement' }
];

/**
 * Get Grade 1 category options based on module
 * @param {string} module - Selected module
 * @returns {Array} Category options
 */
export const getGrade1CategoryOptions = (module) => {
    const categories = {
        'Math Skill': [
            { value: 'Fundamentals', label: 'Fundamentals' },
            { value: 'Operations', label: 'Operations' },
            { value: 'Problem Solving', label: 'Problem Solving' }
        ],
        'Number Sense': [
            { value: 'Counting', label: 'Counting' },
            { value: 'Number Recognition', label: 'Number Recognition' },
            { value: 'Place Value', label: 'Place Value' }
        ],
        'Geometry': [
            { value: 'Shapes', label: 'Shapes' },
            { value: 'Patterns', label: 'Patterns' }
        ],
        'Measurement': [
            { value: 'Length', label: 'Length' },
            { value: 'Time', label: 'Time' }
        ]
    };

    return categories[module] || [];
};

/**
 * Get Grade 1 topic options based on category
 * @param {string} category - Selected category
 * @returns {Array} Topic options
 */
export const getGrade1TopicOptions = (category) => {
    const topics = {
        'Fundamentals': [
            { value: 'Addition', label: 'Addition' },
            { value: 'Subtraction', label: 'Subtraction' }
        ],
        'Operations': [
            { value: 'Addition', label: 'Addition' },
            { value: 'Subtraction', label: 'Subtraction' }
        ],
        'Counting': [
            { value: 'Count to 10', label: 'Count to 10' },
            { value: 'Count to 20', label: 'Count to 20' },
            { value: 'Count to 100', label: 'Count to 100' }
        ],
        'Shapes': [
            { value: 'Basic Shapes', label: 'Basic Shapes' },
            { value: 'Shape Properties', label: 'Shape Properties' }
        ]
    };

    return topics[category] || [];
};

/**
 * Parse error message from API response
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const parseErrorMessage = (error) => {
    if (error.message) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred. Please try again.';
};
