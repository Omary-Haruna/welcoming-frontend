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
}

const MainPage = () => {
    const [salesData, setSalesData] = useState<SaleItem[]>([]);
    const [filteredData, setFilteredData] = useState<SaleItem[]>([]);

    const [search, setSearch] = useState('');
    const [payment, setPayment] = useState('All');
    const [priceRange, setPriceRange] = useState('All');
    const [dateFilter, setDateFilter] = useState('All');

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
                                    <td>{sale.id}</td>
                                    <td>{sale.date}</td>
                                    <td>{sale.product}</td>
                                    <td>{sale.biller}</td>
                                    <td>{sale.payment}</td>
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
                                <td colSpan={6}></td>
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
