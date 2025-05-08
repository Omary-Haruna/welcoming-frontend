import React, { useState, useContext } from "react";
import styles from "../styles/Sidebar.module.css";
import Link from "next/link";
import {
    Dashboard,
    People,
    Settings,
    ExpandMore,
    ExpandLess,
    PushPin,
    PushPinOutlined,
    Inventory2,
    PointOfSale,
    MoneyOff,
    Logout,
    AdminPanelSettings,
} from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

interface MenuItemProps {
    href?: string;
    text: string;
    icon: React.ReactNode;
    isExpanded: boolean;
    subItems?: { href: string; text: string }[];
}

const MenuItem: React.FC<MenuItemProps> = ({ href, text, icon, isExpanded, subItems }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const handleClick = () => {
        if (subItems) {
            setIsSubMenuOpen((prev) => !prev);
        }
    };

    return (
        <li className={styles.menuItem}>
            {subItems ? (
                <div onClick={handleClick} className={styles.menuLink}>
                    {icon}
                    {isExpanded && <span>{text}</span>}
                    {isExpanded && (isSubMenuOpen ? <ExpandLess /> : <ExpandMore />)}
                </div>
            ) : (
                <Link href={href || "#"} passHref legacyBehavior>
                    <a className={styles.menuLink}>
                        {icon}
                        {isExpanded && <span>{text}</span>}
                    </a>
                </Link>
            )}

            {isSubMenuOpen && isExpanded && (
                <ul className={styles.subMenuList}>
                    {subItems?.map((subItem) => (
                        <li key={subItem.href}>
                            <Link href={subItem.href} passHref legacyBehavior>
                                <a className={styles.subMenuLink}>{subItem.text}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

const Sidebar: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const { user } = useContext(AuthContext);

    const hasPermission = (path: string) =>
        user?.role === "admin" || user?.permissions?.includes(path);

    const peopleSubItems = [
        { href: "/customer/CustomerManagement", text: "Customers" },
        { href: "/peoples/staff/StaffAccomplishment", text: "Accomplishment" },
        { href: "/peoples/staff/AddStaffForm", text: "Add Staff Member" },
    ].filter((item) => hasPermission(item.href));

    const inventorySubItems = [
        { href: "/inventory/add-products", text: "Add Product" },
        { href: "/inventory/views-products", text: "View Products" },
        { href: "/inventory/low-stocks", text: "Low Stocks" },
        { href: "/inventory/out-of-stocks", text: "Out of Stocks" },
    ].filter((item) => hasPermission(item.href));

    const expensesSubItems = [
        { href: "/expenses/expenses", text: "Expense" },
        { href: "/expenses/income", text: "Income" },
    ].filter((item) => hasPermission(item.href));

    const salesSubItems = [
        { href: "/sales/new-sale", text: "New Sale" },
        { href: "/sales/sales-list", text: "Sales List" },
        { href: "/admin/PendingCartsPage", text: "Pending Carts" },
    ].filter((item) => hasPermission(item.href));

    const adminSubItems = [
        { href: "/admin/ApproveUsers", text: "Approve Users" },
    ].filter((item) => hasPermission(item.href));

    const handlePinToggle = () => {
        setIsPinned((prev) => {
            const newPinnedState = !prev;
            if (newPinnedState) {
                setIsExpanded(true);
            }
            return newPinnedState;
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div
            className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}
            onMouseEnter={() => !isPinned && setIsExpanded(true)}
            onMouseLeave={() => !isPinned && setIsExpanded(false)}
        >
            <div className={styles.sidebarHeader}>
                <h2>{isExpanded ? "Menu" : ""}</h2>
                <button onClick={handlePinToggle} className={styles.pinBtn}>
                    {isPinned ? <PushPin /> : <PushPinOutlined />}
                </button>
            </div>

            <ul className={styles.menuList}>
                {/* ✅ Now only shows if user has permission OR is admin */}
                {hasPermission("/dashboard") && (
                    <MenuItem href="/dashboard" text="Dashboard" icon={<Dashboard />} isExpanded={isExpanded} />
                )}
                {peopleSubItems.length > 0 && (
                    <MenuItem text="People" icon={<People />} isExpanded={isExpanded} subItems={peopleSubItems} />
                )}
                {inventorySubItems.length > 0 && (
                    <MenuItem text="Inventory" icon={<Inventory2 />} isExpanded={isExpanded} subItems={inventorySubItems} />
                )}
                {expensesSubItems.length > 0 && (
                    <MenuItem text="Expenses" icon={<MoneyOff />} isExpanded={isExpanded} subItems={expensesSubItems} />
                )}
                {salesSubItems.length > 0 && (
                    <MenuItem text="Sales" icon={<PointOfSale />} isExpanded={isExpanded} subItems={salesSubItems} />
                )}
                {adminSubItems.length > 0 && (
                    <MenuItem text="Admin" icon={<AdminPanelSettings />} isExpanded={isExpanded} subItems={adminSubItems} />
                )}
                {hasPermission("/settings") && (
                    <MenuItem href="/settings" text="Settings" icon={<Settings />} isExpanded={isExpanded} />
                )}
            </ul>

            <div className={styles.logoutSection}>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <Logout />
                    {isExpanded && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
