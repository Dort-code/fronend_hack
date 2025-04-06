import React, { useState, useRef, useEffect } from 'react';
import { HeaderAD } from './Header/HeaderAD';
import { GroupsList } from './Groups/GroupsList';
import { GroupDetails } from './Groups/GroupDetails';
import { Results } from './Results/Results';
import './HederAdminPA.css';

export function HederAdminPA({ onLogout }) {
    const API_BASE_URL = 'https://your-api-endpoint.com/api';
    const [menuList] = useState([
        { id: 1, text: "Группы", form: "groups" },
        { id: 2, text: "Итоги", form: "results" }
    ]);

    const [showMenu, setShowMenu] = useState(false);
    const [activeForm, setActiveForm] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupLink, setNewGroupLink] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const menuRef = useRef(null);
    const userDropdownRef = useRef(null);

    // Загрузка начальных данных
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [groupsRes, usersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/groups`),
                    fetch(`${API_BASE_URL}/users`)
                ]);

                if (!groupsRes.ok) throw new Error('Ошибка загрузки групп');
                if (!usersRes.ok) throw new Error('Ошибка загрузки пользователей');

                const groupsData = await groupsRes.json();
                const usersData = await usersRes.json();

                setGroups(groupsData);
                setAllUsers(usersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleLogoutClick = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Ошибка выхода');
            onLogout();
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleMenu = () => setShowMenu(!showMenu);

    const handleMenuItemClick = (formName) => {
        setActiveForm(activeForm === formName ? null : formName);
        setSelectedGroup(null);
        setShowMenu(false);
    };

    // Закрытие выпадающих меню при клике вне их области
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Создание новой группы
    const createGroup = async () => {
        if (!newGroupName.trim() || !newGroupLink.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: newGroupName,
                    link: newGroupLink,
                    userIds: selectedUsers
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка создания группы');
            }

            const newGroup = await response.json();
            setGroups([...groups, newGroup]);
            setNewGroupName("");
            setNewGroupLink("");
            setSelectedUsers([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Удаление группы
    const deleteGroup = async (groupId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Ошибка удаления группы');

            setGroups(groups.filter(group => group.id !== groupId));
            if (selectedGroup?.id === groupId) {
                setSelectedGroup(null);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Назначение председателя
    const handleAssignChairman = async (userId) => {
        if (!selectedGroup) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/groups/${selectedGroup.id}/chairman`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ userId })
                }
            );

            if (!response.ok) throw new Error('Ошибка назначения председателя');

            const updatedGroup = await response.json();
            updateGroupState(updatedGroup);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Снятие председателя
    const handleRemoveChairman = async () => {
        if (!selectedGroup) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/groups/${selectedGroup.id}/chairman`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) throw new Error('Ошибка снятия председателя');

            const updatedGroup = await response.json();
            updateGroupState(updatedGroup);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Обновление состояния группы после изменений
    const updateGroupState = (updatedGroup) => {
        setGroups(groups.map(group =>
            group.id === updatedGroup.id ? updatedGroup : group
        ));
        if (selectedGroup?.id === updatedGroup.id) {
            setSelectedGroup(updatedGroup);
        }
    };

    // Добавление пользователей в группу
    const addUsersToGroup = async () => {
        if (!selectedGroup || selectedUsers.length === 0) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/groups/${selectedGroup.id}/users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ userIds: selectedUsers })
                }
            );

            if (!response.ok) throw new Error('Ошибка добавления пользователей');

            const updatedGroup = await response.json();
            updateGroupState(updatedGroup);
            setSelectedUsers([]);
            setShowUserDropdown(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Удаление пользователя из группы
    const removeUserFromGroup = async (userId) => {
        if (!selectedGroup) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/groups/${selectedGroup.id}/users/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) throw new Error('Ошибка удаления пользователя');

            const updatedGroup = await response.json();
            updateGroupState(updatedGroup);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Добавление документа в группу
    const handleDocumentAdd = async (file) => {
        if (!selectedGroup || !file) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('document', file);

            const response = await fetch(
                `${API_BASE_URL}/groups/${selectedGroup.id}/documents`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                }
            );

            if (!response.ok) throw new Error('Ошибка загрузки документа');

            const updatedGroup = await response.json();
            updateGroupState(updatedGroup);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Удаление документа из группы
    const handleDocumentDelete = async (docId) => {
        if (!selectedGroup) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/groups/${selectedGroup.id}/documents/${docId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) throw new Error('Ошибка удаления документа');

            const updatedGroup = await response.json();
            updateGroupState(updatedGroup);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Обработчики UI
    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const selectGroup = (group) => {
        setSelectedGroup(group);
    };

    return (
        <div className="admin-container">
            <HeaderAD
                toggleMenu={toggleMenu}
                handleLogout={handleLogoutClick}
                showMenu={showMenu}
                menuRef={menuRef}
            >
                {showMenu && (
                    <div className="menu-dropdown" ref={menuRef}>
                        <ul>
                            {menuList.map(menu => (
                                <li
                                    key={menu.id}
                                    onClick={() => handleMenuItemClick(menu.form)}
                                    className={`menu-item ${activeForm === menu.form ? 'active' : ''}`}
                                >
                                    {menu.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </HeaderAD>

            <div className="admin-content-area">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                        <p>Загрузка...</p>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => setError(null)}>Закрыть</button>
                    </div>
                )}

                {activeForm === 'groups' && (
                    <div className="content-section">
                        {!selectedGroup ? (
                            <>
                                <div className="section-header">
                                    <h2>Управление группами</h2>
                                    <div className="creation-form">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                placeholder="Название группы"
                                                value={newGroupName}
                                                onChange={(e) => setNewGroupName(e.target.value)}
                                                className="text-input"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                placeholder="Ссылка на группу"
                                                value={newGroupLink}
                                                onChange={(e) => setNewGroupLink(e.target.value)}
                                                className="text-input"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="user-selection">
                                            <button
                                                type="button"
                                                className="select-users-btn"
                                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                                disabled={isLoading}
                                            >
                                                {selectedUsers.length > 0
                                                    ? `Выбрано: ${selectedUsers.length}`
                                                    : "Выберите пользователей"}
                                            </button>
                                            {showUserDropdown && (
                                                <div className="user-dropdown" ref={userDropdownRef}>
                                                    <div className="dropdown-header">
                                                        <h4>Выберите пользователей</h4>
                                                    </div>
                                                    <div className="users-list">
                                                        {allUsers.map(user => (
                                                            <div key={user.id} className="user-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`user-${user.id}`}
                                                                    checked={selectedUsers.includes(user.id)}
                                                                    onChange={() => toggleUserSelection(user.id)}
                                                                    disabled={isLoading}
                                                                />
                                                                <label htmlFor={`user-${user.id}`}>
                                                                    {user.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="dropdown-actions">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUsers([]);
                                                                setShowUserDropdown(false);
                                                            }}
                                                            className="cancel-btn"
                                                            disabled={isLoading}
                                                        >
                                                            Отмена
                                                        </button>
                                                        <button
                                                            onClick={() => setShowUserDropdown(false)}
                                                            className="confirm-btn"
                                                            disabled={isLoading}
                                                        >
                                                            Готово
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={createGroup}
                                            className="action-button"
                                            disabled={!newGroupName.trim() || !newGroupLink.trim() || isLoading}
                                        >
                                            <span>+</span> Создать группу
                                        </button>
                                    </div>
                                </div>
                                <GroupsList
                                    groups={groups}
                                    selectGroup={selectGroup}
                                    deleteGroup={deleteGroup}
                                    isLoading={isLoading}
                                />
                            </>
                        ) : (
                            <GroupDetails
                                group={selectedGroup}
                                onAssignChairman={handleAssignChairman}
                                onRemoveChairman={handleRemoveChairman}
                                onDocumentAdd={handleDocumentAdd}
                                onDocumentDelete={handleDocumentDelete}
                                onBack={() => setSelectedGroup(null)}
                                onAddUsers={() => setShowUserDropdown(true)}
                                onRemoveUser={removeUserFromGroup}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                )}

                {activeForm === 'results' && (
                    <div className="content-section">
                        <Results onClose={() => setActiveForm(null)} />
                    </div>
                )}

                {!activeForm && (
                    <div className="empty-state">
                        <h3>Выберите раздел для работы</h3>
                        <p>Используйте меню в верхнем левом углу для навигации</p>
                    </div>
                )}

                {selectedGroup && showUserDropdown && (
                    <div className="user-dropdown-modal">
                        <div className="dropdown-content" ref={userDropdownRef}>
                            <div className="dropdown-header">
                                <h4>Добавить пользователей в группу</h4>
                                <button
                                    onClick={() => setShowUserDropdown(false)}
                                    className="close-dropdown"
                                    disabled={isLoading}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="users-list">
                                {allUsers
                                    .filter(user => !selectedGroup.users.some(u => u.id === user.id))
                                    .map(user => (
                                        <div key={user.id} className="user-checkbox">
                                            <input
                                                type="checkbox"
                                                id={`add-user-${user.id}`}
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => toggleUserSelection(user.id)}
                                                disabled={isLoading}
                                            />
                                            <label htmlFor={`add-user-${user.id}`}>
                                                {user.name}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                            <div className="dropdown-actions">
                                <button
                                    onClick={() => {
                                        setSelectedUsers([]);
                                        setShowUserDropdown(false);
                                    }}
                                    className="cancel-btn"
                                    disabled={isLoading}
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={addUsersToGroup}
                                    disabled={selectedUsers.length === 0 || isLoading}
                                    className="confirm-btn"
                                >
                                    Добавить выбранных
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}