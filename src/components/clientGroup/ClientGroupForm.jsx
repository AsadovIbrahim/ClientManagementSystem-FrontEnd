import React, { useState, useEffect } from "react";
import clientGroupService from "../../api/clientGroupService";
import "./ClientGroupForm.css";

const ClientGroupForm = ({ selectedGroup, onSuccess, onCancel }) => {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [comment, setComment] = useState("");
    const [parentGroupId, setParentGroupId] = useState("");
    const [clientGroups, setClientGroups] = useState([]);

    useEffect(() => {
        if (selectedGroup) {
            setName(selectedGroup.name ?? "");
            setCode(selectedGroup.code ?? "");
            setComment(selectedGroup.comment ?? "");
            setParentGroupId(selectedGroup.parentGroupId ?? "");
        }
        loadClientGroups();
    }, [selectedGroup]);

    const loadClientGroups = async () => {
        try {
            const response = await clientGroupService.getAllClientGroups();
            if (response.success) {
                setClientGroups(response.data);
            }
        } catch (error) {
            console.error("Error loading client groups:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { 
            name, 
            code: parseInt(code), 
            comment, 
            parentGroupId: parentGroupId || null 
        };

        try {
            if (selectedGroup) {
                await clientGroupService.updateClientGroup(selectedGroup.id, {
                    ...data,
                    id: selectedGroup.id
                });
            } else {
                await clientGroupService.createClientGroup(data);
            }

            onSuccess?.();
        } catch (error) {
            console.error("Error saving group:", error);
            alert("Xəta baş verdi");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3>{selectedGroup ? "Qrup Redaktə et" : "Yeni Qrup"}</h3>
                    <button onClick={onCancel} className="close-btn">✖</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <label>
                        Qrup adı *
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Qrup kodu
                        <input
                            type="number"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </label>

                    <label>
                        Valideyn Qrup
                        <select
                            value={parentGroupId}
                            onChange={(e) => setParentGroupId(e.target.value)}
                        >
                            <option value="">-- Valideyn qrup seçin --</option>
                            {clientGroups.map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Qeyd
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </label>

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">
                            {selectedGroup ? "Yenilə" : "Yarat"}
                        </button>
                        <button type="button" className="btn" onClick={onCancel}>
                            İmtina
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientGroupForm;