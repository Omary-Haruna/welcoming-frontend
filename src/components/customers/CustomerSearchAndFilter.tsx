import React from 'react';
import styles from './CustomerSearchAndFilter.module.css';
import {
    Search,
    User,
    ShoppingCart,
    Wallet,
    RefreshCcw,
    CalendarDays,
    MapPin,
    Users,
    BadgeCheck,
    Repeat,
    ArrowDownWideNarrow,
} from 'lucide-react';

export default function CustomerSearchAndFilter({ filters = {}, onChange }) {

    const handleChange = (field, value) => {
        onChange({ ...filters, [field]: value });
    };

    return (
        <div className={styles.filtersContainer}>
            <div className={styles.filterItem}>
                <Search size={18} className={styles.icon} />
                <input
                    className={styles.textInput}
                    type="text"
                    placeholder="Search by name..."
                    value={filters.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
            </div>

            <div className={styles.filterItem}>
                <User size={18} className={styles.icon} />
                <select
                    className={styles.select}
                    value={filters.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value)}
                >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div className={styles.filterItem}>
                <ShoppingCart size={18} className={styles.icon} />
                <select
                    className={styles.select}
                    value={filters.productBought || ''}
                    onChange={(e) => handleChange('productBought', e.target.value)}
                >
                    <option value="">All Products</option>
                    {/* Dynamically insert products */}
                </select>
            </div>

            <div className={styles.rangeGroup}>
                <Repeat size={18} className={styles.icon} />
                <label>Quantity: {filters.quantity || 1}</label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={filters.quantity || 1}
                    onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
                />
            </div>

            <div className={styles.rangeGroup}>
                <Wallet size={18} className={styles.icon} />
                <label>Price: {filters.price || 150000}</label>
                <input
                    type="range"
                    min="150000"
                    max="4000000"
                    value={filters.price || 150000}
                    onChange={(e) => handleChange('price', parseInt(e.target.value))}
                />
            </div>

            <div className={styles.rangeGroup}>
                <ArrowDownWideNarrow size={18} className={styles.icon} />
                <label>Frequency: {filters.frequency || 1}</label>
                <input
                    type="range"
                    min="1"
                    max="15"
                    value={filters.frequency || 1}
                    onChange={(e) => handleChange('frequency', parseInt(e.target.value))}
                />
            </div>

            <div className={styles.filterItem}>
                <MapPin size={18} className={styles.icon} />
                <select
                    className={styles.select}
                    value={filters.region || ''}
                    onChange={(e) => handleChange('region', e.target.value)}
                >
                    <option value="">All Regions</option>
                </select>
            </div>

            <div className={styles.filterItem}>
                <CalendarDays size={18} className={styles.icon} />
                <input
                    type="date"
                    className={styles.datePicker}
                    value={filters.joinedDate || ''}
                    onChange={(e) => handleChange('joinedDate', e.target.value)}
                />
            </div>

            <div className={styles.filterItemToggle}>
                <BadgeCheck size={18} className={styles.icon} />
                <label>
                    <input
                        type="checkbox"
                        checked={filters.returning || false}
                        onChange={(e) => handleChange('returning', e.target.checked)}
                    />
                    Returning Customer
                </label>
            </div>

            <div className={styles.filterItem}>
                <RefreshCcw size={18} className={styles.icon} />
                <select
                    className={styles.select}
                    value={filters.process || ''}
                    onChange={(e) => handleChange('process', e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="In Progress">In Progress</option>
                </select>
            </div>

            <div className={styles.filterItem}>
                <Users size={18} className={styles.icon} />
                <select
                    className={styles.select}
                    value={filters.paymentMethod || ''}
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                >
                    <option value="">All Payment Methods</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="Mobile">Mobile</option>
                </select>
            </div>
        </div>
    );
}