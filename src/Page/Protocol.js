import React, { useState } from 'react';
import './Protocol.css';

export function Protocol({ onClose }) {
    const [activeForm, setActiveForm] = useState('protocol');

    // Данные для формы протокола
    const [protocolData, setProtocolData] = useState({
        protocolNumber: '',
        submissionDeadline: '',
        votingLocation: '',
        protocolDate: '',
        participants: '',
        voteCounter: '',
        questions: [{ text: '', description: '', results: '' }]
    });

    // Данные для формы проекта решения
    const [resolutionData, setResolutionData] = useState({
        date: '',
        questions: [{ text: '', resolution: '' }]
    });

    // Обработчики для формы протокола
    const handleProtocolInputChange = (e) => {
        const { name, value } = e.target;
        setProtocolData({ ...protocolData, [name]: value });
    };

    const handleProtocolQuestionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedQuestions = [...protocolData.questions];
        updatedQuestions[index][name] = value;
        setProtocolData({ ...protocolData, questions: updatedQuestions });
    };

    const addProtocolQuestion = () => {
        setProtocolData({
            ...protocolData,
            questions: [...protocolData.questions, { text: '', description: '', results: '' }]
        });
    };

    const removeProtocolQuestion = (index) => {
        const updatedQuestions = [...protocolData.questions];
        updatedQuestions.splice(index, 1);
        setProtocolData({ ...protocolData, questions: updatedQuestions });
    };

    const saveProtocol = () => {
        console.log('Сохраненные данные протокола:', protocolData);
        onClose();
    };

    // Обработчики для формы проекта решения
    const handleResolutionInputChange = (e) => {
        const { name, value } = e.target;
        setResolutionData({ ...resolutionData, [name]: value });
    };

    const handleResolutionQuestionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedQuestions = [...resolutionData.questions];
        updatedQuestions[index][name] = value;
        setResolutionData({ ...resolutionData, questions: updatedQuestions });
    };

    const addResolutionQuestion = () => {
        setResolutionData({
            ...resolutionData,
            questions: [...resolutionData.questions, { text: '', resolution: '' }]
        });
    };

    const removeResolutionQuestion = (index) => {
        const updatedQuestions = [...resolutionData.questions];
        updatedQuestions.splice(index, 1);
        setResolutionData({ ...resolutionData, questions: updatedQuestions });
    };

    const saveResolution = () => {
        console.log('Сохраненные данные проекта решения:', resolutionData);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Просмотр итогов</h2>

                <div className="form-buttons">
                    <button
                        onClick={() => setActiveForm('protocol')}
                        className={activeForm === 'protocol' ? 'active' : ''}
                    >
                        Протокол
                    </button>
                    <button
                        onClick={() => setActiveForm('resolution')}
                        className={activeForm === 'resolution' ? 'active' : ''}
                    >
                        Проект решения
                    </button>
                </div>

                {activeForm === 'protocol' && (
                    <div className="form-section">
                        <div className="form-group">
                            <label>Номер протокола:</label>
                            <input
                                type="text"
                                name="protocolNumber"
                                value={protocolData.protocolNumber}
                                onChange={handleProtocolInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Дата и время окончания приема документов:</label>
                            <input
                                type="datetime-local"
                                name="submissionDeadline"
                                value={protocolData.submissionDeadline}
                                onChange={handleProtocolInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Место проведения голосования:</label>
                            <input
                                type="text"
                                name="votingLocation"
                                value={protocolData.votingLocation}
                                onChange={handleProtocolInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Дата составления протокола:</label>
                            <input
                                type="date"
                                name="protocolDate"
                                value={protocolData.protocolDate}
                                onChange={handleProtocolInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Лица, принявшие участие:</label>
                            <input
                                type="text"
                                name="participants"
                                value={protocolData.participants}
                                onChange={handleProtocolInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Лицо, проводящее подсчет голосов:</label>
                            <input
                                type="text"
                                name="voteCounter"
                                value={protocolData.voteCounter}
                                onChange={handleProtocolInputChange}
                            />
                        </div>

                        <h3>Вопросы голосования:</h3>
                        {protocolData.questions.map((question, index) => (
                            <div key={index} className="question-group">
                                <div className="form-group">
                                    <label>Вопрос {index + 1}:</label>
                                    <input
                                        type="text"
                                        name="text"
                                        value={question.text}
                                        onChange={(e) => handleProtocolQuestionChange(index, e)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Описание:</label>
                                    <textarea
                                        name="description"
                                        value={question.description}
                                        onChange={(e) => handleProtocolQuestionChange(index, e)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Результаты голосования:</label>
                                    <input
                                        type="text"
                                        name="results"
                                        value={question.results}
                                        onChange={(e) => handleProtocolQuestionChange(index, e)}
                                    />
                                </div>

                                {protocolData.questions.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-question"
                                        onClick={() => removeProtocolQuestion(index)}
                                    >
                                        Удалить вопрос
                                    </button>
                                )}
                            </div>
                        ))}

                        <button type="button" className="add-question" onClick={addProtocolQuestion}>
                            Добавить вопрос
                        </button>

                        <div className="form-actions">
                            <button onClick={saveProtocol} className="save-btn">
                                Сохранить
                            </button>
                            <button onClick={onClose} className="close-btn">
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}

                {activeForm === 'resolution' && (
                    <div className="form-section">
                        <div className="form-group">
                            <label>Дата:</label>
                            <input
                                type="date"
                                name="date"
                                value={resolutionData.date}
                                onChange={handleResolutionInputChange}
                            />
                        </div>

                        <h3>Вопросы и проекты решений:</h3>
                        {resolutionData.questions.map((question, index) => (
                            <div key={index} className="question-group">
                                <div className="form-group">
                                    <label>Вопрос {index + 1}:</label>
                                    <input
                                        type="text"
                                        name="text"
                                        value={question.text}
                                        onChange={(e) => handleResolutionQuestionChange(index, e)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Проект решения:</label>
                                    <textarea
                                        name="resolution"
                                        value={question.resolution}
                                        onChange={(e) => handleResolutionQuestionChange(index, e)}
                                    />
                                </div>

                                {resolutionData.questions.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-question"
                                        onClick={() => removeResolutionQuestion(index)}
                                    >
                                        Удалить вопрос
                                    </button>
                                )}
                            </div>
                        ))}

                        <button type="button" className="add-question" onClick={addResolutionQuestion}>
                            Добавить вопрос
                        </button>

                        <div className="form-actions">
                            <button onClick={saveResolution} className="save-btn">
                                Сохранить
                            </button>
                            <button onClick={onClose} className="close-btn">
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}