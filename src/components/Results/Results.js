import React from 'react';

export function Results({ onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Просмотр итогов</h2>
                <div className="form-section">
                    <p>Здесь будет отображаться статистика и итоги по группам</p>
                </div>
                <button onClick={onClose} className="close-btn">
                    Закрыть
                </button>
            </div>
        </div>
    );
}