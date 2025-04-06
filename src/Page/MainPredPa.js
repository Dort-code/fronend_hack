import React, { useState, useEffect } from 'react';
import {
    FaFileAlt,
    FaUsers,
    FaCalendarAlt,
    FaVoteYea,
    FaChartBar,
    FaPlus
} from 'react-icons/fa';
import './MainPredPa.css';

export function MainPredPA({ userGroups }) {
    const API_BASE_URL = 'https://your-api-endpoint.com/api';
    const [activeTab, setActiveTab] = useState('conferences');
    const [conferences, setConferences] = useState([]);
    const [votes, setVotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [conferencesRes, votesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/conferences`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }),
                    fetch(`${API_BASE_URL}/votes`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                ]);

                if (!conferencesRes.ok) throw new Error('Ошибка загрузки конференций');
                if (!votesRes.ok) throw new Error('Ошибка загрузки голосований');

                const conferencesData = await conferencesRes.json();
                const votesData = await votesRes.json();

                setConferences(conferencesData);
                setVotes(votesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Форматирование даты
    const formatDate = (dateString, options = {}) => {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('ru-RU', { ...defaultOptions, ...options });
    };

    // Рендер контента по табам
    const renderTabContent = () => {
        switch(activeTab) {
            case 'conferences':
                return (
                    <div className="conferences-section">
                        <h2><FaCalendarAlt /> Управление конференциями</h2>
                        <button
                            className="create-button"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <FaPlus /> Создать конференцию
                        </button>

                        {conferences.length > 0 ? (
                            <div className="conferences-list">
                                {conferences.map(conference => (
                                    <div key={conference.id} className="conference-card">
                                        <h3>{conference.title}</h3>
                                        <div className="conference-meta">
                                            <span>
                                                <FaCalendarAlt /> {formatDate(conference.date)}
                                            </span>
                                            <span>
                                                <FaUsers /> {conference.participantsCount} участников
                                            </span>
                                        </div>
                                        <div className="conference-actions">
                                            <button className="edit-btn">Редактировать</button>
                                            <button className="details-btn">Подробнее</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">Нет запланированных конференций</div>
                        )}
                    </div>
                );

            case 'votes':
                return (
                    <div className="votes-section">
                        <h2><FaVoteYea /> Управление голосованиями</h2>
                        <button
                            className="create-button"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <FaPlus /> Создать голосование
                        </button>

                        {votes.length > 0 ? (
                            <div className="votes-list">
                                {votes.map(vote => (
                                    <div key={vote.id} className="vote-card">
                                        <h3>{vote.question}</h3>
                                        <div className="vote-meta">
                                            <span>
                                                <FaCalendarAlt /> До: {formatDate(vote.deadline, {
                                                day: 'numeric',
                                                month: 'long'
                                            })}
                                            </span>
                                            <span>
                                                <FaChartBar /> {vote.votesCount} голосов
                                            </span>
                                        </div>
                                        <div className="vote-actions">
                                            <button className="edit-btn">Редактировать</button>
                                            <button className="results-btn">Результаты</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">Нет активных голосований</div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <main className="main-pred-pa">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Загрузка данных...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>Закрыть</button>
                </div>
            )}

            <div className="content-tabs">
                <button
                    className={`tab-button ${activeTab === 'conferences' ? 'active' : ''}`}
                    onClick={() => setActiveTab('conferences')}
                >
                    <FaCalendarAlt /> Конференции
                </button>
                <button
                    className={`tab-button ${activeTab === 'votes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('votes')}
                >
                    <FaVoteYea /> Голосования
                </button>
            </div>

            <div className="tab-content">
                {renderTabContent()}
            </div>

            {/* Модальное окно создания */}
            {showCreateModal && (
                <div className="create-modal-overlay">
                    <div className="create-modal-content">
                        <h2>
                            {activeTab === 'conferences'
                                ? 'Создать новую конференцию'
                                : 'Создать новое голосование'}
                        </h2>
                        {/* Форма создания будет здесь */}
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Отмена
                            </button>
                            <button className="create-btn">
                                Создать
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}