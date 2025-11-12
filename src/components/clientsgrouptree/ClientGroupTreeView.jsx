import React, { useState, useEffect } from "react";
import "./ClientGroupTreeView.css";
import TreeNode from "./TreeNode";
import clientGroupService from "../../api/clientGroupService";
import { useTranslation } from 'react-i18next';

const ClientGroupTreeView = () => {
    const { t } = useTranslation();
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await clientGroupService.getAllClientGroupsForDropdown();
            if (response.success) {
                setTreeData(response.data);
            }
        } catch (error) {
            console.error("Error fetching tree data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="tree-loading">{t('loading')}</div>;
    }

    return (
        <div className="client-group-tree-view">
            <h2 className="tree-title">
                {t('organization_structure', { defaultValue: "Təşkilatın Strukturu" })}
            </h2>
            {treeData.length > 0 ? (
                <ul className="tree">
                    {treeData.map(node => (
                        <TreeNode key={node.id} node={node} />
                    ))}
                </ul>
            ) : (
                <div className="no-data">{t('no_clients')}</div>
            )}
        </div>
    );
};

export default ClientGroupTreeView;
