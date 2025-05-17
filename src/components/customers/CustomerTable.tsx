import React, { useState } from 'react';
import styles from './customtable.module.css';

interface Product {
    name: string;
    price: number;
}

interface Customer {
    id: string;
    name: string;
    region: string;
    joinedDate: string;
    returning: boolean;
    products: Product[];
}

interface Props {
    customers: Customer[];
}

const ITEMS_PER_PAGE = 9;

const CustomerTable: React.FC<Props> = ({ customers }) => {
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentCustomers = customers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const toggleSelectAll = () => {
        const currentIds = currentCustomers.map((c) => c.id);
        if (currentIds.every((id) => selectedCustomers.includes(id))) {
            setSelectedCustomers(selectedCustomers.filter(id => !currentIds.includes(id)));
        } else {
            setSelectedCustomers([...new Set([...selectedCustomers, ...currentIds])]);
        }
    };

    const toggleSelectOne = (id: string) => {
        setSelectedCustomers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const formatPrice = (price: number) =>
        price?.toLocaleString('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 });

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <th><input type="checkbox" checked={currentCustomers.every((c) => selectedCustomers.includes(c.id))} onChange={toggleSelectAll} /></th>
                        <th>Name</th>
                        <th>Products Bought</th>
                        <th>Region</th>
                        <th>Joined</th>
                        <th>Returning</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCustomers.length === 0 ? (
                        <tr>
                            <td colSpan={6} className={styles.noData}>🚫 No data found.</td>
                        </tr>
                    ) : (
                        currentCustomers.map((customer) => {
                            const totalSpent = customer.products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;

                            return (
                                <tr key={customer.id} className={styles.row}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedCustomers.includes(customer.id)}
                                            onChange={() => toggleSelectOne(customer.id)}
                                        />
                                    </td>
                                    <td>{customer.name}</td>
                                    <td>
                                        <div style={{ whiteSpace: 'pre-line' }}>
                                            {customer.products?.map((p, i) => (
                                                <div key={i}>
                                                    {p.name} ({formatPrice(p.price)})
                                                </div>
                                            ))}
                                            <strong>Total: {formatPrice(totalSpent)}</strong>
                                        </div>
                                    </td>
                                    <td>{customer.region}</td>
                                    <td>{customer.joinedDate}</td>
                                    <td style={{ color: customer.returning ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {customer.returning ? '✅ Yes' : '❌ No'}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => page === 1 || page === totalPages || (page >= currentPage && page <= currentPage + 3))
                    .map((page, index, arr) => {
                        const prevPage = arr[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                            <React.Fragment key={page}>
                                {showEllipsis && <span className={styles.ellipsis}>...</span>}
                                <button
                                    className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        );
                    })}
            </div>
        </div>
    );
};

export default CustomerTable;
