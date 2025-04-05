import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './GroupsList.css';


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
                                    <p> {group.link}</p>
                                </a>
                                <span className="users-count">
                                    <p> Участников: {group.users.length}</p>

                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteGroup(group.id);
                                }}
                                className="delete-btn"
                            >
                                <FaTrash /> Удалить
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