import React from "react";
import { FaHome, FaCog, FaBars } from "react-icons/fa";
import "./sidebar.css";

const Sidebar = ({ collapsed, setCollapsed, activePage, setActivePage }) => {

    const menuItems = [
        { name: "Dashboard", icon: <FaHome /> },
        // { name: "Settings", icon: <FaCog /> }
    ];

    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <div className="sidebar-header">
                <button
                    className="toggle-btn"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <FaBars />
                </button>

                <h2 className="logo">Ping-Dash</h2>
            </div>

            <ul>
                {menuItems.map((item) => (

                    <li
                        key={item.name}
                        className={activePage === item.name ? "active" : ""}
                        onClick={() => setActivePage(item.name)}
                    >

                        {/* <li
                            key={item.name}
                            className={activePage === item.name ? "active" : ""}
                            onClick={() => setActivePage(item.name)}
                        > */}
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.name}</span>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default Sidebar;
