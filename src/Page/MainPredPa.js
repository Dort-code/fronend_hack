import React, { useState, useEffect } from 'react';
import { FaVoteYea, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import './MainPredPa.css';

export function MainPredPA() {
    // Состояние для ближайшей конференции
    const [upcomingConference, setUpcomingConference] = useState(null);
    const [pinCode, setPinCode] = useState('');
    const [conferenceHistory, setConferenceHistory] = useState([]);
    const [activeVotes, setActiveVotes] = useState([]);
    const [pastVotes, setPastVotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error] = useState(null);
    const [selectedVote, setSelectedVote] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    // Заглушка для загрузки данных о ближайшей конференции
    const fetchUpcomingConference = () => {
        setIsLoading(true);
        setTimeout(() => {
            setUpcomingConference({
                id: 1,
                title: "Ежеквартальное собрание акционеров",
                date: "2023-11-15T14:00:00",
                link: "https://meet.example.com/conf123",
                form: "Форма голосования №45",
                requiresPin: true
            });
            setIsLoading(false);
        }, 1000);
    };

    // Заглушка для загрузки истории конференций
    const fetchConferenceHistory = () => {
        setTimeout(() => {
            setConferenceHistory([
                {
                    id: 1,
                    date: "2023-08-10",
                    status: "Завершено",
                    documentLink: "https://docs.example.com/protocol1.pdf"
                },
                {
                    id: 2,
                    date: "2023-05-15",
                    status: "Завершено",
                    documentLink: "https://docs.example.com/protocol2.pdf"
                },
                {
                    id: 3,
                    date: "2023-02-20",
                    status: "В обработке",
                    documentLink: null
                }
            ]);
        }, 1500);
    };

    // Заглушка для загрузки активных голосований
    const fetchActiveVotes = () => {
        setTimeout(() => {
            setActiveVotes([
                {
                    id: 1,
                    question: "Утверждение годового отчета за 2023 год",
                    description: "Голосование по утверждению финансового отчета компании",
                    options: ["За", "Против", "Воздержался"],
                    deadline: "2023-11-20T18:00:00",
                    documentLink: "https://docs.example.com/report2023.pdf",
                    hasVoted: false
                },
                {
                    id: 2,
                    question: "Избрание нового состава правления",
                    description: "Голосование по кандидатурам в правление компании",
                    options: ["За", "Против", "Воздержался"],
                    deadline: "2023-11-25T18:00:00",
                    documentLink: "https://docs.example.com/board_candidates.pdf",
                    hasVoted: true
                }
            ]);
        }, 1200);
    };

    // Заглушка для загрузки завершенных голосований
    const fetchPastVotes = () => {
        setTimeout(() => {
            setPastVotes([
                {
                    id: 3,
                    question: "Изменения в уставе компании",
                    description: "Голосование по поправкам к уставу",
                    options: ["За", "Против", "Воздержался"],
                    deadline: "2023-08-15T18:00:00",
                    documentLink: "https://docs.example.com/statute_changes.pdf",
                    results: [65, 10, 25] // Проценты голосов
                },
                {
                    id: 4,
                    question: "Утверждение дивидендной политики",
                    description: "Голосование по размеру и порядку выплаты дивидендов",
                    options: ["За", "Против", "Воздержался"],
                    deadline: "2023-05-20T18:00:00",
                    documentLink: "https://docs.example.com/dividend_policy.pdf",
                    results: [82, 8, 10]
                }
            ]);
        }, 1300);
    };

    useEffect(() => {
        fetchUpcomingConference();
        fetchConferenceHistory();
        fetchActiveVotes();
        fetchPastVotes();
    }, []);

    const handlePinSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted PIN:', pinCode);
        // Здесь будет логика проверки пин-кода
    };

    const handleVoteSelect = (vote) => {
        setSelectedVote(vote);
        setSelectedOption(null);
        setHasVoted(vote.hasVoted);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const submitVote = () => {
        if (selectedVote && selectedOption) {
            // Заглушка для отправки голоса
            console.log(`Voted for option: ${selectedOption} in vote ${selectedVote.id}`);

            // Обновляем состояние - помечаем голосование как завершенное
            setActiveVotes(activeVotes.map(vote =>
                vote.id === selectedVote.id ? { ...vote, hasVoted: true } : vote
            ));

            setHasVoted(true);
            setSelectedVote(null);
        }
    };

    const formatConferenceDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    const formatDeadline = (dateString) => {
        const options = {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    return (
        <main className="main-user-pa">
            <section className="upcoming-conference">
                <h2>Ближайшая конференция</h2>

                {isLoading ? (
                    <div className="loading">Загрузка данных...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : upcomingConference ? (
                    <div className="conference-details">
                        <div className="detail-row">
                            <span className="detail-label">Название:</span>
                            <span className="detail-value">{upcomingConference.title}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Дата и время:</span>
                            <span className="detail-value">{formatConferenceDate(upcomingConference.date)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Ссылка:</span>
                            <a href={upcomingConference.link} className="detail-value link">
                                Перейти к конференции
                            </a>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Форма:</span>
                            <span className="detail-value">{upcomingConference.form}</span>
                        </div>

                        {upcomingConference.requiresPin && (
                            <form onSubmit={handlePinSubmit} className="pin-form">
                                <label htmlFor="pin-code">Введите PIN-код:</label>
                                <input
                                    type="password"
                                    id="pin-code"
                                    value={pinCode}
                                    onChange={(e) => setPinCode(e.target.value)}
                                    placeholder="Введите ваш PIN"
                                    required
                                />
                                <button type="submit" className="submit-pin">
                                    Подтвердить
                                </button>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="no-conference">Нет запланированных конференций</div>
                )}
            </section>

            <section className="active-votes">
                <h2>Активные голосования</h2>
                {activeVotes.length > 0 ? (
                    <div className="votes-grid">
                        {activeVotes.map(vote => (
                            <div key={vote.id} className={`vote-card ${vote.hasVoted ? 'voted' : ''}`}>
                                <h3>{vote.question}</h3>
                                <p className="vote-description">{vote.description}</p>

                                <div className="vote-meta">
                                    <span className="deadline">
                                        <FaClock /> До: {formatDeadline(vote.deadline)}
                                    </span>
                                    {vote.documentLink && (
                                        <a href={vote.documentLink} className="document-link">
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
                                        onClick={() => handleVoteSelect(vote)}
                                        className="vote-button"
                                    >
                                        <FaVoteYea /> Проголосовать
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-votes">Нет активных голосований</div>
                )}
            </section>

            <section className="conference-history">
                <h2>История конференций</h2>
                {conferenceHistory.length > 0 ? (
                    <div className="history-table">
                        <div className="table-header">
                            <div className="header-cell">Дата</div>
                            <div className="header-cell">Статус</div>
                            <div className="header-cell">Документы</div>
                        </div>
                        {conferenceHistory.map((conference) => (
                            <div key={conference.id} className="table-row">
                                <div className="table-cell">{conference.date}</div>
                                <div className="table-cell">
                                    <span className={`status-badge ${conference.status === 'Завершено' ? 'completed' : 'processing'}`}>
                                        {conference.status}
                                    </span>
                                </div>
                                <div className="table-cell">
                                    {conference.documentLink ? (
                                        <a href={conference.documentLink} className="document-link">
                                            Скачать протокол
                                        </a>
                                    ) : (
                                        'Недоступно'
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-history">Нет данных о прошлых конференциях</div>
                )}
            </section>

            <section className="past-votes">
                <h2>Завершенные голосования</h2>
                {pastVotes.length > 0 ? (
                    <div className="votes-grid">
                        {pastVotes.map(vote => (
                            <div key={vote.id} className="vote-card past">
                                <h3>{vote.question}</h3>
                                <p className="vote-description">{vote.description}</p>

                                <div className="vote-meta">
                                    <span className="deadline">
                                        Завершено: {formatDeadline(vote.deadline)}
                                    </span>
                                    {vote.documentLink && (
                                        <a href={vote.documentLink} className="document-link">
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
                                                <span className="result-percent">{vote.results[index]}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-votes">Нет данных о завершенных голосованиях</div>
                )}
            </section>

            {/* Модальное окно для голосования */}
            {selectedVote && (
                <div className="vote-modal-overlay">
                    <div className="vote-modal-content">
                        <button
                            className="close-modal"
                            onClick={() => setSelectedVote(null)}
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
                                Открыть документ для ознакомления
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
                            <FaClock /> Голосование открыто до: {formatDeadline(selectedVote.deadline)}
                        </div>

                        <div className="vote-actions">
                            <button
                                onClick={() => setSelectedVote(null)}
                                className="cancel-btn"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={submitVote}
                                disabled={!selectedOption || hasVoted}
                                className="submit-btn"
                            >
                                {hasVoted ? 'Вы уже проголосовали' : 'Подтвердить выбор'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}