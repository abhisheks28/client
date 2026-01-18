import React, { useState } from 'react';

/**
 * Template Code Editor
 * Simple code editor with syntax highlighting for Python
 */
const TemplateCodeEditor = ({ value, onChange, placeholder }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    const handleKeyDown = (e) => {
        // Handle Tab key for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newValue = value.substring(0, start) + '    ' + value.substring(end);
            onChange(newValue);

            // Set cursor position after the inserted tab
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
        }
    };

    return (
        <div style={{
            position: 'relative',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            border: isFocused ? '2px solid #f093fb' : '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
        }}>
            <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.5rem 1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <span style={{ color: '#10b981', fontSize: '0.75rem' }}>●</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                    Python
                </span>
            </div>

            <textarea
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    minHeight: '250px',
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    color: '#e0e0e0',
                    fontSize: '0.875rem',
                    fontFamily: "'Courier New', Consolas, Monaco, monospace",
                    lineHeight: '1.6',
                    resize: 'vertical',
                    outline: 'none'
                }}
                spellCheck={false}
            />

            <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.5rem 1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                    {value.split('\n').length} lines
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                    {value.length} characters
                </span>
            </div>
        </div>
    );
};

export default TemplateCodeEditor;
