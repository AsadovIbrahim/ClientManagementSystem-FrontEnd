import React, { useState } from 'react';
import './ClientGroupTreeView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen, faFile, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const TreeNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <li className="tree-node">
      <div
        className={`node-content ${isExpanded ? 'expanded' : ''}`}
        onClick={handleToggle}
      >
        <FontAwesomeIcon
          icon={hasChildren ? (isExpanded ? faChevronDown : faChevronRight) : faFile}
          className="toggle-icon"
        />

        <FontAwesomeIcon
          icon={hasChildren ? (isExpanded ? faFolderOpen : faFolder) : faFile}
          className={`folder-icon ${hasChildren ? 'folder' : 'file'}`}
        />

        <span className="node-label">{node.name}</span>
      </div>

      {isExpanded && hasChildren && (
        <ul className="tree-children">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
