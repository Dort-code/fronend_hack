import React, { useState, useEffect } from 'react';
import { FaUserCog, FaTimes, FaUserTie } from 'react-icons/fa';

export function GroupDetails({
                                         group,
                                         onAssignChairman,
                                         onRemoveChairman,
                                         onBack
                                     }) {
    const [localGroup, setLocalGroup] = useState(group);

    useEffect(() => {
        setLocalGroup(group);
    }, [group]);

    const handleAssignChairman = (userId) => {
        const updatedUsers = localGroup.users.map(user => ({
            ...user,
            isChairman: user.id === userId
        }));

        setLocalGroup({ ...localGroup, users: updatedUsers });
        onAssignChairman(userId);
    };

    const handleRemoveChairman = () => {
        const updatedUsers = localGroup.users.map(user => ({
            ...user,
            isChairman: false
        }));

        setLocalGroup({ ...localGroup, users: updatedUsers });
        onRemoveChairman();
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
        </div>
    );
}