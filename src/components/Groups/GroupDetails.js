import React, { useState, useEffect } from 'react';
import {
    FaUserCog,
    FaTimes,
    FaUserTie,
    FaFileUpload,
    FaTrash,
    FaFileAlt,
    FaArrowLeft,
    FaVoteYea,
    FaPlus,
    FaMinus
} from 'react-icons/fa';

export function GroupDetails({
                                 group,
                                 onAssignChairman,
                                 onRemoveChairman,
                                 onBack,
                                 onDocumentAdd,
                                 onDocumentDelete,
                                 onVoteAdd
                             }) {
    const [localGroup, setLocalGroup] = useState(group);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [showVoteForm, setShowVoteForm] = useState(false);
    const [newVote, setNewVote] = useState({
        question: '',
        document: null,
        options: ['За', 'Против', 'Воздержался'],
        deadline: ''
    });

    useEffect(() => {
        setLocalGroup(group);
    }, [group]);

    const handleAssignChairman = (userId) => {
        const updatedUsers = localGroup.users.map(user => ({
            ...user,
            isChairman: user.id === userId
        }));

        const updatedGroup = { ...localGroup, users: updatedUsers };
        setLocalGroup(updatedGroup);
        onAssignChairman(userId);
    };

    const handleRemoveChairman = () => {
        const updatedUsers = localGroup.users.map(user => ({
            ...user,
            isChairman: false
        }));

        const updatedGroup = { ...localGroup, users: updatedUsers };
        setLocalGroup(updatedGroup);
        onRemoveChairman();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    const handleUploadDocument = () => {
        if (selectedFile) {
            const newDocument = {
                id: Date.now(),
                name: fileName,
                file: selectedFile,
                date: new Date().toLocaleDateString()
            };

            const updatedDocuments = [...localGroup.documents, newDocument];
            const updatedGroup = { ...localGroup, documents: updatedDocuments };
            setLocalGroup(updatedGroup);
            onDocumentAdd(newDocument);

            setSelectedFile(null);
            setFileName('');
            document.getElementById('file-upload').value = '';
        }
    };

    const handleDeleteDocument = (docId) => {
        const updatedDocuments = localGroup.documents.filter(doc => doc.id !== docId);
        const updatedGroup = { ...localGroup, documents: updatedDocuments };
        setLocalGroup(updatedGroup);
        onDocumentDelete(docId);
    };

    const handleVoteInputChange = (e) => {
        const { name, value } = e.target;
        setNewVote(prev => ({ ...prev, [name]: value }));
    };

    const handleVoteDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewVote(prev => ({ ...prev, document: file }));
        }
    };

    const handleAddOption = () => {
        setNewVote(prev => ({
            ...prev,
            options: [...prev.options, '']
        }));
    };

    const handleRemoveOption = (index) => {
        setNewVote(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...newVote.options];
        newOptions[index] = value;
        setNewVote(prev => ({ ...prev, options: newOptions }));
    };

    const handleCreateVote = () => {
        if (newVote.question && newVote.options.length > 1 && newVote.deadline) {
            const vote = {
                id: Date.now(),
                groupId: localGroup.id,
                question: newVote.question,
                document: newVote.document,
                options: newVote.options,
                deadline: newVote.deadline,
                createdAt: new Date().toISOString(),
                votes: []
            };

            onVoteAdd(vote);
            setShowVoteForm(false);
            setNewVote({
                question: '',
                document: null,
                options: ['За', 'Против', 'Воздержался'],
                deadline: ''
            });
        }
    };

    return (
        <div className="group-details-container">
            <div className="group-header">
                <div className="header-content">
                    <button onClick={onBack} className="back-btn">
                        <FaArrowLeft /> Назад
                    </button>
                    <h2>{localGroup.name}</h2>
                </div>
                <div className="group-meta">
          <span className="meta-item">
            <FaUserTie /> {localGroup.users.length} участников
          </span>
                    <span className="meta-item">
            <FaFileAlt /> {localGroup.documents?.length || 0} документов
          </span>
                </div>
            </div>

            <div className="content-grid">
                <section className="users-section card">
                    <div className="section-header">
                        <h3><FaUserTie /> Участники группы</h3>
                    </div>

                    <div className="users-grid">
                        {localGroup.users.map(user => (
                            <div key={user.id} className={`user-card ${user.isChairman ? 'chairman' : ''}`}>
                                <div className="user-info">
                                    <span className="user-name">{user.name}</span>
                                    {user.isChairman && <span className="chairman-badge">Председатель</span>}
                                </div>
                                <div className="user-actions">
                                    {user.isChairman ? (
                                        <button
                                            onClick={handleRemoveChairman}
                                            className="btn-remove"
                                            aria-label="Снять председателя"
                                        >
                                            <FaTimes /> Снять
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAssignChairman(user.id)}
                                            className="btn-assign"
                                            aria-label="Назначить председателем"
                                        >
                                            <FaUserCog /> Назначить
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="documents-section card">
                    <div>
                        <p> </p>
                    </div>
                    <div className="document-upload">
                        <label htmlFor="file-upload" className="file-upload-label">
                            <FaFileUpload /> Выбрать файл
                            <input
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                className="file-input"
                                aria-label="Выберите файл для загрузки"
                            />
                        </label>
                        {fileName && (
                            <span className="file-name" title={fileName}>
                {fileName.length > 30 ? `${fileName.substring(0, 30)}...` : fileName}
              </span>
                        )}
                        <button
                            onClick={handleUploadDocument}
                            disabled={!selectedFile}
                            className="upload-btn"
                            aria-label="Загрузить документ"
                        >
                            Загрузить
                        </button>
                    </div>

                    <div className="documents-list">
                        {localGroup.documents?.length > 0 ? (
                            <ul>
                                {localGroup.documents.map(doc => (
                                    <li key={doc.id} className="document-item">
                                        <div className="document-info">
                                            <span className="document-name">{doc.name}</span>
                                            <span className="document-date">Добавлен: {doc.date}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="delete-doc-btn"
                                            aria-label={`Удалить документ ${doc.name}`}
                                        >
                                            <FaTrash />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="no-documents">
                                <FaFileAlt size={32} />
                                <p>Нет загруженных документов</p>
                            </div>
                        )}
                    </div>
                </section>
                <section className="votes-section card">
                    <div className="section-header">
                        <h3><FaVoteYea /> Голосования</h3>
                        <button
                            onClick={() => setShowVoteForm(!showVoteForm)}
                            className="add-vote-btn"
                        >
                            <FaPlus /> Новое голосование
                        </button>
                    </div>

                    {showVoteForm && (
                        <div className="vote-form">
                            <div className="form-group">
                                <label>Вопрос голосования:</label>
                                <input
                                    type="text"
                                    name="question"
                                    value={newVote.question}
                                    onChange={handleVoteInputChange}
                                    placeholder="Введите вопрос"
                                />
                            </div>

                            <div className="form-group">
                                <label>Документ:</label>
                                <label className="file-upload-label">
                                    <FaFileUpload /> Выбрать файл
                                    <input
                                        type="file"
                                        onChange={handleVoteDocumentChange}
                                        className="file-input"
                                    />
                                </label>
                                {newVote.document && (
                                    <span className="file-name">{newVote.document.name}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Варианты ответов:</label>
                                <div className="vote-options">
                                    {newVote.options.map((option, index) => (
                                        <div key={index} className="option-row">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                placeholder="Вариант ответа"
                                            />
                                            {newVote.options.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOption(index)}
                                                    className="remove-option-btn"
                                                >
                                                    <FaMinus />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        className="add-option-btn"
                                    >
                                        <FaPlus /> Добавить вариант
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Срок голосования:</label>
                                <input
                                    type="datetime-local"
                                    name="deadline"
                                    value={newVote.deadline}
                                    onChange={handleVoteInputChange}
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    onClick={() => setShowVoteForm(false)}
                                    className="cancel-btn"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleCreateVote}
                                    disabled={!newVote.question || newVote.options.length < 2 || !newVote.deadline}
                                    className="create-btn"
                                >
                                    Создать голосование
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="votes-list">
                        {localGroup.votes?.length > 0 ? (
                            <ul>
                                {localGroup.votes.map(vote => (
                                    <li key={vote.id} className="vote-item">
                                        <div className="vote-info">
                                            <h4>{vote.question}</h4>
                                            <div className="vote-meta">
                                                <span>Документ: {vote.document?.name || 'нет'}</span>
                                                <span>До: {new Date(vote.deadline).toLocaleString()}</span>
                                            </div>
                                            <div className="vote-options-list">
                                                {vote.options.map((option, i) => (
                                                    <span key={i} className="vote-option">
                            {option}: {vote.votes?.filter(v => v.option === option).length || 0}
                          </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="vote-status">
                                            {new Date(vote.deadline) > new Date() ? (
                                                <span className="active">Активно</span>
                                            ) : (
                                                <span className="closed">Завершено</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="no-votes">
                                <p>Нет активных голосований</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}