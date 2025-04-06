import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaFilePdf } from 'react-icons/fa';
import './Protocol.css';

export function Protocol({ protocol, onClose }) {
    const API_BASE_URL = 'https://your-api-endpoint.com/api';
    const [activeForm, setActiveForm] = useState('protocol');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Данные форм
    const [formData, setFormData] = useState({
        protocolNumber: '',
        date: '',
        participants: [],
        questions: []
    });

    const [resolutionData, setResolutionData] = useState({
        date: '',
        decisions: []
    });

    // Загрузка данных протокола
    useEffect(() => {
        if (protocol) {
            const fetchProtocolData = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`${API_BASE_URL}/protocols/${protocol.id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (!response.ok) throw new Error('Ошибка загрузки протокола');

                    const data = await response.json();
                    setFormData(data.protocol);
                    setResolutionData(data.resolution);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchProtocolData();
        } else {
            // Инициализация пустых форм
            setFormData({
                protocolNumber: '',
                date: new Date().toISOString().split('T')[0],
                participants: [],
                questions: [{
                    text: '',
                    description: '',
                    results: ''
                }]
            });

            setResolutionData({
                date: new Date().toISOString().split('T')[0],
                decisions: [{
                    question: '',
                    resolution: ''
                }]
            });
        }
    }, [protocol]);

    // Обработчики для формы протокола
    const handleProtocolChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuestionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
        setFormData(prev => ({ ...prev, questions: updatedQuestions }));
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                { text: '', description: '', results: '' }
            ]
        }));
    };

    const removeQuestion = (index) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions.splice(index, 1);
        setFormData(prev => ({ ...prev, questions: updatedQuestions }));
    };

    // Обработчики для формы решения
    const handleResolutionChange = (e) => {
        const { name, value } = e.target;
        setResolutionData(prev => ({ ...prev, [name]: value }));
    };

    const handleDecisionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedDecisions = [...resolutionData.decisions];
        updatedDecisions[index] = { ...updatedDecisions[index], [name]: value };
        setResolutionData(prev => ({ ...prev, decisions: updatedDecisions }));
    };

    const addDecision = () => {
        setResolutionData(prev => ({
            ...prev,
            decisions: [
                ...prev.decisions,
                { question: '', resolution: '' }
            ]
        }));
    };

    const removeDecision = (index) => {
        const updatedDecisions = [...resolutionData.decisions];
        updatedDecisions.splice(index, 1);
        setResolutionData(prev => ({ ...prev, decisions: updatedDecisions }));
    };

    // Сохранение данных
    const saveProtocol = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/protocols`, {
                method: protocol ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    protocol: formData,
                    resolution: resolutionData
                })
            });

            if (!response.ok) throw new Error('Ошибка сохранения протокола');

            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Генерация PDF
    const generatePDF = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/protocols/generate-pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    protocol: formData,
                    resolution: resolutionData
                })
            });

            if (!response.ok) throw new Error('Ошибка генерации PDF');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Протокол_${formData.protocolNumber || 'новый'}.pdf`;
            link.click();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="protocol-modal-overlay">
            <div className="protocol-modal-content">
                <button
                    className="close-modal"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    <FaTimes />
                </button>

                <h2>{protocol ? 'Редактирование протокола' : 'Создание нового протокола'}</h2>

                <div className="form-tabs">
                    <button
                        className={`tab-button ${activeForm === 'protocol' ? 'active' : ''}`}
                        onClick={() => setActiveForm('protocol')}
                    >
                        Протокол
                    </button>
                    <button
                        className={`tab-button ${activeForm === 'resolution' ? 'active' : ''}`}
                        onClick={() => setActiveForm('resolution')}
                    >
                        Проект решения
                    </button>
                </div>

                {isLoading && <div className="loading-overlay">Загрузка...</div>}
                {error && <div className="error-message">{error}</div>}

                {activeForm === 'protocol' && (
                    <div className="protocol-form">
                        <div className="form-group">
                            <label>Номер протокола:</label>
                            <input
                                type="text"
                                name="protocolNumber"
                                value={formData.protocolNumber}
                                onChange={handleProtocolChange}
                                disabled={!isEditing && protocol}
                            />
                        </div>

                        <div className="form-group">
                            <label>Дата составления:</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleProtocolChange}
                                disabled={!isEditing && protocol}
                            />
                        </div>

                        <div className="form-group">
                            <label>Участники:</label>
                            <textarea
                                name="participants"
                                value={formData.participants.join('\n')}
                                onChange={(e) => handleProtocolChange({
                                    target: {
                                        name: 'participants',
                                        value: e.target.value.split('\n')
                                    }
                                })}
                                disabled={!isEditing && protocol}
                            />
                        </div>

                        <h3>Вопросы голосования:</h3>
                        {formData.questions.map((question, index) => (
                            <div key={index} className="question-group">
                                <div className="form-group">
                                    <label>Вопрос {index + 1}:</label>
                                    <input
                                        type="text"
                                        name="text"
                                        value={question.text}
                                        onChange={(e) => handleQuestionChange(index, e)}
                                        disabled={!isEditing && protocol}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Описание:</label>
                                    <textarea
                                        name="description"
                                        value={question.description}
                                        onChange={(e) => handleQuestionChange(index, e)}
                                        disabled={!isEditing && protocol}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Результаты:</label>
                                    <textarea
                                        name="results"
                                        value={question.results}
                                        onChange={(e) => handleQuestionChange(index, e)}
                                        disabled={!isEditing && protocol}
                                    />
                                </div>

                                {(isEditing || !protocol) && formData.questions.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => removeQuestion(index)}
                                    >
                                        Удалить вопрос
                                    </button>
                                )}
                            </div>
                        ))}

                        {(isEditing || !protocol) && (
                            <button
                                type="button"
                                className="add-button"
                                onClick={addQuestion}
                            >
                                Добавить вопрос
                            </button>
                        )}
                    </div>
                )}

                {activeForm === 'resolution' && (
                    <div className="resolution-form">
                        <div className="form-group">
                            <label>Дата решения:</label>
                            <input
                                type="date"
                                name="date"
                                value={resolutionData.date}
                                onChange={handleResolutionChange}
                                disabled={!isEditing && protocol}
                            />
                        </div>

                        <h3>Принятые решения:</h3>
                        {resolutionData.decisions.map((decision, index) => (
                            <div key={index} className="decision-group">
                                <div className="form-group">
                                    <label>Вопрос {index + 1}:</label>
                                    <input
                                        type="text"
                                        name="question"
                                        value={decision.question}
                                        onChange={(e) => handleDecisionChange(index, e)}
                                        disabled={!isEditing && protocol}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Решение:</label>
                                    <textarea
                                        name="resolution"
                                        value={decision.resolution}
                                        onChange={(e) => handleDecisionChange(index, e)}
                                        disabled={!isEditing && protocol}
                                    />
                                </div>

                                {(isEditing || !protocol) && resolutionData.decisions.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => removeDecision(index)}
                                    >
                                        Удалить решение
                                    </button>
                                )}
                            </div>
                        ))}

                        {(isEditing || !protocol) && (
                            <button
                                type="button"
                                className="add-button"
                                onClick={addDecision}
                            >
                                Добавить решение
                            </button>
                        )}
                    </div>
                )}

                <div className="form-actions">
                    {protocol && (
                        <button
                            className={`toggle-edit-button ${isEditing ? 'cancel' : 'edit'}`}
                            onClick={() => setIsEditing(!isEditing)}
                            disabled={isLoading}
                        >
                            {isEditing ? 'Отменить редактирование' : 'Редактировать'}
                        </button>
                    )}

                    <button
                        className="generate-pdf-button"
                        onClick={generatePDF}
                        disabled={isLoading}
                    >
                        <FaFilePdf /> Создать PDF
                    </button>

                    {(isEditing || !protocol) && (
                        <button
                            className="save-button"
                            onClick={saveProtocol}
                            disabled={isLoading}
                        >
                            <FaSave /> Сохранить
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}