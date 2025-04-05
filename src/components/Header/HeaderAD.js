import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { FiAlignJustify } from 'react-icons/fi';
import logo from "../../Page/TNS_Energo_logo.png";
import './HeaderAD.css';

export function HeaderAD({ toggleMenu, handleLogout, showMenu, menuRef, children }) {
    return (
        <header className="header">
            <button
                className="menu-btn"
                onClick={toggleMenu}
                aria-label="Меню"
                aria-expanded={showMenu}
            >
                <FiAlignJustify size={20} />
            </button>

            <div className="logo-container">
                <img src={logo} alt="Логотип ТНС Энерго" className="logo" />
            </div>

            <button
                className="logout-btn"
                onClick={handleLogout}
                aria-label="Выход"
            >
                <FaSignOutAlt size={20} />
            </button>

            {children}
        </header>
    );
}