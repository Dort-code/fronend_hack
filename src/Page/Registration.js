import {useState} from 'react';
import './Registration.css';

export function Registration() {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        surname: '',
        login: '',
        password: '',
        email: '',
        token: '',
    });

    const handleSubmit = function (e) {
        e.preventDefault();

        // Заглушка: просто выводим данные формы в консоль
        console.log('Данные формы:', formData);

        // Можно добавить здесь имитацию отправки на сервер
        alert(`Регистрация успешна!\nЛогин: ${formData.login}\nEmail: ${formData.email}`);

        // Очищаем форму
        setFormData({
            name: '',
            lastName: '',
            surname: '',
            login: '',
            password: '',
            email: '',
            token: '',
        });
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
                    {createInputField('lastName', 'Фамилия', formData.lastName, handleInputChange, 'text')}
                    {createInputField('surname', 'Отчество', formData.surname, handleInputChange, 'text')}
                    {createInputField('login', 'Логин', formData.login, handleInputChange, 'text')}
                    {createInputField('password', 'Пароль', formData.password, handleInputChange, 'password')}
                    {createInputField('email', 'Почта', formData.email, handleInputChange, 'email')}
                    {createInputField('token', 'Токен', formData.token, handleInputChange, 'text')}
                    <button type="submit" className="submit-button">
                        Зарегистрироваться
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