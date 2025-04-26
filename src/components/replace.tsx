import React, { useState } from 'react';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import { ShoppingCart as SalesIcon } from '@mui/icons-material';
import { Store as InventoryIcon } from '@mui/icons-material';
import { Store as StockIcon } from '@mui/icons-material';
import { ShoppingCart as PurchaseIcon } from '@mui/icons-material';
import { MonetizationOn as FinanceIcon } from '@mui/icons-material';
import { People as PeopleIcon } from '@mui/icons-material';
import { Report as ReportIcon } from '@mui/icons-material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { ExpandLess as ExpandLessIcon } from '@mui/icons-material';

import styles from '../styles/Sidebar.module.css';

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

    const toggleDropdown = (category: string) => {
        setOpenDropdown(openDropdown === category ? null : category);
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <h2>Sidebar</h2>
            <ul className={styles.menuList}>
                {/* Dashboard */}
                <li>
                    <div className={styles.menuItem}>
                        <DashboardIcon />
                        <span>Dashboard</span>
                    </div>
                </li>

                {/* Sales Dropdown */}
                <li>
                    <div className={styles.menuItem} onClick={() => toggleDropdown('sales')}>
                        <SalesIcon />
                        <span>Sales</span>
                        {openDropdown === 'sales' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                    <ul className={`${styles.dropdownList} ${openDropdown === 'sales' ? styles.show : ''}`}>
                        <li>Sales Category 1</li>
                        <li>Sales Category 2</li>
                    </ul>
                </li>

                {/* Inventory Dropdown */}
                <li>
                    <div className={styles.menuItem} onClick={() => toggleDropdown('inventory')}>
                        <InventoryIcon />
                        <span>Inventory</span>
                        {openDropdown === 'inventory' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                    <ul className={`${styles.dropdownList} ${openDropdown === 'inventory' ? styles.show : ''}`}>
                        <li>Inventory Category 1</li>
                        <li>Inventory Category 2</li>
                    </ul>
                </li>


                {/* Stock Dropdown */}
                <li>
                    <div className={styles.menuItem} onClick={() => toggleDropdown('stock')}>
                        <StockIcon />
                        <span>Stock</span>
                        {openDropdown === 'stock' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                    <ul className={`${styles.dropdownList} ${openDropdown === 'stock' ? styles.show : ''}`}>
                        <li>Stock Category 1</li>
                        <li>Stock Category 2</li>
                    </ul>
                </li>

                {/* Purchase Dropdown */}
                <li>
                    <div className={styles.menuItem} onClick={() => toggleDropdown('purchase')}>
                        <PurchaseIcon />
                        <span>Purchase</span>
                        {openDropdown === 'purchase' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                    <ul className={`${styles.dropdownList} ${openDropdown === 'purchase' ? styles.show : ''}`}>
                        <li>Purchase Category 1</li>
                        <li>Purchase Category 2</li>
                    </ul>
                </li>

                {/* Finance Dropdown */}
                <li>
                    <div className={styles.menuItem} onClick={() => toggleDropdown('finance')}>
                        <FinanceIcon />
                        <span>Finance</span>
                        {openDropdown === 'finance' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                    <ul className={`${styles.dropdownList} ${openDropdown === 'finance' ? styles.show : ''}`}>
                        <li>Finance Category 1</li>
                        <li>Finance Category 2</li>
                    </ul>
                </li>

                {/* People Dropdown */}
                <li>
                    <div className={styles.menuItem} onClick={() => toggleDropdown('people')}>
                        <PeopleIcon />
                        <span>People</span>
                        {openDropdown === 'people' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                    <ul className={`${styles.dropdownList} ${openDropdown === 'people' ? styles.show : ''}`}>
                        <li>People Category 1</li>
                        <li>People Category 2</li>
                    </ul>
                </li>

                {/* Report Dropdown */}
                <li>
                    <div className={styles.menuItem} onClick={() => toggleDropdown('report')}>
                        <ReportIcon />
                        <span>Report</span>
                        {openDropdown === 'report' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                    <ul className={`${styles.dropdownList} ${openDropdown === 'report' ? styles.show : ''}`}>
                        <li>Report Category 1</li>
                        <li>Report Category 2</li>
                    </ul>
                </li>

                {/* User Management Dropdown */}
                <li>
                    <div className={styles.menuItem} onClick={() => toggleDropdown('userManagement')}>
                        <SettingsIcon />
                        <span>User Management</span>
                        {openDropdown === 'userManagement' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                    <ul className={`${styles.dropdownList} ${openDropdown === 'userManagement' ? styles.show : ''}`}>
                        <li>User Management Category 1</li>
                        <li>User Management Category 2</li>
                    </ul>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
