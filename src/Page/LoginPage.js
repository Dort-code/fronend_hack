import React, {useState} from 'react';
import {FaSignInAlt} from 'react-icons/fa';
import './LoginPage.css';

export function LoginPage({onLogin}) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://109.73.199.232/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password
                })
            });

            if (!response.ok) {
                throw new Error('Неверное имя пользователя или пароль');
            }

            const data = await response.json();

            if (data.authenticated) {
                onLogin(data.role);
            } else {
                setError(data.message || 'Не удалось войти в систему');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
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

                <button
                    type="submit"
                    className="login-btn"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        'Загрузка...'
                    ) : (
                        <>
                            <FaSignInAlt size={16}/>
                            Войти
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}