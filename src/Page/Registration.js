import {useState} from 'react';
import './Registration.css'; // Импорт стилей
import React from 'react';

export function Registration() {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        surname: '',
        login: '',
        password: '',
        email: '',
        token: '',
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
                    {createInputField('name', 'Имя', formData.name, handleInputChange, 'text')}
                    {createInputField('lastName', 'Фамилия', formData.lastname, handleInputChange, 'text')}
                    {createInputField('surname', 'Отчество', formData.surname, handleInputChange, 'text')}
                    {createInputField('login', 'Логин', formData.login, handleInputChange, 'text')}
                    {createInputField('password', 'Пароль', formData.password, handleInputChange, 'password')}
                    {createInputField('email', 'Почта', formData.email, handleInputChange, 'text')}
                    {createInputField('token', 'Токен', formData.token, handleInputChange, 'text')}
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