/**
 * Question Template Service
 * API service layer for question template management
 * Follows SkillBuilder API standards
 */

const API_BASE = '/api/v1';

/**
 * Get authentication headers
 * @returns {Object} Headers with auth token
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

/**
 * Create a new question template
 * @param {Object} templateData - Template creation data
 * @returns {Promise<Object>} Created template response
 */
export const createTemplate = async (templateData) => {
    try {
        const response = await fetch(`${API_BASE}/question-templates`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(templateData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to create template');
        }

        return result;
    } catch (error) {
        console.error('Error creating template:', error);
        throw error;
    }
};

/**
 * List question templates with filtering and pagination
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Templates list response
 */
export const listTemplates = async (filters = {}) => {
    try {
        const params = new URLSearchParams();

        if (filters.module) params.append('module', filters.module);
        if (filters.category) params.append('category', filters.category);
        if (filters.difficulty) params.append('difficulty', filters.difficulty);
        if (filters.status) params.append('status', filters.status);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);

        const response = await fetch(`${API_BASE}/question-templates?${params.toString()}`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to fetch templates');
        }

        return result;
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
    }
};

/**
 * Get a single template by ID
 * @param {number} templateId - Template ID
 * @returns {Promise<Object>} Template details
 */
export const getTemplate = async (templateId) => {
    try {
        const response = await fetch(`${API_BASE}/question-templates/${templateId}`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to fetch template');
        }

        return result;
    } catch (error) {
        console.error('Error fetching template:', error);
        throw error;
    }
};

/**
 * Update a question template
 * @param {number} templateId - Template ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated template
 */
export const updateTemplate = async (templateId, updateData) => {
    try {
        const response = await fetch(`${API_BASE}/question-templates/${templateId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to update template');
        }

        return result;
    } catch (error) {
        console.error('Error updating template:', error);
        throw error;
    }
};

/**
 * Delete a template (soft delete)
 * @param {number} templateId - Template ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteTemplate = async (templateId) => {
    try {
        const response = await fetch(`${API_BASE}/question-templates/${templateId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error?.message || 'Failed to delete template');
        }

        return true;
    } catch (error) {
        console.error('Error deleting template:', error);
        throw error;
    }
};

/**
 * Preview a template by generating sample questions
 * @param {number} templateId - Template ID
 * @param {number} count - Number of samples to generate (1-10)
 * @returns {Promise<Object>} Preview response with samples
 */
export const previewTemplate = async (templateId, count = 3) => {
    try {
        const response = await fetch(`${API_BASE}/question-templates/${templateId}/preview`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ count })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to preview template');
        }

        return result;
    } catch (error) {
        console.error('Error previewing template:', error);
        throw error;
    }
};

/**
 * Create a question generation job
 * @param {Object} jobData - Job creation data
 * @returns {Promise<Object>} Created job response
 */
export const createGenerationJob = async (jobData) => {
    try {
        const response = await fetch(`${API_BASE}/question-generation-jobs`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(jobData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to create generation job');
        }

        return result;
    } catch (error) {
        console.error('Error creating generation job:', error);
        throw error;
    }
};

/**
 * Get generation job status
 * @param {number} jobId - Job ID
 * @returns {Promise<Object>} Job details
 */
export const getGenerationJob = async (jobId) => {
    try {
        const response = await fetch(`${API_BASE}/question-generation-jobs/${jobId}`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to fetch job');
        }

        return result;
    } catch (error) {
        console.error('Error fetching job:', error);
        throw error;
    }
};

/**
 * List generated questions with filtering
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Generated questions list
 */
export const listGeneratedQuestions = async (filters = {}) => {
    try {
        const params = new URLSearchParams();

        if (filters.template_id) params.append('template_id', filters.template_id);
        if (filters.job_id) params.append('job_id', filters.job_id);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);

        const response = await fetch(`${API_BASE}/generated-questions?${params.toString()}`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to fetch generated questions');
        }

        return result;
    } catch (error) {
        console.error('Error fetching generated questions:', error);
        throw error;
    }
};

/**
 * Get a single generated question by ID
 * @param {number} questionId - Question ID
 * @returns {Promise<Object>} Question details
 */
export const getGeneratedQuestion = async (questionId) => {
    try {
        const response = await fetch(`${API_BASE}/generated-questions/${questionId}`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to fetch question');
        }

        return result;
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
};
