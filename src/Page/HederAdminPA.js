import React, { useState, useRef } from 'react';
import { HeaderAD } from '../components/Header/HeaderAD';
import { GroupsList } from '../components/Groups/GroupsList';
import { GroupDetails } from '../components/Groups/GroupDetails';
import { Results } from '../components/Results/Results';
import './HederAdminPA.css';

export function HederAdminPA() {
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
    const menuRef = useRef(null);

    const handleLogout = () => {
        console.log('User logged out');
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleMenuItemClick = (formName) => {
        setActiveForm(activeForm === formName ? null : formName);
        setSelectedGroup(null);
        setShowMenu(false);
    };

    const createGroup = () => {
        if (newGroupName.trim() && newGroupLink.trim()) {
            const isTestGroup = newGroupName === 'Test' && newGroupLink === 'Test';

            const newGroup = {
                id: Date.now(),
                name: newGroupName,
                link: newGroupLink,
                conferenceLink: "",
                documents: [],
                users: isTestGroup ? [
                    { id: 1, name: 'us1', isChairman: false },
                    { id: 2, name: 'us2', isChairman: false },
                    { id: 3, name: 'us3', isChairman: false }
                ] : []
            };

            setGroups([...groups, newGroup]);
            setNewGroupName("");
            setNewGroupLink("");
        }
        else if (newGroupName.trim() && newGroupLink.trim()) {
            const newGroup = {
                id: Date.now(),
                name: newGroupName,
                link: newGroupLink,
                conferenceLink: "",
                documents: [],
                users: []
            };
            setGroups([...groups, newGroup]);
            setNewGroupName("");
            setNewGroupLink("");
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

    return (
        <div className="admin-container">
            <HeaderAD
                toggleMenu={toggleMenu}
                handleLogout={handleLogout}
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
                        <p>Используйте меню в верхнем правом углу для навигации</p>
                    </div>
                )}
            </div>
        </div>
    );
}