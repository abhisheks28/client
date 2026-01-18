/**
 * Template validation utilities
 * Provides validation schemas and helpers for question templates
 */

/**
 * Validate template form data
 * @param {Object} data - Template form data
 * @returns {Object} Validation result with errors
 */
export const validateTemplateForm = (data) => {
    const errors = {};

    // Required fields
    if (!data.module || data.module.trim().length === 0) {
        errors.module = 'Module is required';
    }
    if (!data.category || data.category.trim().length === 0) {
        errors.category = 'Category is required';
    }
    if (!data.topic || data.topic.trim().length === 0) {
        errors.topic = 'Topic is required';
    }
    if (!data.subtopic || data.subtopic.trim().length === 0) {
        errors.subtopic = 'Subtopic is required';
    }
    if (!data.format || data.format.trim().length === 0) {
        errors.format = 'Format is required';
    }
    if (!data.difficulty || data.difficulty.trim().length === 0) {
        errors.difficulty = 'Difficulty is required';
    }
    if (!data.type || data.type.trim().length === 0) {
        errors.type = 'Question type is required';
    }
    if (!data.dynamic_question || data.dynamic_question.trim().length === 0) {
        errors.dynamic_question = 'Dynamic question code is required';
    }
    if (!data.logical_answer || data.logical_answer.trim().length === 0) {
        errors.logical_answer = 'Logical answer code is required';
    }

    // Length validations
    if (data.module && data.module.length > 100) {
        errors.module = 'Module must be less than 100 characters';
    }
    if (data.category && data.category.length > 100) {
        errors.category = 'Category must be less than 100 characters';
    }
    if (data.topic && data.topic.length > 100) {
        errors.topic = 'Topic must be less than 100 characters';
    }
    if (data.subtopic && data.subtopic.length > 100) {
        errors.subtopic = 'Subtopic must be less than 100 characters';
    }
    if (data.format && data.format.length > 200) {
        errors.format = 'Format must be less than 200 characters';
    }

    // Code length validations
    if (data.dynamic_question && data.dynamic_question.length < 10) {
        errors.dynamic_question = 'Code must be at least 10 characters';
    }
    if (data.logical_answer && data.logical_answer.length < 10) {
        errors.logical_answer = 'Code must be at least 10 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Basic Python syntax validation (client-side)
 * @param {string} code - Python code to validate
 * @returns {Object} Validation result
 */
export const validatePythonSyntax = (code) => {
    const errors = [];

    // Basic checks
    if (!code || code.trim().length === 0) {
        return { isValid: false, errors: ['Code cannot be empty'] };
    }

    // Check for common syntax issues
    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();

        // Skip empty lines and comments
        if (trimmed.length === 0 || trimmed.startsWith('#')) {
            continue;
        }

        // Check for colon at end of control structures
        if (/^(if|elif|else|for|while|def|class|try|except|finally|with)\s/.test(trimmed)) {
            if (!trimmed.endsWith(':') && !trimmed.endsWith('\\')) {
                errors.push(`Line ${i + 1}: Missing colon after control structure`);
            }
        }
    }

    // Note: We skip bracket/parenthesis/brace checking because Python allows
    // multi-line expressions, and checking per-line causes false positives.
    // The backend will validate the actual Python syntax when executing.

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Sanitize template data before submission
 * @param {Object} data - Template data
 * @returns {Object} Sanitized data
 */
export const sanitizeTemplateData = (data) => {
    return {
        module: data.module?.trim() || '',
        category: data.category?.trim() || '',
        topic: data.topic?.trim() || '',
        subtopic: data.subtopic?.trim() || '',
        format: data.format?.trim() || '',
        difficulty: data.difficulty?.trim() || '',
        type: data.type?.trim() || '',
        dynamic_question: data.dynamic_question?.trim() || '',
        logical_answer: data.logical_answer?.trim() || ''
    };
};

/**
 * Validate difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {boolean} Is valid
 */
export const isValidDifficulty = (difficulty) => {
    const validLevels = ['easy', 'medium', 'hard', 'expert'];
    return validLevels.includes(difficulty?.toLowerCase());
};

/**
 * Validate question type
 * @param {string} type - Question type
 * @returns {boolean} Is valid
 */
export const isValidQuestionType = (type) => {
    const validTypes = ['mcq', 'user_input', 'image_based', 'code_based'];
    return validTypes.includes(type?.toLowerCase());
};
