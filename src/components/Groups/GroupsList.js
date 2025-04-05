import React from 'react';
import { FaTrash, FaLink } from 'react-icons/fa';

export function GroupsList({ groups, selectGroup, deleteGroup }) {
    return (
        <div className="groups-list">
            <h3>Список групп</h3>
            {groups.length > 0 ? (
                <ul>
                    {groups.map(group => (
                        <li key={group.id} className="group-item">
                            <div
                                className="group-info"
                                onClick={() => selectGroup(group)}
                            >
                                <span className="group-name">{group.name}</span>
                                <a
                                    href={group.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group-link"
                                >
                                    <FaLink /> {group.link}
                                </a>
                                <span className="users-count">
                                    Участников: {group.users.length}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteGroup(group.id);
                                }}
                                className="delete-btn"
                            >
                                <FaTrash />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет созданных групп</p>
            )}
        </div>
    );
}