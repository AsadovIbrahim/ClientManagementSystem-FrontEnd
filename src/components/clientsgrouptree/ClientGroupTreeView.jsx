import React,{useState,useEffect, use}from "react";
import "./ClientGroupTreeView.css";
import TreeNode from "./TreeNode";
import clientGroupService from "../../api/clientGroupService";


const ClientGroupTreeView = () => {
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
    return (
    <div className="client-group-tree-view">
      <h2>Təşkilatın Strukturu</h2>
      <ul className="tree">
        {treeData.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </ul>
    </div>
  );
};

export default ClientGroupTreeView;