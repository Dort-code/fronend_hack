import {useState} from 'react';
import './LoginPage.css'; // Импорт стилей
import React from 'react';

export function LoginPage() {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const handleSubmit = function (e) {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleInputChange = function (e) {
        const {id, value} = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h1 className="form-title">Добро пожаловать!</h1>
                <form onSubmit={handleSubmit} className="form">
                    {createInputField('login', 'Логин', formData.login, handleInputChange, 'login')}
                    {createInputField('password', 'Пароль', formData.password, handleInputChange, 'password')}
                    <button type="submit" className="submit-button">
                        Вход
                    </button>
                </form>
            </div>
        </div>
    );
}

// Вспомогательная функция для создания полей ввода
function createInputField(id, label, value, onChange, type = 'text') {
    return (
        <div className="input-group">
            <label htmlFor={id} className="input-label">
                {label}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                className="input-field"
                required
            />
        </div>
    );
}