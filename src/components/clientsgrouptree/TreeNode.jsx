import React, { useState, useEffect } from 'react';
import './ClientGroupTreeView.css';

const TreeNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li className="tree-node">
      <div className="node-content" onClick={handleToggle}>
        <span className="toggle-icon">
          {node.children && node.children.length > 0 ? (isExpanded ? '−' : '+') : '○'}
        </span>
        <span className="node-label">{node.name}</span>
      </div>
      {isExpanded && node.children && node.children.length > 0 && (
        <ul className="tree-children">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;