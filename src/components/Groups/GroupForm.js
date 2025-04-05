import React from 'react';
import { FaPlus, FaMagic } from 'react-icons/fa';

export function GroupForm({
                              newGroupName,
                              setNewGroupName,
                              newGroupLink,
                              setNewGroupLink,
                              createGroup,
                              setGroups
                          }) {

    const createTestGroup = () => {
        const testGroup = {
            id: Date.now(),
            name: "АбуБандиты",
            link: "Черти",
            conferenceLink: "",
            documents: [],
            users: [
                { id: 1, name: "Абу1", isChairman: true },
                { id: 2, name: "Абу2", isChairman: false },
                { id: 3, name: "Абу3", isChairman: false }
            ]
        };
        setGroups(prevGroups => [...prevGroups, testGroup]);
    };

    return (
        <div className="form-section">
            <h3>Создать новую группу</h3>
            <input
                type="text"
                placeholder="Название группы"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="group-input"
            />
            <input
                type="text"
                placeholder="Ссылка для вступления"
                value={newGroupLink}
                onChange={(e) => setNewGroupLink(e.target.value)}
                className="group-input"
            />
            <div className="form-buttons">
                <button
                    onClick={createGroup}
                    className="create-btn"
                    disabled={!newGroupName.trim() || !newGroupLink.trim()}
                >
                    <FaPlus /> Создать группу
                </button>
                <button
                    onClick={createTestGroup}
                    className="test-btn"
                    title="Создать тестовую группу"
                >
                    <FaMagic /> Тестовая группа
                </button>
            </div>
        </div>
    );
}