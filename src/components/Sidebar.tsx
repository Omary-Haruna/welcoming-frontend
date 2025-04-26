// src/components/Sidebar.tsx
import React, { useState } from "react";
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
} from "@mui/icons-material";

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
                            <Link href={subItem.href || "#"} passHref legacyBehavior>
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

    const peopleSubItems = [
        { href: "/customer/CustomerManagement", text: "Customers" },
        { href: "/peoples/Accomplishment/StaffPage", text: "Staff Members" },
        { href: "/peoples/staff/StaffAccomplishment", text: "Accomplishment" },
        { href: "/peoples/staff/AddStaffMember", text: "Add Staff Member" },
    ];


    const inventorySubItems = [
        { href: "/inventory/add-products", text: "Add Product" },
        { href: "/inventory/views-products", text: "View Products" },
        { href: "/inventory/low-stocks", text: "Low Stocks" },
        { href: "/inventory/out-of-stocks", text: "Out of Stocks" },
    ];

    const inventoryCategorySubItems = [
        { href: "/expenses/expenses", text: "Expense" },
        { href: "/expenses/income", text: "Income" },
    ];

    const salesSubItems = [
        { href: "/sales/new-sale", text: "New Sale" },
        { href: "/sales/sales-list", text: "Sales List" },
        { href: "/sales/invoices", text: "Invoices" },
    ];

    const handlePinToggle = () => {
        setIsPinned((prev) => {
            const newPinnedState = !prev;
            if (newPinnedState) {
                setIsExpanded(true);
            }
            return newPinnedState;
        });
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
                <MenuItem href="/dashboard" text="Dashboard" icon={<Dashboard />} isExpanded={isExpanded} />
                <MenuItem text="People" icon={<People />} isExpanded={isExpanded} subItems={peopleSubItems} />
                <MenuItem text="Inventory" icon={<Inventory2 />} isExpanded={isExpanded} subItems={inventorySubItems} />
                <MenuItem text="Expenses" icon={<MoneyOff />} isExpanded={isExpanded} subItems={inventoryCategorySubItems} />
                <MenuItem text="Sales" icon={<PointOfSale />} isExpanded={isExpanded} subItems={salesSubItems} />
                <MenuItem href="/settings" text="Settings" icon={<Settings />} isExpanded={isExpanded} />
            </ul>
        </div>
    );
};

export default Sidebar;
