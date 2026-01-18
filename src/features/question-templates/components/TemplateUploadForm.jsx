import React, { useState } from 'react';
import { useTemplateContext } from '../context/TemplateContext';
import TemplateCodeEditor from './TemplateCodeEditor';

/**
 * Simplified Template Upload Form
 * Single-page form with all fields
 */
const TemplateUploadForm = ({ onToast, onSuccess }) => {
    const { createTemplate, previewTemplate, loading } = useTemplateContext();

    const [formData, setFormData] = useState({
        grade_level: 1,
        module: '',
        category: '',
        topic: '',
        subtopic: '',
        format: '',
        difficulty: 'easy',
        type: 'user_input',
        status: 'draft',
        dynamic_question: '',
        logical_answer: ''
    });

    const [errors, setErrors] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.module.trim()) newErrors.module = 'Module is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
        if (!formData.subtopic.trim()) newErrors.subtopic = 'Subtopic is required';
        if (!formData.format.trim()) newErrors.format = 'Format is required';
        if (!formData.dynamic_question.trim()) newErrors.dynamic_question = 'Dynamic question code is required';
        if (!formData.logical_answer.trim()) newErrors.logical_answer = 'Logical answer code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePreview = async () => {
        if (!validate()) {
            onToast('Please fill in all required fields', 'error');
            return;
        }

        // First create as draft to get template_id
        const result = await createTemplate({ ...formData, status: 'draft' });

        if (result.success) {
            const templateId = result.data.template_id;
            const previewResult = await previewTemplate(templateId, 3);

            if (previewResult.success) {
                setPreviewData(previewResult.data);
                setShowPreview(true);
            } else {
                onToast(previewResult.error || 'Preview failed', 'error');
            }
        } else {
            onToast(result.error || 'Failed to create template', 'error');
        }
    };

    const handleSave = async (status) => {
        if (!validate()) {
            onToast('Please fill in all required fields', 'error');
            return;
        }

        const result = await createTemplate({ ...formData, status });

        if (result.success) {
            onToast(`Template ${status === 'active' ? 'activated' : 'saved as draft'}  successfully!`, 'success');
            if (onSuccess) onSuccess();
            // Reset form
            setFormData({
                grade_level: 1,
                module: '',
                category: '',
                topic: '',
                subtopic: '',
                format: '',
                difficulty: 'easy',
                type: 'user_input',
                status: 'draft',
                dynamic_question: '',
                logical_answer: ''
            });
        } else {
            onToast(result.error || 'Failed to save template', 'error');
        }
    };

    return (
        <div className="qt-form-container">
            <div className="qt-form-card">
                <h2 className="qt-form-title">📝 Create Question Template</h2>

                {/* Grade Level */}
                <div className="qt-form-group">
                    <label className="qt-label">Grade Level *</label>
                    <select
                        className="qt-select"
                        value={formData.grade_level}
                        onChange={(e) => handleChange('grade_level', parseInt(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                            <option key={grade} value={grade}>Grade {grade}</option>
                        ))}
                    </select>
                </div>

                {/* Text Inputs */}
                <div className="qt-form-row">
                    <div className="qt-form-group">
                        <label className="qt-label">Module *</label>
                        <input
                            type="text"
                            className="qt-input"
                            placeholder="e.g., Math Skill, Number Sense"
                            value={formData.module}
                            onChange={(e) => handleChange('module', e.target.value)}
                        />
                        {errors.module && <div className="qt-error-text">{errors.module}</div>}
                    </div>

                    <div className="qt-form-group">
                        <label className="qt-label">Category *</label>
                        <input
                            type="text"
                            className="qt-input"
                            placeholder="e.g., Fundamentals, Geometry"
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                        />
                        {errors.category && <div className="qt-error-text">{errors.category}</div>}
                    </div>
                </div>

                <div className="qt-form-row">
                    <div className="qt-form-group">
                        <label className="qt-label">Topic *</label>
                        <input
                            type="text"
                            className="qt-input"
                            placeholder="e.g., Addition, Counting"
                            value={formData.topic}
                            onChange={(e) => handleChange('topic', e.target.value)}
                        />
                        {errors.topic && <div className="qt-error-text">{errors.topic}</div>}
                    </div>

                    <div className="qt-form-group">
                        <label className="qt-label">Subtopic *</label>
                        <input
                            type="text"
                            className="qt-input"
                            placeholder="e.g., Addition of 2 numbers"
                            value={formData.subtopic}
                            onChange={(e) => handleChange('subtopic', e.target.value)}
                        />
                        {errors.subtopic && <div className="qt-error-text">{errors.subtopic}</div>}
                    </div>
                </div>

                <div className="qt-form-group">
                    <label className="qt-label">Format *</label>
                    <input
                        type="text"
                        className="qt-input"
                        placeholder="e.g., a + b = ?, Count the objects"
                        value={formData.format}
                        onChange={(e) => handleChange('format', e.target.value)}
                    />
                    {errors.format && <div className="qt-error-text">{errors.format}</div>}
                </div>

                {/* Radio Buttons */}
                <div className="qt-form-row">
                    <div className="qt-form-group">
                        <label className="qt-label">Difficulty *</label>
                        <div className="qt-radio-group">
                            {['easy', 'medium', 'hard'].map(diff => (
                                <label key={diff} className="qt-radio-label">
                                    <input
                                        type="radio"
                                        name="difficulty"
                                        value={diff}
                                        checked={formData.difficulty === diff}
                                        onChange={(e) => handleChange('difficulty', e.target.value)}
                                    />
                                    <span>{diff.charAt(0).toUpperCase() + diff.slice(1)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="qt-form-group">
                        <label className="qt-label">Question Type *</label>
                        <div className="qt-radio-group">
                            {[
                                { value: 'mcq', label: 'MCQ' },
                                { value: 'user_input', label: 'User Input' },
                                { value: 'image_based', label: 'Image Based' }
                            ].map(type => (
                                <label key={type.value} className="qt-radio-label">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type.value}
                                        checked={formData.type === type.value}
                                        onChange={(e) => handleChange('type', e.target.value)}
                                    />
                                    <span>{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="qt-form-group">
                    <label className="qt-label">Status *</label>
                    <div className="qt-radio-group">
                        {[
                            { value: 'draft', label: '📝 Draft', desc: 'Save for later' },
                            { value: 'active', label: '✅ Active', desc: 'Available for students' },
                            { value: 'inactive', label: '🔴 Inactive', desc: 'Hidden from students' }
                        ].map(status => (
                            <label key={status.value} className="qt-radio-label">
                                <input
                                    type="radio"
                                    name="status"
                                    value={status.value}
                                    checked={formData.status === status.value}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                />
                                <span>{status.label}</span>
                                <small style={{ display: 'block', opacity: 0.7, fontSize: '0.75rem' }}>
                                    {status.desc}
                                </small>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Code Editors */}
                <div className="qt-form-group">
                    <label className="qt-label">Dynamic Question Code *</label>
                    <p className="qt-help-text">
                        Write Python code with a <code>generate()</code> function that returns a dictionary with 'question' and 'answer' keys.
                    </p>
                    <TemplateCodeEditor
                        value={formData.dynamic_question}
                        onChange={(value) => handleChange('dynamic_question', value)}
                        placeholder="import random\n\ndef generate():\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    question_html = f'{a} + {b} = ?'\n    answer = a + b\n    return {\n        'question': question_html,\n        'answer': answer\n    }"
                    />
                    {errors.dynamic_question && <div className="qt-error-text">{errors.dynamic_question}</div>}
                </div>

                <div className="qt-form-group">
                    <label className="qt-label">Logical Answer Code *</label>
                    <p className="qt-help-text">
                        Write Python code with a <code>validate(user_answer, correct_answer)</code> function that returns True/False.
                    </p>
                    <TemplateCodeEditor
                        value={formData.logical_answer}
                        onChange={(value) => handleChange('logical_answer', value)}
                        placeholder="def validate(user_answer, correct_answer):\n    try:\n        user_val = int(user_answer)\n        return user_val == correct_answer\n    except:\n        return False"
                    />
                    {errors.logical_answer && <div className="qt-error-text">{errors.logical_answer}</div>}
                </div>

                {/* Action Buttons */}
                <div className="qt-form-actions">
                    <button
                        type="button"
                        className="qt-btn qt-btn-outline"
                        onClick={handlePreview}
                        disabled={loading}
                    >
                        👁️ Preview
                    </button>
                    <button
                        type="button"
                        className="qt-btn qt-btn-secondary"
                        onClick={() => handleSave('draft')}
                        disabled={loading}
                    >
                        💾 Save as Draft
                    </button>
                    <button
                        type="button"
                        className="qt-btn qt-btn-primary"
                        onClick={() => handleSave('active')}
                        disabled={loading}
                    >
                        ✅ Activate Template
                    </button>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && previewData && (
                <div className="qt-modal-overlay" onClick={() => setShowPreview(false)}>
                    <div className="qt-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="qt-modal-close" onClick={() => setShowPreview(false)}>×</button>
                        <h3>Preview Samples</h3>
                        <div className="qt-preview-samples">
                            {previewData.preview_samples.map((sample, idx) => (
                                <div key={idx} className="qt-preview-sample">
                                    <h4>Sample {idx + 1}</h4>
                                    <div dangerouslySetInnerHTML={{ __html: sample.question_html }} />
                                    <p><strong>Answer:</strong> {sample.answer_value}</p>
                                    {sample.options && (
                                        <div>
                                            <strong>Options:</strong>
                                            <ul>
                                                {sample.options.map((opt, i) => (
                                                    <li key={i}>{opt.label}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateUploadForm;
