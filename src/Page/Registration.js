import { useState } from 'react';
import { FaUser, FaLock, FaIdCard, FaKey } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import './Registration.css';

export function Registration() {
    const API_BASE_URL = 'https://your-api-endpoint.com/api';
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        surname: '',
        login: '',
        password: '',
        token: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // Валидация формы
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Введите имя';
        if (!formData.lastName.trim()) newErrors.lastName = 'Введите фамилию';
        if (!formData.login.trim()) newErrors.login = 'Введите логин';
        if (formData.password.length < 6) newErrors.password = 'Пароль должен содержать минимум 6 символов';
        if (!formData.token.trim()) newErrors.token = 'Введите токен';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.name,
                    lastName: formData.lastName,
                    middleName: formData.surname,
                    username: formData.login,
                    password: formData.password,
                    registrationToken: formData.token
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка регистрации');
            }

            setRegistrationSuccess(true);
            setFormData({
                name: '',
                lastName: '',
                surname: '',
                login: '',
                password: '',
                token: '',
            });
        } catch (err) {
            setErrors({
                ...errors,
                form: err.message || 'Произошла ошибка при регистрации'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Обработчик изменения полей
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        // Очищаем ошибку при изменении поля
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    // Получение иконки для поля
    const getInputIcon = (fieldName) => {
        switch(fieldName) {
            case 'name':
            case 'lastName':
            case 'surname':
                return <FaUser />;
            case 'login':
                return <MdEmail />;
            case 'password':
                return <FaLock />;
            case 'token':
                return <FaKey />;
            default:
                return <FaIdCard />;
        }
    };

    // Создание поля ввода
    const createInputField = (id, label, value, onChange, type = 'text') => {
        return (
            <div className="input-group">
                <label htmlFor={id} className="input-label">
                    {getInputIcon(id)}
                    <span>{label}</span>
                </label>
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    className={`input-field ${errors[id] ? 'error' : ''}`}
                    required
                />
                {errors[id] && <span className="error-message">{errors[id]}</span>}
            </div>
        );
    };

    if (registrationSuccess) {
        return (
            <div className="form-overlay">
                <div className="form-container success-container">
                    <h1 className="form-title">Регистрация успешна!</h1>
                    <p className="success-message">
                        Ваш аккаунт успешно зарегистрирован.<br />
                        Теперь вы можете войти в систему.
                    </p>
                    <button
                        className="success-button"
                        onClick={() => setRegistrationSuccess(false)}
                    >
                        Вернуться к форме
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h1 className="form-title">Регистрация</h1>
                <p className="form-subtitle">Заполните форму для создания аккаунта</p>

                {errors.form && (
                    <div className="form-error">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form">
                    {createInputField('name', 'Имя', formData.name, handleInputChange, 'text')}
                    {createInputField('lastName', 'Фамилия', formData.lastName, handleInputChange, 'text')}
                    {createInputField('surname', 'Отчество', formData.surname, handleInputChange, 'text')}
                    {createInputField('login', 'Логин', formData.login, handleInputChange, 'text')}
                    {createInputField('password', 'Пароль', formData.password, handleInputChange, 'password')}
                    {createInputField('token', 'Регистрационный токен', formData.token, handleInputChange, 'text')}

                    <div className="form-footer">
                        <button
                            type="submit"
                            className={`submit-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}