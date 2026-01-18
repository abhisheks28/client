import React, { useState, useEffect } from 'react';
import { useTemplateContext } from '../context/TemplateContext';

/**
 * Template Preview Component
 * Displays preview of generated questions from a template
 */
const TemplatePreview = ({ templateId }) => {
    const { previewTemplate } = useTemplateContext();
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSample, setCurrentSample] = useState(0);

    useEffect(() => {
        loadPreview();
    }, [templateId]);

    const loadPreview = async () => {
        setLoading(true);
        setError(null);

        const result = await previewTemplate(templateId, 3);

        if (result.success) {
            setPreviewData(result.data);
        } else {
            setError(result.error || 'Failed to load preview');
        }

        setLoading(false);
    };

    const handlePrevious = () => {
        setCurrentSample(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        if (previewData?.preview_samples) {
            setCurrentSample(prev => Math.min(previewData.preview_samples.length - 1, prev + 1));
        }
    };

    const handleRegenerate = () => {
        loadPreview();
        setCurrentSample(0);
    };

    if (loading) {
        return (
            <div className="qt-loading">
                <div className="qt-spinner"></div>
                <p style={{ color: 'white', marginTop: '1rem' }}>Generating preview...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.5rem'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Preview Error</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{error}</p>
                <button
                    className="qt-btn qt-btn-primary"
                    onClick={handleRegenerate}
                    style={{ marginTop: '1rem' }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!previewData || !previewData.preview_samples || previewData.preview_samples.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
                <p>No preview samples available</p>
            </div>
        );
    }

    const sample = previewData.preview_samples[currentSample];

    return (
        <div>
            {/* Preview Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <div style={{ color: 'white' }}>
                    <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                        Sample {currentSample + 1} of {previewData.preview_samples.length}
                    </span>
                </div>
                <button
                    className="qt-btn qt-btn-outline"
                    onClick={handleRegenerate}
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                    🔄 Regenerate
                </button>
            </div>

            {/* Question Card */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                padding: '2rem',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.25rem'
                    }}>
                        {currentSample + 1}
                    </div>
                    <h3 style={{ margin: 0, color: '#1f2937' }}>Question</h3>
                </div>

                <div
                    style={{
                        fontSize: '1.5rem',
                        color: '#1f2937',
                        marginBottom: '1.5rem',
                        lineHeight: '1.6'
                    }}
                    dangerouslySetInnerHTML={{ __html: sample.question_html }}
                />

                {sample.options && sample.options.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <p style={{ color: '#6b7280', marginBottom: '0.75rem', fontWeight: 600 }}>Options:</p>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {sample.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '1rem',
                                        background: '#f3f4f6',
                                        borderRadius: '0.5rem',
                                        border: '2px solid #e5e7eb',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>
                                        {option.label}:
                                    </span>
                                    <span>{option.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: '#f0fdf4',
                    border: '2px solid #86efac',
                    borderRadius: '0.5rem'
                }}>
                    <p style={{ color: '#15803d', fontWeight: 600, marginBottom: '0.5rem' }}>
                        ✅ Correct Answer:
                    </p>
                    <p style={{ color: '#166534', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                        {sample.answer_value}
                    </p>
                </div>

                {sample.variables_used && (
                    <details style={{ marginTop: '1rem' }}>
                        <summary style={{
                            color: '#6b7280',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>
                            🔍 Debug Info
                        </summary>
                        <pre style={{
                            marginTop: '0.5rem',
                            padding: '1rem',
                            background: '#f9fafb',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            color: '#374151',
                            overflow: 'auto'
                        }}>
                            {JSON.stringify(sample.variables_used, null, 2)}
                        </pre>
                    </details>
                )}
            </div>

            {/* Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem'
            }}>
                <button
                    className="qt-btn qt-btn-outline"
                    onClick={handlePrevious}
                    disabled={currentSample === 0}
                    style={{ flex: 1 }}
                >
                    ← Previous
                </button>
                <button
                    className="qt-btn qt-btn-outline"
                    onClick={handleNext}
                    disabled={currentSample === previewData.preview_samples.length - 1}
                    style={{ flex: 1 }}
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default TemplatePreview;
