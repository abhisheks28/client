import React, { useState, useEffect } from 'react';
import { TemplateProvider, useTemplateContext } from '../../question-templates/context/TemplateContext';
import TemplateUploadForm from '../../question-templates/components/TemplateUploadForm';
import TemplateList from '../../question-templates/components/TemplateList';
import '../../question-templates/styles/questionTemplates.css';

/**
 * Question Template Manager
 * Main container component for template management
 */
const QuestionTemplateManagerContent = () => {
    const [activeTab, setActiveTab] = useState('upload');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const { fetchTemplates, loading, error } = useTemplateContext();

    useEffect(() => {
        if (activeTab === 'my-templates' || activeTab === 'browse') {
            fetchTemplates();
        }
    }, [activeTab, fetchTemplates]);

    useEffect(() => {
        if (error) {
            showToastNotification(error, 'error');
        }
    }, [error]);

    const showToastNotification = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 5000);
    };

    const handleUploadSuccess = (template) => {
        showToastNotification('Template created successfully! 🎉', 'success');
        setActiveTab('my-templates');
    };

    const handleUploadError = (error) => {
        showToastNotification(error, 'error');
    };

    return (
        <div className="question-template-manager">
            <div className="qt-container">
                {/* Header */}
                <div className="qt-header qt-fade-in">
                    <h1>📚 Question Template Manager</h1>
                    <p>Create, manage, and preview question templates for Grade 1 assessments</p>
                </div>

                {/* Main Card */}
                <div className="qt-glass-card qt-scale-in">
                    {/* Tabs */}
                    <div className="qt-tabs">
                        <button
                            className={`qt-tab ${activeTab === 'upload' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upload')}
                        >
                            ✨ Upload New
                        </button>
                        <button
                            className={`qt-tab ${activeTab === 'my-templates' ? 'active' : ''}`}
                            onClick={() => setActiveTab('my-templates')}
                        >
                            📝 My Templates
                        </button>
                        <button
                            className={`qt-tab ${activeTab === 'browse' ? 'active' : ''}`}
                            onClick={() => setActiveTab('browse')}
                        >
                            🔍 Browse All
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="qt-tab-content">
                        {activeTab === 'upload' && (
                            <TemplateUploadForm
                                onSuccess={handleUploadSuccess}
                                onError={handleUploadError}
                            />
                        )}

                        {activeTab === 'my-templates' && (
                            <TemplateList
                                filterByUser={true}
                                onToast={showToastNotification}
                            />
                        )}

                        {activeTab === 'browse' && (
                            <TemplateList
                                filterByUser={false}
                                onToast={showToastNotification}
                            />
                        )}
                    </div>
                </div>

                {/* Toast Notification */}
                {showToast && (
                    <div className={`qt-toast qt-toast-${toastType}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>
                                {toastType === 'success' ? '✅' : toastType === 'error' ? '❌' : '⚠️'}
                            </span>
                            <span>{toastMessage}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Main export with Provider wrapper
 */
const QuestionTemplateManager = () => {
    return (
        <TemplateProvider>
            <QuestionTemplateManagerContent />
        </TemplateProvider>
    );
};

export default QuestionTemplateManager;
