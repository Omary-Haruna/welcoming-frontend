import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./Layout.module.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={styles.layoutContainer}>
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Wrapper */}
            <div className={styles.mainContentWrapper}>
                {/* Header - Should not be inside `mainContent` */}
                <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

                {/* Main Content */}
                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
