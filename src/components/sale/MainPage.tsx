import React, { useEffect, useState } from 'react';
import styles from './mainpage.module.css';

interface SaleItem {
    id: string;
    date: string;
    product: string;
    biller: string;
    payment: string;
    price: number;
    quantity: number;
    buyingPrice: number;
}

// 📅 Utility functions
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const getDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return formatDate(date);
};

const MainPage = () => {
    const [salesData, setSalesData] = useState<SaleItem[]>([]);
    const [filteredData, setFilteredData] = useState<SaleItem[]>([]);

    const [search, setSearch] = useState('');
    const [payment, setPayment] = useState('All');
    const [priceRange, setPriceRange] = useState('All');
    const [dateFilter, setDateFilter] = useState('Today');
    const [selectedDate, setSelectedDate] = useState('');
    const [rangeFrom, setRangeFrom] = useState('');
    const [rangeTo, setRangeTo] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user?.role === 'admin' || user?.email === 'admin@example.com';

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/sales/all');
                const data = await res.json();
                if (data.success) {
                    const formatted = data.sales.flatMap((sale: any) =>
                        sale.items.map((item: any) => ({
                            id: sale._id.slice(-8),
                            date: sale.soldAt.split('T')[0],
                            product: item.name,
                            biller: sale.biller || 'N/A',
                            payment: sale.paymentMethod || 'Cash',
                            price: item.total / item.quantity,
                            quantity: item.quantity,
                            buyingPrice: item.buyingPrice || 0,
                        }))
                    );
                    setSalesData(formatted);
                    setFilteredData(formatted);
                }
            } catch (err) {
                console.error('Error fetching sales:', err);
            }
        };

        fetchSales();
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
                case 'Under 250,000': return sale.price < 250000;
                case 'Over 250,000': return sale.price > 250000;
                case 'Under 500,000': return sale.price < 500000;
                case 'Under 1,000,000': return sale.price < 1000000;
                case 'Over 1,000,000': return sale.price > 1000000;
                case 'Over 2,000,000': return sale.price > 2000000;
                default: return true;
            }
        });

        // ✅ Date filter logic
        const today = formatDate(new Date());

        if (dateFilter === 'Today') {
            filtered = filtered.filter((sale) => sale.date === today);
        } else if (dateFilter === 'Yesterday') {
            filtered = filtered.filter((sale) => sale.date === getDaysAgo(1));
        } else if (dateFilter === 'Last 7 Days') {
            const from = getDaysAgo(6);
            filtered = filtered.filter((sale) => sale.date >= from && sale.date <= today);
        } else if (dateFilter === 'Last 30 Days') {
            const from = getDaysAgo(29);
            filtered = filtered.filter((sale) => sale.date >= from && sale.date <= today);
        } else if (dateFilter === 'Select Date' && selectedDate) {
            filtered = filtered.filter((sale) => sale.date === selectedDate);
        } else if (dateFilter === 'Custom Range' && rangeFrom && rangeTo) {
            filtered = filtered.filter((sale) => sale.date >= rangeFrom && sale.date <= rangeTo);
        }

        setFilteredData(filtered);
    }, [search, payment, priceRange, dateFilter, selectedDate, rangeFrom, rangeTo, salesData]);

    const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = filteredData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalProfit = filteredData.reduce(
        (sum, item) => sum + (item.price - item.buyingPrice) * item.quantity,
        0
    );

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
                        <option>Today</option>
                        <option>Yesterday</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Select Date</option>
                        <option>Custom Range</option>
                    </select>
                </div>

                {dateFilter === 'Select Date' && (
                    <div className={styles.filterGroup}>
                        <label>Pick Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                )}

                {dateFilter === 'Custom Range' && (
                    <>
                        <div className={styles.filterGroup}>
                            <label>From</label>
                            <input
                                type="date"
                                value={rangeFrom}
                                onChange={(e) => setRangeFrom(e.target.value)}
                            />
                        </div>
                        <div className={styles.filterGroup}>
                            <label>To</label>
                            <input
                                type="date"
                                value={rangeTo}
                                onChange={(e) => setRangeTo(e.target.value)}
                            />
                        </div>
                    </>
                )}
            </div>

            <div className={styles.tableWrapper}>
                {filteredData.length === 0 ? (
                    <p className={styles.noData}>No sales data found.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>UUID</th>
                                <th>Date</th>
                                <th>Product</th>
                                <th>Biller</th>
                                <th>Payment</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((sale) => (
                                <tr key={sale.id} className={styles.fadeIn}>
                                    <td data-label="UUID">{sale.id}</td>
                                    <td data-label="Date">{sale.date}</td>
                                    <td data-label="Product">{sale.product}</td>
                                    <td data-label="Biller">{sale.biller}</td>
                                    <td data-label="Payment">{sale.payment}</td>
                                    <td data-label="Price">{sale.price.toLocaleString()} TZS</td>
                                    <td data-label="Qty">{sale.quantity}</td>
                                    <td data-label="Total">{(sale.price * sale.quantity).toLocaleString()} TZS</td>
                                    <td data-label="Actions">
                                        <button className={styles.view}>View</button>
                                        <button className={styles.delete}>Delete</button>
                                        <button className={styles.print}>Print</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={6}></td>
                                <td><strong>{totalQuantity} QTY</strong></td>
                                <td><strong>TOTAL {totalPrice.toLocaleString()} TZS</strong></td>
                                <td></td>
                            </tr>
                            {isAdmin && (
                                <tr>
                                    <td colSpan={6}></td>
                                    <td colSpan={2}><strong>Profit: {totalProfit.toLocaleString()} TZS</strong></td>
                                    <td></td>
                                </tr>
                            )}
                        </tfoot>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MainPage;
