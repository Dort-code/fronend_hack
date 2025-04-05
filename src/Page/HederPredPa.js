import React, {useEffect, useRef, useState} from "react";
import {FaSignOutAlt, FaFileAlt, FaChevronDown, FaChevronUp} from "react-icons/fa";
import { FiAlignJustify } from 'react-icons/fi';
import { Protocol } from './Protocol';
import logo from "./TNS_Energo_logo.png";
import './HederPredPa.css';

export function HederPredPA({ onLogout }){
    const [notificationsList, setNotificationsList] = useState([
        { id: 1, text: "Новое сообщение", read: false, date: "2023-11-15 14:30" },
        { id: 2, text: "Обновление системы", read: false, date: "2023-11-14 10:15" },
        {
            id: 3,
            text: "Протоколы",
            form: "protocol",
            items: [
                { id: 31, text: "Протокол собрания от 10.11.2023", date: "2023-11-10" },
                { id: 32, text: "Протокол голосования №45", date: "2023-11-05" }
            ]
        }
    ]);

    const [activeForm, setActiveForm] = useState(null);
    const [expandedProtocols, setExpandedProtocols] = useState(false);
    const [selectedProtocol, setSelectedProtocol] = useState(null);
    const unreadCount = notificationsList.filter(n => !n.read && !n.form).length;
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationsRef = useRef(null);

    const handleNotificationClick = (notification) => {
        if (notification.form) {
            setActiveForm(notification.form);
            if (notification.form === 'protocol') {
                setExpandedProtocols(!expandedProtocols);
            }
        } else {
            setShowNotifications(false);
            if (!notification.read) {
                setNotificationsList(notificationsList.map(n =>
                    n.id === notification.id ? {...n, read: true} : n
                ));
            }
        }
    };

    const handleProtocolSelect = (protocol) => {
        setSelectedProtocol(protocol);
        setActiveForm('protocol');
        setShowNotifications(false);
    };

    const toggleNotifications = () => {
        const newShowState = !showNotifications;
        setShowNotifications(newShowState);
        setExpandedProtocols(false);

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
                    setExpandedProtocols(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

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
                    <div
                        className="notification-dropdown"
                        ref={notificationsRef}
                    >
                        <div className="dropdown-header">
                            <h4>Уведомления</h4>
                            <span className="unread-count">{unreadCount} новых</span>
                        </div>

                        <div className="notifications-list">
                            {notificationsList.map(notification => (
                                <div key={notification.id}>
                                    <div
                                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="notification-icon">
                                            {notification.form === 'protocol' ? <FaFileAlt /> : null}
                                        </div>
                                        <div className="notification-content">
                                            <div className="notification-text">{notification.text}</div>
                                            <div className="notification-date">{notification.date}</div>
                                        </div>
                                        {notification.form === 'protocol' && (
                                            <div className="notification-chevron">
                                                {expandedProtocols ? <FaChevronUp /> : <FaChevronDown />}
                                            </div>
                                        )}
                                    </div>

                                    {notification.form === 'protocol' && expandedProtocols && (
                                        <div className="protocol-submenu">
                                            {notification.items.map(item => (
                                                <div
                                                    key={item.id}
                                                    className="protocol-item"
                                                    onClick={() => handleProtocolSelect(item)}
                                                >
                                                    <div className="protocol-icon">
                                                        <FaFileAlt />
                                                    </div>
                                                    <div className="protocol-content">
                                                        <div className="protocol-text">{item.text}</div>
                                                        <div className="protocol-date">{item.date}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
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