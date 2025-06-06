import React, { useState, useRef, useEffect } from 'react';
import { HeaderAD } from '../components/Header/HeaderAD';
import { GroupsList } from '../components/Groups/GroupsList';
import { GroupDetails } from '../components/Groups/GroupDetails';
import { Results } from '../components/Results/Results';
import './HederAdminPA.css';

export function HederAdminPA({ onLogout }) {
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
    const [allUsers, setAllUsers] = useState([
        { id: 1, name: 'Иванов Иван' },
        { id: 2, name: 'Петров Петр' },
        { id: 3, name: 'Сидорова Анна' },
        { id: 4, name: 'Кузнецов Дмитрий' },
        { id: 5, name: 'Смирнова Ольга' }
    ]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const menuRef = useRef(null);
    const userDropdownRef = useRef(null);

    const handleLogoutClick = () => {
        console.log('User logged out');
        onLogout();
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleMenuItemClick = (formName) => {
        setActiveForm(activeForm === formName ? null : formName);
        setSelectedGroup(null);
        setShowMenu(false);
    };

    // Закрытие выпадающего списка при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const createGroup = () => {
        if (newGroupName.trim() && newGroupLink.trim()) {
            const newGroup = {
                id: Date.now(),
                name: newGroupName,
                link: newGroupLink,
                conferenceLink: "",
                documents: [],
                users: selectedUsers.map(userId => ({
                    id: userId,
                    name: allUsers.find(u => u.id === userId).name,
                    isChairman: false
                }))
            };

            setGroups([...groups, newGroup]);
            setNewGroupName("");
            setNewGroupLink("");
            setSelectedUsers([]);
        }
    };

    const deleteGroup = (groupId) => {
        setGroups(groups.filter(group => group.id !== groupId));
        if (selectedGroup && selectedGroup.id === groupId) {
            setSelectedGroup(null);
        }
    };

    const selectGroup = (group) => {
        setSelectedGroup(group);
    };

    const handleAssignChairman = (userId) => {
        if (!selectedGroup) return;

        setGroups(groups.map(group => {
            if (group.id === selectedGroup.id) {
                return {
                    ...group,
                    users: group.users.map(user => ({
                        ...user,
                        isChairman: user.id === userId
                    }))
                };
            }
            return group;
        }));
    };

    const handleRemoveChairman = () => {
        if (!selectedGroup) return;

        setGroups(groups.map(group => {
            if (group.id === selectedGroup.id) {
                return {
                    ...group,
                    users: group.users.map(user => ({
                        ...user,
                        isChairman: false
                    }))
                };
            }
            return group;
        }));
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const addUsersToGroup = () => {
        if (!selectedGroup || selectedUsers.length === 0) return;

        const newUsers = selectedUsers
            .filter(userId => !selectedGroup.users.some(u => u.id === userId))
            .map(userId => ({
                id: userId,
                name: allUsers.find(u => u.id === userId).name,
                isChairman: false
            }));

        if (newUsers.length > 0) {
            setGroups(groups.map(group => {
                if (group.id === selectedGroup.id) {
                    return {
                        ...group,
                        users: [...group.users, ...newUsers]
                    };
                }
                return group;
            }));
        }

        setSelectedUsers([]);
        setShowUserDropdown(false);
    };

    const removeUserFromGroup = (userId) => {
        if (!selectedGroup) return;

        setGroups(groups.map(group => {
            if (group.id === selectedGroup.id) {
                return {
                    ...group,
                    users: group.users.filter(user => user.id !== userId)
                };
            }
            return group;
        }));
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
                                            />
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                placeholder="Ссылка на группу"
                                                value={newGroupLink}
                                                onChange={(e) => setNewGroupLink(e.target.value)}
                                                className="text-input"
                                            />
                                        </div>
                                        <div className="user-selection">
                                            <button
                                                type="button"
                                                className="select-users-btn"
                                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                            >
                                                {selectedUsers.length > 0
                                                    ? `Выбрано пользователей: ${selectedUsers.length}`
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
                                                        >
                                                            Отмена
                                                        </button>
                                                        <button
                                                            onClick={() => setShowUserDropdown(false)}
                                                            className="confirm-btn"
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
                                            disabled={!newGroupName.trim() || !newGroupLink.trim()}
                                        >
                                            <span>+</span> Создать группу
                                        </button>
                                    </div>
                                </div>
                                <GroupsList
                                    groups={groups}
                                    selectGroup={selectGroup}
                                    deleteGroup={deleteGroup}
                                />
                            </>
                        ) : (
                            <GroupDetails
                                group={selectedGroup}
                                onAssignChairman={handleAssignChairman}
                                onRemoveChairman={handleRemoveChairman}
                                onDocumentAdd={(doc) => {
                                    setGroups(groups.map(g => {
                                        if (g.id === selectedGroup.id) {
                                            return { ...g, documents: [...g.documents, doc] };
                                        }
                                        return g;
                                    }));
                                }}
                                onDocumentDelete={(docId) => {
                                    setGroups(groups.map(g => {
                                        if (g.id === selectedGroup.id) {
                                            return { ...g, documents: g.documents.filter(d => d.id !== docId) };
                                        }
                                        return g;
                                    }));
                                }}
                                onBack={() => setSelectedGroup(null)}
                                onAddUsers={() => setShowUserDropdown(true)}
                                onRemoveUser={removeUserFromGroup}
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
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={addUsersToGroup}
                                    disabled={selectedUsers.length === 0}
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