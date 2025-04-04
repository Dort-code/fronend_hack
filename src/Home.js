import { useState } from 'react';
import './Home.css'; // Импорт стилей
import React from 'react';

export function Home() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = function(e) {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleInputChange = function(e) {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return React.createElement(
        'div',
        { className: 'form-container' },
        React.createElement(
            'h1',
            { className: 'form-title' },
            'Welcome'
        ),
        React.createElement(
            'form',
            { onSubmit: handleSubmit, className: 'form' },
            createInputField('name', 'Name', formData.name, handleInputChange, 'text'),
            createInputField('email', 'Email', formData.email, handleInputChange, 'email'),
            createInputField('password', 'Password', formData.password, handleInputChange, 'password'),
            React.createElement(
                'button',
                { type: 'submit', className: 'submit-button' },
                'Register'
            )
        )
    );
}

// Вспомогательная функция для создания полей ввода
function createInputField(id, label, value, onChange, type = 'text') {
    return React.createElement(
        'div',
        { className: 'input-group' },
        React.createElement(
            'label',
            { htmlFor: id, className: 'input-label' },
            label
        ),
        React.createElement('input', {
            type: type,
            id: id,
            value: value,
            onChange: onChange,
            className: 'input-field',
            required: true
        })
    );
}