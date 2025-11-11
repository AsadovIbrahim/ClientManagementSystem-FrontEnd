import React, { useState, useEffect } from "react";
import clientGroupService from "../../api/clientGroupService";
import "./ClientGroupList.css";
import ClientGroupForm from "./ClientGroupForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen,faSearch } from '@fortawesome/free-solid-svg-icons'; 

const ClientGroupList = () => {
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
            const response = await clientGroupService.getAllClientGroups(searchText);
            setGroups(response.data);
        } catch (error) {
            console.error("Failed to fetch client groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = async (id) => {
        if (window.confirm("Bu qrup silinsin?")) {
            try {
                await clientGroupService.deleteClientGroup(id);
                fetchClientGroups();
            } catch (error) {
                alert("Silinmə zamanı xəta baş verdi");
            }
        }
    };

    const handleCreate = () => {
        setEditingGroup(null);
        setShowForm(true);
    };

    const handleEdit = (group) => {
        setEditingGroup(group);
        setShowForm(true);
    };
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await clientGroupService.getAllClientGroups(searchText);
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
                <h2>Müştəri Qrupları</h2>

                <button className="btn btn-primary" onClick={handleCreate}>
                    + Yeni Qrup
                </button>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Qrup adı ilə axtar..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyPress={handleKeyPress} 
                />

                <button className="btn" onClick={fetchClientGroups}>
                    <FontAwesomeIcon icon={faSearch}/> Axtar
                </button>
            </div>

            <div className="table-container">
                {loading ? (
                    <div>Yüklənir...</div>
                ) : (
                    <table className="groups-table">
                        <thead>
                            <tr>
                                <th>Kod</th>
                                <th>Ad</th>
                                <th>Qeyd</th>
                                <th>Əməliyyatlar</th>
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
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(group)}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>

                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDeleteGroup(group.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center" }}>
                                        Heç bir qrup tapılmadı
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
