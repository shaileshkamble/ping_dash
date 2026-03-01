import React, { useState } from "react";
import Sidebar from "./components/sidebar/sidebar";
import Dashboard from "./components/dashbord/dashboard";
import "./App.css";

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activePage, setActivePage] = useState("Dashboard");

    const renderContent = () => {
        switch (activePage) {
            case "Dashboard":
                return  <Dashboard/>

            case "Settings":
                return <h1>Settings Content</h1>;

            default:
                return <h1>Welcome</h1>;
        }
    };

    return (
        <div className="layout">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;
