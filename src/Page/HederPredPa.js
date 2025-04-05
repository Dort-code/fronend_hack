import React, { useEffect, useRef, useState } from "react";
import { FaSignOutAlt, FaFileAlt, FaChevronDown, FaChevronUp, FaBell } from "react-icons/fa";
import { FiAlignJustify } from 'react-icons/fi';
import { Protocol } from './Protocol';
import logo from "./TNS_Energo_logo.png";
import './HederPredPa.css';

export function HederPredPA({ onLogout }) {
    const API_BASE_URL = 'https://your-api-endpoint.com/api';
    const [notifications, setNotifications] = useState([]);
    const [activeForm, setActiveForm] = useState(null);
    const [expandedProtocols, setExpandedProtocols] = useState(false);
    const [selectedProtocol, setSelectedProtocol] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const notificationsRef = useRef(null);

    // Загрузка уведомлений
    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Ошибка загрузки уведомлений');

            const data = await response.json();
            setNotifications(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Отметка уведомлений как прочитанных
    const markAsRead = async (notificationIds) => {
        try {
            await fetch(`${API_BASE_URL}/notifications/mark-read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ notificationIds })
            });
            fetchNotifications();
        } catch (err) {
            console.error('Ошибка отметки как прочитано:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleNotificationClick = (notification) => {
        if (notification.type === 'protocol') {
            setActiveForm('protocol');
            setSelectedProtocol(notification);
            setShowNotifications(false);
        } else {
            if (!notification.read) {
                markAsRead([notification.id]);
            }
            // Дополнительная логика для других типов уведомлений
        }
    };

    const toggleNotifications = () => {
        const newShowState = !showNotifications;
        setShowNotifications(newShowState);
        setExpandedProtocols(false);

        if (newShowState && notifications.some(n => !n.read)) {
            const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
            if (unreadIds.length > 0) markAsRead(unreadIds);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                if (!event.target.closest('.notification-btn')) {
                    setShowNotifications(false);
                    setExpandedProtocols(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
            <header className="header">
                <div className="header-left">
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
                </div>

                <div className="logo-container">
                    <img src={logo} alt="Логотип ТНС Энерго" className="logo" />
                    <div className="user-role">Председатель</div>
                </div>

                <div className="header-right">
                    <button
                        className="logout-btn"
                        onClick={onLogout}
                        aria-label="Выход"
                    >
                        <FaSignOutAlt size={20} />
                        <span className="logout-text">Выйти</span>
                    </button>
                </div>

                {showNotifications && (
                    <div className="notification-dropdown" ref={notificationsRef}>
                        <div className="dropdown-header">
                            <h4>Уведомления</h4>
                            <span className="unread-count">{unreadCount} новых</span>
                        </div>

                        {isLoading ? (
                            <div className="loading-notifications">Загрузка...</div>
                        ) : error ? (
                            <div className="error-message">{error}</div>
                        ) : notifications.length > 0 ? (
                            <div className="notifications-list">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="notification-icon">
                                            {notification.type === 'protocol' && <FaFileAlt />}
                                            {notification.type === 'vote' && <FaBell />}
                                        </div>
                                        <div className="notification-content">
                                            <div className="notification-text">{notification.message}</div>
                                            <div className="notification-date">
                                                {new Date(notification.createdAt).toLocaleString('ru-RU', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-notifications">Новых уведомлений нет</div>
                        )}
                    </div>
                )}
            </header>

            <div className="pred-content-area">
                {activeForm === 'protocol' && (
                    <div className="content-section">
                        <Protocol
                            protocol={selectedProtocol}
                            onClose={() => {
                                setActiveForm(null);
                                setSelectedProtocol(null);
                            }}
                        />
                    </div>
                )}
            </div>
        </>
    );
}