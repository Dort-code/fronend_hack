import React, { useState } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import './LoginPage.css';

export function LoginPage({ onLogin, onClose }) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Функция проверки учетных данных с определением роли
        const authResult = mockAuthCheck(credentials.username, credentials.password);

        if (authResult.authenticated) {
            onLogin(authResult.role);
        } else {
            setError('Неверное имя пользователя или пароль');
        }
    };

    // Функция-заглушка для проверки учетных данных с ролями
    const mockAuthCheck = (username, password) => {
        // В реальном приложении здесь будет запрос к серверу
        if (username === 'admin' && password === 'admin123') {
            return { authenticated: true, role: 'admin' };
        }
        if (username === 'pred' && password === 'pred123') {
            return { authenticated: true, role: 'pred' };
        }
        if (username === 'user' && password === 'user123') {
            return { authenticated: true, role: 'user' };
        }
        return { authenticated: false };
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <form onSubmit={handleSubmit} className="login-form">
                    <h2>Вход в систему</h2>

                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn">
                        <FaSignInAlt size={16} />
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}