import React, { useEffect, useState } from 'react';
import styles from './SalesSummary.module.css';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface SaleItem {
    name: string;
    quantity: number;
    total: number;
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
    }, []);

    const fetchSales = async () => {
        try {
            const res = await fetch('https://welcoming-backend.onrender.com/api/sales/all');
            const data = await res.json();
            if (data.success) {
                setSummaries(data.sales);
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
                    fetchSales();
                } else {
                    Swal.fire('Error!', 'Failed to delete sale.', 'error');
                }
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const formatTsh = (value: number) => `Tshs ${value.toLocaleString('en-TZ')}/-`;

    if (loading) return <p className={styles.loading}>Loading sales summary...</p>;

    if (summaries.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Sales Summary</h2>
                <p className={styles.empty}>No sales recorded yet.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Sales Summary</h2>
            <motion.div
                className={styles.tableWrapper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Sold At</th>
                            <th>Subtotal</th>
                            <th>Total</th>
                            <th>Items</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaries.map((summary) => (
                            <tr key={summary._id} className={styles.row}>
                                <td>{new Date(summary.soldAt).toLocaleString()}</td>
                                <td>{formatTsh(summary.subtotal)}</td>
                                <td>{formatTsh(summary.total)}</td>
                                <td>
                                    <ul className={styles.itemList}>
                                        {summary.items.map((item, i) => (
                                            <li key={i}>
                                                {item.name} × {item.quantity} = {formatTsh(item.total)}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <button title="Edit (Coming soon)" disabled>
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(summary._id)} title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr className={styles.totalRow}>
                            <td><strong>Totals</strong></td>
                            <td></td>
                            <td><strong>{formatTsh(summaries.reduce((a, b) => a + b.total, 0))}</strong></td>
                            <td><strong>{summaries.reduce((acc, s) => acc + s.items.reduce((sum, i) => sum + i.quantity, 0), 0)} items sold</strong></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

export default SalesSummary;
