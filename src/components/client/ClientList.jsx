import React, { useState, useEffect } from 'react';
import clientService from '../../api/clientService';
import ClientForm from './ClientForm';
import './ClientList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen ,faSearch } from '@fortawesome/free-solid-svg-icons'; 
import clientGroupService from '../../api/clientGroupService';

const ClientList = () => {
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
            } else {
                console.error('Error loading clients:', response.message);
            }
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoading(false);
        }
    };
    const loadClientGroups = async () => {
        try {
            const response = await clientGroupService.getAllClientGroups();
            if (response.success) {
                setClientGroups(response.data);
            } else {
                console.error('Error loading client groups:', response.message);
            }
        }
        catch (error) {
            console.error('Error loading client groups:', error);
        }
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
                } else {
                    console.error('Error fetching clients by group:', response.message);
                }
            }
        } catch (error) {
            console.error('Error fetching clients by group:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await clientService.getAllClients(searchName);
            if (response.success) {
                setClients(response.data);
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
        
        if (window.confirm(`${selectedClients.length} müştəri silinsin?`)) {
            try {
                await clientService.deleteMultipleClients(selectedClients);
                loadClients();
                setSelectedClients([]);
            } catch (error) {
                console.error('Error deleting clients:', error);
                alert('Müştərilər silinərkən xəta baş verdi: ' + error.message);
            }
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (window.confirm('Bu müştərini silmək istədiyinizə əminsiniz?')) {
            try {
                await clientService.deleteClient(clientId);
                loadClients();
            } catch (error) {
                console.error('Error deleting client:', error);
                alert('Müştəri silinərkən xəta baş verdi: ' + error.message);
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
                loadClients();
                handleFormClose();
                alert(editingClient ? 'Müştəri uğurla yeniləndi!' : 'Müştəri uğurla yaradıldı!');
            } else {
                alert(response.message || 'Xəta baş verdi');
            }
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Müştəri yadda saxlanarkən xəta baş verdi: ' + error.message);
        }
    };

    return (
        <div className="client-list-container">
            <div className="client-header">
                <h2>Material Təchizatçıları</h2>
                <div className="header-actions">
                    <button 
                        className="btn btn-primary"
                        onClick={handleCreateClient}
                    >
                        + Yeni Müştəri
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Müştəri adı ilə axtar..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="search-btn">
                        <FontAwesomeIcon icon={faSearch}/> Axtar
                    </button>
                </div>
                
                {selectedClients.length > 0 && (
                    <div className="bulk-actions">
                        <span>{selectedClients.length} müştəri seçildi</span>
                        <button 
                            onClick={handleDeleteMultiple}
                            className="btn btn-danger"
                        >
                            <FontAwesomeIcon icon={faTrash}/> Seçilmişləri Sil
                        </button>
                    </div>
                )}
            </div>

            {/* Table Section */}
            <div className="table-container">
                {loading ? (
                    <div className="loading">Yüklənir...</div>
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
                                <th>
                                    <select 
                                        value={selectedGroup} 
                                        onChange={handleGroupChange}
                                    >
                                        <option value="">Bütün qruplar</option>
                                        {clientGroups.map(group => (
                                            <option key={group.id} value={group.name}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th>Kod</th>
                                <th>Ad</th>
                                <th>Qeyd</th>
                                <th>Əməliyyatlar</th>
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
                                    <td>
                                        <span className="group-badge">
                                            {client.groupName}
                                        </span>
                                    </td>
                                    <td className="code-cell">{client.code}</td>
                                    <td className="name-cell">
                                        <div className="client-name">
                                            <strong>{client.name}</strong>
                                        </div>
                                    </td>
                                    <td className="comment-cell">
                                        {client.comment || '-'}
                                    </td>
                                    <td className="actions-cell">
                                        <button 
                                            className="btn-edit" 
                                            title="Redaktə et"
                                            onClick={() => handleEditClient(client)}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button 
                                            className="btn-delete" 
                                            title="Sil"
                                            onClick={() => handleDeleteClient(client.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {clients.length === 0 && !loading && (
                    <div className="no-data">
                        Heç bir müştəri tapılmadı
                    </div>
                )}
            </div>

            {/* Client Form Modal */}
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