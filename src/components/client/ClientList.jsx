import React, { useState, useEffect } from 'react';
import clientService from '../../api/clientService';
import ClientForm from './ClientForm';
import './ClientList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faSearch } from '@fortawesome/free-solid-svg-icons';
import clientGroupService from '../../api/clientGroupService';
import { useTranslation } from 'react-i18next';

const ClientList = () => {
    const { t, i18n } = useTranslation();
    const [clients, setClients] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [clientGroups, setClientGroups] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedClients, setSelectedClients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    useEffect(() => {
        loadClients();
        loadClientGroups();
    }, []);

    const loadClients = async () => {
        setLoading(true);
        try {
            const response = await clientService.getAllClients();
            if (response.success) {
                setClients(response.data);
            }
        } catch {}
        setLoading(false);
    };

    const loadClientGroups = async () => {
        try {
            const response = await clientGroupService.getAllClientGroups();
            if (response.success) {
                setClientGroups(response.data);
            }
        } catch {}
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const handleGroupChange = async (e) => {
        const groupName = e.target.value;
        setSelectedGroup(groupName);

        setLoading(true);
        try {
            if (!groupName) {
                await loadClients();
            } else {
                const response = await clientService.getAllClientsByGroupName(groupName);
                if (response.success) {
                    setClients(response.data);
                }
            }
        } catch {}
        setLoading(false);
    };

    // ✅ FIX — search now triggers only when button pressed
    const handleSearch = async () => {
        setLoading(true);
        try {
            if (!searchName) {
                await loadClients();
            } else {
                const response = await clientService.getClientByCharacter(searchName);
                if (response.success) {
                    setClients(response.data);
                }
            }
        } catch {}
        setLoading(false);
    };

    const toggleClientSelection = (clientId) => {
        setSelectedClients(prev =>
            prev.includes(clientId)
                ? prev.filter(id => id !== clientId)
                : [...prev, clientId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedClients.length === clients.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(clients.map(client => client.id));
        }
    };

    const handleDeleteMultiple = async () => {
        if (selectedClients.length === 0) return;

        if (window.confirm(t("confirm_delete_multiple", { count: selectedClients.length }))) {
            try {
                await clientService.deleteMultipleClients(selectedClients);
                handleSearch(); 
                setSelectedClients([]);
            } catch {
                alert(t("clients_delete_error"));
            }
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (window.confirm(t("confirm_delete_client"))) {
            try {
                await clientService.deleteClient(clientId);
                handleSearch(); 
            } catch {
                alert(t("client_delete_error"));
            }
        }
    };

    const handleCreateClient = () => {
        setEditingClient(null);
        setShowForm(true);
    };

    const handleEditClient = (client) => {
        setEditingClient(client);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingClient(null);
    };

    const handleFormSubmit = async (clientData) => {
        try {
            let response;

            if (editingClient) {
                response = await clientService.updateClient(editingClient.id, clientData);
            } else {
                response = await clientService.createClient(clientData);
            }

            if (response.success) {
                handleSearch();  
                handleFormClose();
                alert(editingClient ? t("client_updated") : t("client_created"));
            } else {
                alert(t("client_save_error"));
            }
        } catch {
            alert(t("client_save_error"));
        }
    };

    return (
        <div className="client-list-container">
            <div className="client-header">
                <h2>{t("material_suppliers")}</h2>

                <div className="header-actions">
                    <select className='language-div' onChange={changeLanguage} value={i18n.language}>
                        <option value="az">AZ</option>
                        <option value="en">EN</option>
                        <option value="ru">RU</option>
                    </select>

                    <button className="btn btn-primary" onClick={handleCreateClient}>
                        +{t("new_client")}
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder={t("search_client_name")}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}  
                        className="search-input"
                    />

                    <button onClick={handleSearch} className="search-btn">
                        <FontAwesomeIcon icon={faSearch} /> {t("search")}
                    </button>
                </div>

                {selectedClients.length > 0 && (
                    <div className="bulk-actions">
                        <span>{t("selected_clients", { count: selectedClients.length })}</span>
                        <button onClick={handleDeleteMultiple} className="btn btn-danger">
                            <FontAwesomeIcon icon={faTrash} /> {t("delete_selected")}
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <div className="loading">{t("loading")}</div>
                ) : (
                    <table className="clients-table">
                        <thead>
                            <tr>
                                <th className="checkbox-column">
                                    <input
                                        type="checkbox"
                                        checked={selectedClients.length === clients.length && clients.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>{t("code")}</th>
                                <th>
                                    <select className="client-group-select" value={selectedGroup} onChange={handleGroupChange}>
                                        <option value="">{t("all_groups")}</option>
                                        {clientGroups.map(group => (
                                            <option key={group.id} value={group.name}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th>{t("name")}</th>
                                <th>{t("note")}</th>
                                <th>{t("actions")}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id} className={selectedClients.includes(client.id) ? 'selected' : ''}>
                                    <td className="checkbox-column">
                                        <input
                                            type="checkbox"
                                            checked={selectedClients.includes(client.id)}
                                            onChange={() => toggleClientSelection(client.id)}
                                        />
                                    </td>
                                    <td>{client.code}</td>
                                    <td>
                                        <span className="group-badge">{client.groupName}</span>
                                    </td>
                                    <td><strong>{client.name}</strong></td>
                                    <td>{client.comment || '-'}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEditClient(client)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDeleteClient(client.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {clients.length === 0 && !loading && (
                    <div className="no-data">{t("no_clients")}</div>
                )}
            </div>

            {showForm && (
                <ClientForm
                    client={editingClient}
                    onSubmit={handleFormSubmit}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
};

export default ClientList;
