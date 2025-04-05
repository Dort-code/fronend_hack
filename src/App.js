import React, { useState } from 'react';
import { UserPA } from './Page/UserPA';
import { AdminPA } from './Page/AdminPA';
import './Page/HederUserPA.css';
import logo from "./Page/TNS_Energo_logo.png";
import { FaSignInAlt } from "react-icons/fa";
import { LoginPage } from './Page/LoginPage';

function App() {
    const [authInfo, setAuthInfo] = useState({
        isLoggedIn: false,
        role: null
    });
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleSuccessfulLogin = (role) => {
        setAuthInfo({
            isLoggedIn: true,
            role: role
        });
        setShowLoginModal(false);
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        setAuthInfo({
            isLoggedIn: false,
            role: null
        });
    };

    return (
        <div className="app-container">
            {!authInfo.isLoggedIn ? (
                <header className="header">
                    <div className="logo-container">
                        <img src={logo} alt="Логотип ТНС Энерго" className="logo" />
                    </div>
                    <button
                        className="login-btn"
                        onClick={handleLoginClick}
                        aria-label="Вход"
                    >
                        <FaSignInAlt size={18} />
                        <span className="login-text">Войти</span>
                    </button>
                </header>
            ) : authInfo.role === 'admin' ? (
                <AdminPA onLogout={handleLogout} />
            ) : (
                <UserPA onLogout={handleLogout} />
            )}

            {!authInfo.isLoggedIn && !showLoginModal && (
                <div className="welcome-message">
                    <h2>Добро пожаловать в систему ТНС Энерго</h2>
                    <p>Пожалуйста, войдите в систему для доступа к функциям</p>
                </div>
            )}

            {showLoginModal && (
                <LoginPage
                    onLogin={handleSuccessfulLogin}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default App;