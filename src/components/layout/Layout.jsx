import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Layout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faSitemap,
  faList,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const Layout = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <h2 className="sidebar-title">{t("client_system")}</h2>
        <nav className="nav-menu">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faUsers} /> <span>{t("clients")}</span>
          </Link>

          <Link
            to="/groups"
            className={`nav-link ${location.pathname === "/groups" ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faList} /> <span>{t("client_groups")}</span>
          </Link>

          <Link
            to="/group-tree"
            className={`nav-link ${location.pathname === "/group-tree" ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faSitemap} /> <span>{t("group_structure")}</span>
          </Link>
        </nav>
      </aside>

      {/* Toggle button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
      </button>

      {/* Main Content */}
      <main className={`main-content ${!isSidebarOpen ? "expanded" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
