import React, { useState, useEffect } from 'react';
import clientGroupService from '../../api/clientGroupService';
import './ClientForm.css';
import { useTranslation } from 'react-i18next';

const ClientForm = ({ client, onSubmit, onClose }) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        comment: '',
        clientGroupId: ''
    });

    const [clientGroups, setClientGroups] = useState([]);

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name || '',
                code: client.code || '',
                comment: client.comment || '',
                clientGroupId: client.clientGroupId || ''
            });
        }
        loadClientGroups();
    }, [client]);

    const loadClientGroups = async () => {
        try {
            const response = await clientGroupService.getAllClientGroups();
            if (response.success) {
                setClientGroups(response.data);
            } else {
                console.error('Error loading client groups:', response.message);
            }
        } catch (error) {
            console.error('Error loading client groups:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{client ? t("edit_client") : t("new_client")}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="client-form">
                    
                    <div className="form-group">
                        <label>{t("client_name")} *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>{t("client_code")} *</label>
                        <input
                            type="number"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>{t("client_group")} *</label>
                        <select
                            name="clientGroupId"
                            value={formData.clientGroupId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t("select_option")}</option>
                            {clientGroups.map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t("comment")}</label>
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose}>
                            {t("cancel")}
                        </button>
                        <button type="submit">
                            {client ? t("save") : t("create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientForm;
