import React, { useState, useEffect } from 'react';
import {
    FaVoteYea,
    FaCheck,
    FaTimes,
    FaClock,
    FaFileAlt,
    FaUsers,
    FaCalendarAlt,
    FaChartBar
} from 'react-icons/fa';
import './MainUserPA.css';

export function MainUserPA({ userGroups }) {
    const API_BASE_URL = 'https://your-api-endpoint.com/api';
    const [upcomingConference, setUpcomingConference] = useState(null);
    const [conferenceHistory, setConferenceHistory] = useState([]);
    const [activeVotes, setActiveVotes] = useState([]);
    const [pastVotes, setPastVotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVote, setSelectedVote] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [groupFiles, setGroupFiles] = useState([]);
    const [activeTab, setActiveTab] = useState('conference');

    // Загрузка данных пользователя
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userGroups || userGroups.length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const groupIds = userGroups.map(group => group.id);
                const requests = [
                    fetch(`${API_BASE_URL}/conferences/upcoming?groups=${groupIds.join(',')}`),
                    fetch(`${API_BASE_URL}/conferences/history?groups=${groupIds.join(',')}`),
                    fetch(`${API_BASE_URL}/votes?groups=${groupIds.join(',')}`),
                    fetch(`${API_BASE_URL}/files?groups=${groupIds.join(',')}`)
                ];

                const responses = await Promise.all(requests);

                // Проверка ошибок
                const errors = responses.filter(response => !response.ok);
                if (errors.length > 0) {
                    throw new Error('Ошибка загрузки данных');
                }

                const [conferenceData, historyData, votesData, filesData] = await Promise.all(
                    responses.map(res => res.json())
                );

                // Обработка данных
                setUpcomingConference(conferenceData.length > 0 ? conferenceData[0] : null);
                setConferenceHistory(historyData);

                const now = new Date();
                setActiveVotes(votesData.filter(vote => new Date(vote.deadline) > now));
                setPastVotes(votesData.filter(vote => new Date(vote.deadline) <= now));

                setGroupFiles(filesData);
            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userGroups]);

    // Отправка голоса
    const submitVote = async () => {
        if (!selectedVote || !selectedOption) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/votes/${selectedVote.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    option: selectedOption,
                    userId: localStorage.getItem('userId')
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка отправки голоса');
            }

            // Обновление локального состояния
            setActiveVotes(activeVotes.map(vote =>
                vote.id === selectedVote.id ? { ...vote, hasVoted: true } : vote
            ));
            setHasVoted(true);
            setSelectedVote(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionSelect = (option) => {
        if (!selectedVote || hasVoted || isLoading) return;
        setSelectedOption(option);
    };

    // Форматирование дат
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

    // Скачивание файла
    const downloadFile = async (fileId, fileName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/files/${fileId}/download`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Ошибка загрузки файла');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError(err.message);
        }
    };

    // Рендер контента по табам
    const renderTabContent = () => {
        switch(activeTab) {
            case 'conference':
                return (
                    <>
                        <section className="upcoming-conference">
                            <h2><FaCalendarAlt /> Ближайшая конференция</h2>
                            {upcomingConference ? (
                                <div className="conference-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Название:</span>
                                        <span className="detail-value">{upcomingConference.title}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Группа:</span>
                                        <span className="detail-value">
                      {userGroups.find(g => g.id === upcomingConference.groupId)?.name || 'Неизвестно'}
                    </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Дата и время:</span>
                                        <span className="detail-value">{formatDate(upcomingConference.date)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Ссылка:</span>
                                        <a
                                            href={upcomingConference.link}
                                            className="detail-value link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Перейти к конференции
                                        </a>
                                    </div>
                                    {upcomingConference.requiresPin && (
                                        <div className="detail-row">
                                            <span className="detail-label">PIN-код:</span>
                                            <span className="detail-value pin-code">
                        {upcomingConference.pinCode}
                      </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="no-conference">
                                    Нет запланированных конференций в ваших группах
                                </div>
                            )}
                        </section>

                        <section className="conference-history">
                            <h2><FaCalendarAlt /> История конференций</h2>
                            {conferenceHistory.length > 0 ? (
                                <div className="history-table">
                                    <div className="table-header">
                                        <div className="header-cell">Группа</div>
                                        <div className="header-cell">Дата</div>
                                        <div className="header-cell">Статус</div>
                                        <div className="header-cell">Документы</div>
                                    </div>
                                    {conferenceHistory.map((conference) => (
                                        <div key={conference.id} className="table-row">
                                            <div className="table-cell">
                                                {userGroups.find(g => g.id === conference.groupId)?.name || 'Неизвестно'}
                                            </div>
                                            <div className="table-cell">
                                                {formatDate(conference.date, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="table-cell">
                        <span className={`status-badge ${
                            conference.status === 'Завершено' ? 'completed' : 'processing'
                        }`}>
                          {conference.status}
                        </span>
                                            </div>
                                            <div className="table-cell">
                                                {conference.documentLink ? (
                                                    <a
                                                        href={conference.documentLink}
                                                        className="document-link"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Протокол
                                                    </a>
                                                ) : (
                                                    'Недоступно'
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-history">
                                    Нет данных о прошлых конференциях в ваших группах
                                </div>
                            )}
                        </section>
                    </>
                );

            case 'votes':
                return (
                    <>
                        <section className="active-votes">
                            <h2><FaVoteYea /> Активные голосования</h2>
                            {activeVotes.length > 0 ? (
                                <div className="votes-grid">
                                    {activeVotes.map(vote => (
                                        <div key={vote.id} className={`vote-card ${vote.hasVoted ? 'voted' : ''}`}>
                                            <div className="vote-header">
                                                <h3>{vote.question}</h3>
                                                <span className="vote-group">
                          {userGroups.find(g => g.id === vote.groupId)?.name || 'Неизвестно'}
                        </span>
                                            </div>
                                            <p className="vote-description">{vote.description}</p>

                                            <div className="vote-meta">
                        <span className="deadline">
                          <FaClock /> До: {formatDate(vote.deadline, {
                            day: 'numeric',
                            month: 'long'
                        })}
                        </span>
                                                {vote.documentLink && (
                                                    <a
                                                        href={vote.documentLink}
                                                        className="document-link"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Документ для ознакомления
                                                    </a>
                                                )}
                                            </div>

                                            {vote.hasVoted ? (
                                                <div className="vote-status voted-status">
                                                    <FaCheck /> Вы уже проголосовали
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedVote(vote);
                                                        setSelectedOption(null);
                                                        setHasVoted(false);
                                                    }}
                                                    className="vote-button"
                                                    disabled={isLoading}
                                                >
                                                    <FaVoteYea /> Проголосовать
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-votes">
                                    Нет активных голосований в ваших группах
                                </div>
                            )}
                        </section>

                        <section className="past-votes">
                            <h2><FaChartBar /> Завершенные голосования</h2>
                            {pastVotes.length > 0 ? (
                                <div className="votes-grid">
                                    {pastVotes.map(vote => (
                                        <div key={vote.id} className="vote-card past">
                                            <div className="vote-header">
                                                <h3>{vote.question}</h3>
                                                <span className="vote-group">
                          {userGroups.find(g => g.id === vote.groupId)?.name || 'Неизвестно'}
                        </span>
                                            </div>
                                            <p className="vote-description">{vote.description}</p>

                                            <div className="vote-meta">
                        <span className="deadline">
                          Завершено: {formatDate(vote.deadline, {
                            day: 'numeric',
                            month: 'long'
                        })}
                        </span>
                                                {vote.documentLink && (
                                                    <a
                                                        href={vote.documentLink}
                                                        className="document-link"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Итоговый документ
                                                    </a>
                                                )}
                                            </div>

                                            <div className="vote-results">
                                                {vote.options.map((option, index) => (
                                                    <div key={index} className="result-row">
                                                        <span className="option-label">{option}:</span>
                                                        <div className="result-bar-container">
                                                            <div
                                                                className="result-bar"
                                                                style={{ width: `${vote.results[index]}%` }}
                                                            ></div>
                                                            <span className="result-percent">
                                {vote.results[index]}%
                              </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-votes">
                                    Нет данных о завершенных голосованиях в ваших группах
                                </div>
                            )}
                        </section>
                    </>
                );

            case 'files':
                return (
                    <section className="group-files">
                        <h2><FaFileAlt /> Файлы групп</h2>
                        {groupFiles.length > 0 ? (
                            <div className="files-grid">
                                {groupFiles.map(file => (
                                    <div key={file.id} className="file-card">
                                        <div className="file-icon-container">
                                            <FaFileAlt className="file-icon" />
                                        </div>
                                        <div className="file-info">
                                            <span className="file-name">{file.name}</span>
                                            <div className="file-meta">
                        <span className="file-group">
                          <FaUsers /> {userGroups.find(g => g.id === file.groupId)?.name || 'Неизвестно'}
                        </span>
                                                <span className="file-date">
                          {formatDate(file.uploadDate, {
                              day: 'numeric',
                              month: 'long'
                          })}
                        </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => downloadFile(file.id, file.name)}
                                            className="download-btn"
                                        >
                                            Скачать
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-files">
                                Нет файлов в ваших группах
                            </div>
                        )}
                    </section>
                );

            default:
                return null;
        }
    };

    return (
        <main className="main-user-pa">
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
                    className={`tab-button ${activeTab === 'conference' ? 'active' : ''}`}
                    onClick={() => setActiveTab('conference')}
                >
                    <FaCalendarAlt /> Конференции
                </button>
                <button
                    className={`tab-button ${activeTab === 'votes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('votes')}
                >
                    <FaVoteYea /> Голосования
                </button>
                <button
                    className={`tab-button ${activeTab === 'files' ? 'active' : ''}`}
                    onClick={() => setActiveTab('files')}
                >
                    <FaFileAlt /> Файлы
                </button>
            </div>

            <div className="tab-content">
                {renderTabContent()}
            </div>

            {selectedVote && (
                <div className="vote-modal-overlay">
                    <div className="vote-modal-content">
                        <button
                            className="close-modal"
                            onClick={() => setSelectedVote(null)}
                            disabled={isLoading}
                        >
                            <FaTimes />
                        </button>

                        <h3>{selectedVote.question}</h3>
                        <p className="vote-description">{selectedVote.description}</p>

                        {selectedVote.documentLink && (
                            <a
                                href={selectedVote.documentLink}
                                className="document-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaFileAlt /> Открыть документ для ознакомления
                            </a>
                        )}

                        <div className="vote-options-list">
                            <h4>Варианты ответа:</h4>
                            {selectedVote.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`vote-option ${selectedOption === option ? 'selected' : ''}`}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>

                        <div className="vote-deadline">
                            <FaClock /> Голосование открыто до: {formatDate(selectedVote.deadline)}
                        </div>

                        <div className="vote-actions">
                            <button
                                onClick={() => setSelectedVote(null)}
                                className="cancel-btn"
                                disabled={isLoading}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={submitVote}
                                disabled={!selectedOption || hasVoted || isLoading}
                                className="submit-btn"
                            >
                                {isLoading ? 'Отправка...' : hasVoted ? 'Вы уже проголосовали' : 'Подтвердить выбор'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}