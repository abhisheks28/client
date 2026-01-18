import React, { useEffect, useState } from 'react';
import { useTemplateContext } from '../context/TemplateContext';
import {
    formatTemplateData,
    getDifficultyColor,
    getStatusBadge,
    getQuestionTypeIcon,
    truncateText
} from '../utils/templateHelpers';

/**
 * Template List Component
 * Displays and manages existing templates
 */
const TemplateList = ({ filterByUser, onToast }) => {
    const {
        templates,
        fetchTemplates,
        deleteTemplate,
        updateFilters,
        filters,
        loading,
        totalCount
    } = useTemplateContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // In a real implementation, you'd debounce this and filter on the backend
    };

    const handleDelete = async (templateId) => {
        const result = await deleteTemplate(templateId);

        if (result.success) {
            onToast('Template deleted successfully', 'success');
            setShowDeleteConfirm(null);
        } else {
            onToast(result.error || 'Failed to delete template', 'error');
        }
    };

    const filteredTemplates = templates.filter(template => {
        if (!searchTerm) return true;

        const search = searchTerm.toLowerCase();
        return (
            template.module?.toLowerCase().includes(search) ||
            template.topic?.toLowerCase().includes(search) ||
            template.subtopic?.toLowerCase().includes(search) ||
            template.category?.toLowerCase().includes(search)
        );
    });

    if (loading) {
        return (
            <div className="qt-loading">
                <div className="qt-spinner"></div>
                <p style={{ color: 'white', marginTop: '1rem' }}>Loading templates...</p>
            </div>
        );
    }

    return (
        <div className="qt-fade-in">
            {/* Search Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    className="qt-input"
                    placeholder="🔍 Search templates..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Templates Count */}
            <div style={{
                color: 'white',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                opacity: 0.8
            }}>
                Showing {filteredTemplates.length} of {totalCount} templates
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: 'rgba(255, 255, 255, 0.7)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No templates found</h3>
                    <p>Try adjusting your search or create a new template</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {filteredTemplates.map(template => {
                        const statusBadge = getStatusBadge(template.status);
                        const difficultyColor = getDifficultyColor(template.difficulty);
                        const typeIcon = getQuestionTypeIcon(template.type);

                        return (
                            <div
                                key={template.template_id}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                className="qt-template-card"
                            >
                                {/* Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            color: 'white',
                                            margin: '0 0 0.5rem 0',
                                            fontSize: '1.125rem',
                                            fontWeight: 600
                                        }}>
                                            {typeIcon} {template.topic}
                                        </h3>
                                        <p style={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            margin: 0,
                                            fontSize: '0.875rem'
                                        }}>
                                            {template.subtopic}
                                        </p>
                                    </div>
                                    <div className="qt-badge" style={{
                                        background: statusBadge.bgColor,
                                        color: statusBadge.color,
                                        border: `1px solid ${statusBadge.color}`
                                    }}>
                                        {statusBadge.icon} {statusBadge.label}
                                    </div>
                                </div>

                                {/* Details */}
                                <div style={{
                                    display: 'grid',
                                    gap: '0.5rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                                        <strong>Module:</strong> {template.module}
                                    </div>
                                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                                        <strong>Category:</strong> {template.category}
                                    </div>
                                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                                        <strong>Format:</strong> {truncateText(template.format, 30)}
                                    </div>
                                    <div style={{
                                        color: difficultyColor,
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}>
                                        <strong>Difficulty:</strong> {template.difficulty?.toUpperCase()}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    <button
                                        className="qt-btn qt-btn-primary"
                                        style={{
                                            flex: 1,
                                            fontSize: '0.875rem',
                                            padding: '0.5rem'
                                        }}
                                        onClick={() => setSelectedTemplate(template)}
                                    >
                                        👁️ View
                                    </button>
                                    <button
                                        className="qt-btn qt-btn-error"
                                        style={{
                                            fontSize: '0.875rem',
                                            padding: '0.5rem'
                                        }}
                                        onClick={() => setShowDeleteConfirm(template.template_id)}
                                    >
                                        🗑️
                                    </button>
                                </div>

                                {/* Delete Confirmation */}
                                {showDeleteConfirm === template.template_id && (
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '0.5rem'
                                    }}>
                                        <p style={{
                                            color: 'white',
                                            margin: '0 0 0.75rem 0',
                                            fontSize: '0.875rem'
                                        }}>
                                            Are you sure you want to delete this template?
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="qt-btn qt-btn-error"
                                                style={{
                                                    flex: 1,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem'
                                                }}
                                                onClick={() => handleDelete(template.template_id)}
                                            >
                                                Yes, Delete
                                            </button>
                                            <button
                                                className="qt-btn qt-btn-outline"
                                                style={{
                                                    flex: 1,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem'
                                                }}
                                                onClick={() => setShowDeleteConfirm(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Template Detail Modal (simplified for now) */}
            {selectedTemplate && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '2rem'
                    }}
                    onClick={() => setSelectedTemplate(null)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '1rem',
                            padding: '2rem',
                            maxWidth: '800px',
                            maxHeight: '80vh',
                            overflow: 'auto',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedTemplate(null)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: '#6b7280'
                            }}
                        >
                            ×
                        </button>

                        <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
                            {selectedTemplate.topic}
                        </h2>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            {selectedTemplate.subtopic}
                        </p>

                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Module:</strong> {selectedTemplate.module}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Category:</strong> {selectedTemplate.category}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Format:</strong> {selectedTemplate.format}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Difficulty:</strong> {selectedTemplate.difficulty}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Type:</strong> {selectedTemplate.type}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateList;
