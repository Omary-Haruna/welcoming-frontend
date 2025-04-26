import React, { useEffect, useState } from 'react';
import styles from './mainpage.module.css';
import { v4 as uuidv4 } from 'uuid';

const MainPage = () => {
    const [salesData, setSalesData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [search, setSearch] = useState('');
    const [payment, setPayment] = useState('All');
    const [priceRange, setPriceRange] = useState('All');
    const [dateFilter, setDateFilter] = useState('All');

    useEffect(() => {
        const sampleData = [
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-27',
                product: 'HP EliteBook 840',
                biller: 'John M.',
                payment: 'Cash',
                price: 450000,
                quantity: 2,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-26',
                product: 'Wireless Keyboard',
                biller: 'Jane D.',
                payment: 'Mobile',
                price: 125000,
                quantity: 1,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-25',
                product: 'Dell Monitor 24"',
                biller: 'Kevin A.',
                payment: 'Bank',
                price: 950000,
                quantity: 3,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-24',
                product: 'Lenovo ThinkPad X1',
                biller: 'Alice K.',
                payment: 'Cash',
                price: 670000,
                quantity: 1,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-24',
                product: 'USB-C Docking Station',
                biller: 'Mark S.',
                payment: 'Bank',
                price: 180000,
                quantity: 2,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-23',
                product: 'iPad Air 2024',
                biller: 'Nina P.',
                payment: 'Mobile',
                price: 1200000,
                quantity: 1,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-22',
                product: 'ASUS ROG Strix Laptop',
                biller: 'Zack R.',
                payment: 'Cash',
                price: 2200000,
                quantity: 1,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-22',
                product: 'Bluetooth Mouse',
                biller: 'Emily B.',
                payment: 'Mobile',
                price: 85000,
                quantity: 2,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-21',
                product: 'Canon Printer G3010',
                biller: 'Daniel W.',
                payment: 'Bank',
                price: 350000,
                quantity: 1,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-21',
                product: 'Office Chair',
                biller: 'Sara M.',
                payment: 'Cash',
                price: 150000,
                quantity: 3,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-20',
                product: 'External SSD 1TB',
                biller: 'Bruno G.',
                payment: 'Bank',
                price: 290000,
                quantity: 2,
            },
            {
                id: uuidv4().slice(0, 8),
                date: '2025-03-20',
                product: 'MacBook Pro 14"',
                biller: 'Linda T.',
                payment: 'Mobile',
                price: 3200000,
                quantity: 1,
            }
        ];
        setSalesData(sampleData);
        setFilteredData(sampleData);
    }, []);

    useEffect(() => {
        let filtered = [...salesData];

        if (search.trim()) {
            filtered = filtered.filter((sale) =>
                `${sale.biller} ${sale.product}`.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (payment !== 'All') {
            filtered = filtered.filter((sale) => sale.payment === payment);
        }

        filtered = filtered.filter((sale) => {
            switch (priceRange) {
                case 'Under 250,000':
                    return sale.price < 250000;
                case 'Over 250,000':
                    return sale.price > 250000;
                case 'Under 500,000':
                    return sale.price < 500000;
                case 'Under 1,000,000':
                    return sale.price < 1000000;
                case 'Over 1,000,000':
                    return sale.price > 1000000;
                case 'Over 2,000,000':
                    return sale.price > 2000000;
                default:
                    return true;
            }
        });

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (dateFilter === 'Today') {
            filtered = filtered.filter((sale) => sale.date === today);
        } else if (dateFilter === 'Yesterday') {
            filtered = filtered.filter((sale) => sale.date === yesterday);
        }

        setFilteredData(filtered);
    }, [search, payment, priceRange, dateFilter, salesData]);

    const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = filteredData.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className={styles.mainPage}>
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label>Search</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search customer or product..."
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label>Payment</label>
                    <select value={payment} onChange={(e) => setPayment(e.target.value)}>
                        <option>All</option>
                        <option>Cash</option>
                        <option>Bank</option>
                        <option>Mobile</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>Price</label>
                    <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                        <option>All</option>
                        <option>Under 250,000</option>
                        <option>Over 250,000</option>
                        <option>Under 500,000</option>
                        <option>Under 1,000,000</option>
                        <option>Over 1,000,000</option>
                        <option>Over 2,000,000</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>Date</label>
                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                        <option>All</option>
                        <option>Today</option>
                        <option>Yesterday</option>
                    </select>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                {filteredData.length === 0 ? (
                    <p className={styles.noData}>No customer was provided.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>UUID</th>
                                <th>Date</th>
                                <th>Product</th>
                                <th>Biller</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((sale) => (
                                <tr key={sale.id} className={styles.fadeIn}>
                                    <td>{sale.id}</td>
                                    <td>{sale.date}</td>
                                    <td>{sale.product}</td>
                                    <td>{sale.biller}</td>
                                    <td>{sale.price.toLocaleString()} TZS</td>
                                    <td>{sale.quantity}</td>
                                    <td>{(sale.price * sale.quantity).toLocaleString()} TZS</td>
                                    <td>
                                        <button className={styles.view}>View</button>
                                        <button className={styles.delete}>Delete</button>
                                        <button className={styles.print}>Print</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={5}></td>
                                <td><strong>{totalQuantity}</strong></td>
                                <td><strong>{totalPrice.toLocaleString()} TZS</strong></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MainPage;
