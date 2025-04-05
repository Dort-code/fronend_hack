import React, {useEffect, useRef, useState} from "react";
import {FaSignOutAlt} from "react-icons/fa";
import { FiAlignJustify } from 'react-icons/fi';
import { Protocol } from '../Page/Protocol';
import logo from "./TNS_Energo_logo.png";
import './HederPredPa.css';

export function HederPredPA({ onLogout }){
    const [notificationsList, setNotificationsList] = useState([
        { id: 1, text: "Новое сообщение", read: false },
        { id: 2, text: "Обновление системы", read: false },
        { id: 3, text: "Протоколы", form: "protocol" }
    ]);

    const [activeForm, setActiveForm] = useState(null);
    const unreadCount = notificationsList.filter(n => !n.read && !n.form).length;
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationsRef = useRef(null);

    const handleNotificationClick = (notification) => {
        if (notification.form) {
            setActiveForm(notification.form);
        }
        setShowNotifications(false);

        // Помечаем как прочитанное, только если это не форма
        if (!notification.form && !notification.read) {
            setNotificationsList(notificationsList.map(n =>
                n.id === notification.id ? {...n, read: true} : n
            ));
        }
    };

    const toggleNotifications = () => {
        const newShowState = !showNotifications;
        setShowNotifications(newShowState);

        if (newShowState && unreadCount > 0) {
            setNotificationsList(notificationsList.map(n =>
                !n.form && !n.read ? {...n, read: true} : n
            ));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                if (!event.target.closest('.notification-btn')) {
                    setShowNotifications(false);
                }
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <>
            <header className="header">
                <button
                    className="notification-btn"
                    onClick={toggleNotifications}
                    aria-label="Уведомления"
                    aria-expanded={showNotifications}
                >
                    <FiAlignJustify size={20} />
                    {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount}</span>
                    )}
                </button>

                <div className="logo-container">
                    <img src={logo} alt="Логотип ТНС Энерго" className="logo" />
                </div>

                <button
                    className="logout-btn"
                    onClick={onLogout}
                    aria-label="Выход"
                >
                    <FaSignOutAlt size={20} />
                </button>

                {showNotifications && (
                    <div
                        className="notification-dropdown"
                        ref={notificationsRef}
                    >
                        {notificationsList.length > 0 ? (
                            <ul>
                                {notificationsList.map(notification => (
                                    <li
                                        key={notification.id}
                                        className={notification.read ? 'read' : 'unread'}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        {notification.text}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Новых уведомлений нет</p>
                        )}
                    </div>
                )}
            </header>

            <div className="pred-content-area">
                {activeForm === 'protocol' && (
                    <div className="content-section">
                        <Protocol onClose={() => setActiveForm(null)} />
                    </div>
                )}
            </div>
        </>
    );
}