import React, { useEffect, useState } from 'react';
import styles from './SalesSummary.module.css';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Link from 'next/link';

interface SaleItem {
    name: string;
    quantity: number;
    total: number;
    price: number;
    buyingPrice?: number;
}

interface SaleSummary {
    _id: string;
    soldAt: string;
    subtotal: number;
    total: number;
    items: SaleItem[];
}

const SalesSummary: React.FC = () => {
    const [summaries, setSummaries] = useState<SaleSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSales();

        const handleRefresh = () => fetchSales();
        window.addEventListener('salesUpdated', handleRefresh);

        return () => window.removeEventListener('salesUpdated', handleRefresh);
    }, []);

    const fetchSales = async () => {
        try {
            const res = await fetch('https://welcoming-backend.onrender.com/api/sales/all');
            const data = await res.json();

            if (data.success) {
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0);

                const todayEnd = new Date();
                todayEnd.setHours(23, 59, 59, 999);

                const filtered = data.sales.filter((sale: SaleSummary) => {
                    const saleDate = new Date(sale.soldAt);
                    return saleDate >= todayStart && saleDate <= todayEnd;
                });

                setSummaries(filtered);
            } else {
                console.error('Failed to load sales data');
            }
        } catch (err) {
            console.error('Error fetching sales:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirm = await Swal.fire({
            title: 'Delete Sale Record?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`https://welcoming-backend.onrender.com/api/sales/${id}`, {
                    method: 'DELETE',
                });
                const data = await res.json();
                if (data.success) {
                    Swal.fire('Deleted!', 'Sale has been removed.', 'success');
                    setSummaries((prev) => prev.filter((sale) => sale._id !== id));
                } else {
                    Swal.fire('Error!', 'Failed to delete sale.', 'error');
                }
            } catch (error) {
                console.error('Delete failed:', error);
                Swal.fire('Error!', 'Server error while deleting.', 'error');
            }
        }
    };

    const formatTsh = (value: number) => `Tshs ${value.toLocaleString('en-TZ')}/-`;

    if (loading) return <p className={styles.loading}>Loading today's sales summary...</p>;

    if (summaries.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Sales Summary</h2>
                <motion.p className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    No sales recorded today.
                </motion.p>
                <motion.div className={styles.linkPrompt} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Link href="/sales/sales-list" className={styles.link}>
                        Want more data? 👉 View full Sales List
                    </Link>
                </motion.div>
            </div>
        );
    }

    const totalRevenue = summaries.reduce((acc, s) => acc + s.total, 0);
    const totalQuantity = summaries.reduce((acc, s) => acc + s.items.reduce((sum, i) => sum + i.quantity, 0), 0);
    const totalProfit = summaries.reduce(
        (acc, s) => acc + s.items.reduce((sum, i) => sum + (i.price - (i.buyingPrice ?? i.price)) * i.quantity, 0),
        0
    );

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Today's Sales Summary</h2>
            <motion.div className={styles.tableWrapper} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Sold At</th>
                            <th>Subtotal</th>
                            <th>Total</th>
                            <th>Items</th>
                            <th>Profit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaries.map((summary) => {
                            const rowProfit = summary.items.reduce(
                                (sum, i) => sum + (i.price - (i.buyingPrice ?? i.price)) * i.quantity,
                                0
                            );
                            const profitPercent = summary.total > 0 ? ((rowProfit / summary.total) * 100).toFixed(1) : '0';

                            return (
                                <tr key={summary._id} className={styles.row}>
                                    <td>{new Date(summary.soldAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                                    <td>{formatTsh(summary.subtotal)}</td>
                                    <td>{formatTsh(summary.total)}</td>
                                    <td>
                                        <ul className={styles.itemList}>
                                            {summary.items.map((item, i) => {
                                                const profit = (item.price - (item.buyingPrice ?? item.price)) * item.quantity;
                                                return (
                                                    <li key={i}>
                                                        {item.name} × {item.quantity} = {formatTsh(item.total)}{' '}
                                                        <span style={{ color: profit < 0 ? 'red' : 'green' }}>
                                                            (Profit: {formatTsh(profit)})
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </td>
                                    <td>
                                        <span style={{ color: rowProfit < 0 ? 'red' : 'green' }}>
                                            <strong>{formatTsh(rowProfit)}</strong>
                                        </span>
                                        <br />
                                        <small>{profitPercent}%</small>
                                    </td>
                                    <td className={styles.actions}>
                                        <button title="Edit (coming soon)" disabled><Pencil size={16} /></button>
                                        <button onClick={() => handleDelete(summary._id)} title="Delete"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            );
                        })}
                        <tr className={styles.totalRow}>
                            <td><strong>Totals</strong></td>
                            <td></td>
                            <td><strong>{formatTsh(totalRevenue)}</strong></td>
                            <td><strong>{totalQuantity} items</strong></td>
                            <td>
                                <strong style={{ color: totalProfit < 0 ? 'red' : 'green' }}>
                                    {formatTsh(totalProfit)}
                                </strong>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </motion.div>

            <motion.div className={styles.linkPrompt} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Link href="/sales/sales-list" className={styles.link}>
                    View full Sales List here
                </Link>
            </motion.div>
        </div>
    );
};

export default SalesSummary;
