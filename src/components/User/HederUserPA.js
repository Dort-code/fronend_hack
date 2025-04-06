import React, { useEffect, useRef, useState } from "react";
import { FaBell, FaSignOutAlt, FaEnvelope, FaUsers, FaVoteYea, FaFileDownload } from "react-icons/fa";
import logo from "../../Page/TNS_Energo_logo.png";
import './HederUserPA.css';

export function HederUserPA({ onLogout, userId }) {
    const API_BASE_URL = 'https://your-api-endpoint.com/api';
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationsRef = useRef(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // Загрузка уведомлений
    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/notifications`);
            if (!response.ok) throw new Error('Ошибка загрузки уведомлений');
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (err) {
            console.error('Notification error:', err);
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
            console.error('Mark read error:', err);
        }
    };

    // Обработчик клика по уведомлениям
    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead([notification.id]);
        }
        // Дополнительная логика в зависимости от типа уведомления
    };

    // Иконка для типа уведомления
    const getNotificationIcon = (type) => {
        switch(type) {
            case 'group_invite': return <FaUsers />;
            case 'conference': return <FaEnvelope />;
            case 'vote': return <FaVoteYea />;
            case 'file': return <FaFileDownload />;
            default: return <FaBell />;
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Обновление каждую минуту
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                if (!event.target.closest('.notification-btn')) {
                    setShowNotifications(false);
                    // Помечаем все как прочитанные при закрытии
                    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
                    if (unreadIds.length > 0) markAsRead(unreadIds);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [notifications]);

    return (
        <header className="header">
            <button
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Уведомления"
            >
                <FaBell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            <div className="logo-container">
                <img src={logo} alt="Логотип ТНС Энерго" className="logo" />
            </div>

            <button className="logout-btn" onClick={onLogout} aria-label="Выход">
                <FaSignOutAlt size={20} />
            </button>

            {showNotifications && (
                <div className="notification-dropdown" ref={notificationsRef}>
                    <div className="dropdown-header">
                        <h3>Уведомления</h3>
                        <button
                            onClick={() => markAsRead(notifications.map(n => n.id))}
                            className="mark-all-read"
                        >
                            Прочитать все
                        </button>
                    </div>

                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map(notification => (
                                <li
                                    key={notification.id}
                                    className={notification.read ? 'read' : 'unread'}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-icon">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <p className="notification-text">{notification.message}</p>
                                        <span className="notification-time">
                                            {new Date(notification.createdAt).toLocaleTimeString('ru-RU', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-notifications">Новых уведомлений нет</p>
                    )}
                </div>
            )}
        </header>
    );
}