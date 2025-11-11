import React, { useState, useEffect } from "react";
import clientGroupService from "../../api/clientGroupService";
import "./ClientGroupList.css";
import ClientGroupForm from "./ClientGroupForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faSearch } from '@fortawesome/free-solid-svg-icons'; 
import { useTranslation } from 'react-i18next';

const ClientGroupList = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [groups, setGroups] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    useEffect(() => {
        fetchClientGroups();
    }, []);

    const fetchClientGroups = async () => {
        setLoading(true);
        try {
            const response = await clientGroupService.getAllClientGroupsByCharacter(searchText);
            setGroups(response.data);
        } catch (error) {
            console.error("Failed to fetch client groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = async (id) => {
        if (window.confirm(t('confirm_delete_client'))) {
            try {
                await clientGroupService.deleteClientGroup(id);
                fetchClientGroups();
            } catch (error) {
                alert(t('client_delete_error'));
            }
        }
    };

    const handleCreate = () => {
        setEditingGroup(null);
        setShowForm(true);
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const handleEdit = (group) => {
        setEditingGroup(group);
        setShowForm(true);
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await clientGroupService.getAllClientGroupsByCharacter(searchText);
            if (response.success) {
                setGroups(response.data);
            } else {
                console.error('Error loading clients:', response.message);
            }
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="client-group-page">
            <div className="header">
                <h2>{t('client_group')}</h2>

                <div className="lang-div">
                    <select className="lang-select" onChange={changeLanguage} value={i18n.language}>
                        <option value="az">AZ</option>
                        <option value="en">EN</option>
                        <option value="ru">RU</option>
                    </select>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        + {t('create')}
                    </button>
                </div>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder={t('search_client_name')}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyPress={handleKeyPress} 
                />
                <button className="btn" onClick={fetchClientGroups}>
                    <FontAwesomeIcon icon={faSearch}/> {t('search')}
                </button>
            </div>

            <div className="table-container">
                {loading ? (
                    <div>{t('loading')}</div>
                ) : (
                    <table className="groups-table">
                        <thead>
                            <tr>
                                <th>{t('code')}</th>
                                <th>{t('name')}</th>
                                <th>{t('note')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.length > 0 ? (
                                groups.map((group) => (
                                    <tr key={group.id}>
                                        <td>{group.code}</td>
                                        <td>{group.name}</td>
                                        <td>{group.comment ?? "-"}</td>
                                        <td>
                                            <button className="btn-edit" onClick={() => handleEdit(group)}>
                                                <FontAwesomeIcon icon={faPen} /> {t('edit')}
                                            </button>

                                            <button className="btn-delete" onClick={() => handleDeleteGroup(group.id)}>
                                                <FontAwesomeIcon icon={faTrash} /> {t('delete')}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center" }}>
                                        {t('no_clients')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showForm && (
                <ClientGroupForm
                    selectedGroup={editingGroup}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingGroup(null);
                        fetchClientGroups();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingGroup(null);
                    }}
                />
            )}
        </div>
    );
};

export default ClientGroupList;
