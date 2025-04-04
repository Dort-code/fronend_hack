import React, { useState, useEffect } from 'react';
import './MainUserPA.css';

export function MainUserPA() {
    // Состояние для ближайшей конференции
    const [upcomingConference, setUpcomingConference] = useState(null);
    const [pinCode, setPinCode] = useState('');
    const [conferenceHistory, setConferenceHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Заглушка для загрузки данных о ближайшей конференции
    const fetchUpcomingConference = () => {
        setIsLoading(true);
        // Имитация загрузки данных с сервера
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

    useEffect(() => {
        fetchUpcomingConference();
        fetchConferenceHistory();
    }, []);

    const handlePinSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted PIN:', pinCode);
        // Здесь будет логика проверки пин-кода
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
        </main>
    );
}