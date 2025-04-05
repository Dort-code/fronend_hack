import React, { useState, useEffect } from 'react';
import { FaUserCog, FaTimes, FaUserTie, FaFileUpload, FaTrash, FaFileAlt } from 'react-icons/fa';

export function GroupDetails({
                                 group,
                                 onAssignChairman,
                                 onRemoveChairman,
                                 onBack,
                                 onDocumentAdd,
                                 onDocumentDelete
                             }) {
    const [localGroup, setLocalGroup] = useState(group);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        setLocalGroup(group);
    }, [group]);

    // Обработка назначения председателя
    const handleAssignChairman = (userId) => {
        const updatedUsers = localGroup.users.map(user => ({
            ...user,
            isChairman: user.id === userId
        }));

        const updatedGroup = { ...localGroup, users: updatedUsers };
        setLocalGroup(updatedGroup);
        onAssignChairman(userId);
    };

    // Обработка снятия председателя
    const handleRemoveChairman = () => {
        const updatedUsers = localGroup.users.map(user => ({
            ...user,
            isChairman: false
        }));

        const updatedGroup = { ...localGroup, users: updatedUsers };
        setLocalGroup(updatedGroup);
        onRemoveChairman();
    };

    // Обработка выбора файла
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    // Обработка загрузки документа (с динамическим обновлением)
    const handleUploadDocument = () => {
        if (selectedFile) {
            const newDocument = {
                id: Date.now(),
                name: fileName,
                file: selectedFile,
                date: new Date().toLocaleDateString()
            };

            // Локальное обновление для мгновенного отображения
            const updatedDocuments = [...localGroup.documents, newDocument];
            const updatedGroup = { ...localGroup, documents: updatedDocuments };
            setLocalGroup(updatedGroup);

            // Отправка изменения в родительский компонент
            onDocumentAdd(newDocument);

            // Сброс состояния формы
            setSelectedFile(null);
            setFileName('');
            document.getElementById('file-upload').value = '';
        }
    };

    // Обработка удаления документа (с динамическим обновлением)
    const handleDeleteDocument = (docId) => {
        // Локальное обновление для мгновенного отображения
        const updatedDocuments = localGroup.documents.filter(doc => doc.id !== docId);
        const updatedGroup = { ...localGroup, documents: updatedDocuments };
        setLocalGroup(updatedGroup);

        // Отправка изменения в родительский компонент
        onDocumentDelete(docId);
    };

    return (
        <div className="group-details-container">
            <div className="group-header">
                <h2>Группа: {localGroup.name}</h2>
                <button onClick={onBack} className="back-btn">
                    Назад к списку
                </button>
            </div>

            <div className="users-section">
                <h3><FaUserTie /> Участники ({localGroup.users.length})</h3>
                <div className="users-grid">
                    {localGroup.users.map(user => (
                        <div key={user.id} className={`user-card ${user.isChairman ? 'chairman' : ''}`}>
                            <div className="user-info">
                                <span>{user.name}</span>
                                {user.isChairman && <span>Председатель</span>}
                            </div>
                            <div className="user-actions">
                                {user.isChairman ? (
                                    <button onClick={handleRemoveChairman} className="btn-remove">
                                        <FaTimes /> Снять
                                    </button>
                                ) : (
                                    <button onClick={() => handleAssignChairman(user.id)} className="btn-assign">
                                        <FaUserCog /> Назначить
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="documents-section">
                <h3><FaFileAlt /> Документы группы</h3>

                <div className="document-upload">
                    <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                    <button
                        onClick={handleUploadDocument}
                        disabled={!selectedFile}
                        className="upload-btn"
                    >
                        <FaFileUpload /> Загрузить документ
                    </button>
                    {fileName && <span className="file-name">{fileName}</span>}
                </div>

                <div className="documents-list">
                    {localGroup.documents?.length > 0 ? (
                        <ul>
                            {localGroup.documents.map(doc => (
                                <li key={doc.id} className="document-item">
                                    <div className="document-info">
                                        <span className="document-name">{doc.name}</span>
                                        <span className="document-date">{doc.date}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteDocument(doc.id)}
                                        className="delete-doc-btn"
                                    >
                                        <FaTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-documents">Нет загруженных документов</p>
                    )}
                </div>
            </div>
        </div>
    );
}