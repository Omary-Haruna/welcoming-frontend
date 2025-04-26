import React, { useState } from 'react';
import styles from './customtable.module.css';

const ITEMS_PER_PAGE = 9;

export default function CustomerTable({ customers }) {
    const [selectedCustomers, setSelectedCustomers] = useState([]);
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

    const toggleSelectOne = (id) => {
        setSelectedCustomers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const getAvatar = (gender) => {
        return gender === 'female' ? '👩' : gender === 'male' ? '👨' : '🧑';
    };

    const getStatusClass = (status) => {
        return styles[`status${status.replace(/\s/g, '')}`] || '';
    };

    const formatPrice = (price) =>
        price?.toLocaleString('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 });

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead className={styles.thead}>

                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={currentCustomers.every((c) => selectedCustomers.includes(c.id))}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th>Name</th>
                        <th>Product Bought</th>
                        <th>Price</th>
                        <th>Region</th>
                        <th>Joined</th>
                        <th>Process</th>
                        <th>Returning</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCustomers.length === 0 ? (
                        <tr>
                            <td colSpan="8" className={styles.noData}>
                                🚫 No data found.
                            </td>
                        </tr>
                    ) : (
                        currentCustomers.map((customer) => (
                            <tr key={customer.id} className={styles.row}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomers.includes(customer.id)}
                                        onChange={() => toggleSelectOne(customer.id)}
                                    />
                                </td>
                                <td>{getAvatar(customer.gender)} {customer.name}</td>
                                <td>{customer.productBought || '—'}</td>
                                <td>{formatPrice(customer.price)}</td>
                                <td>{customer.region}</td>
                                <td>{customer.joinedDate}</td>
                                <td className={getStatusClass(customer.process)}>{customer.process}</td>
                                <td>{customer.returning ? '✅ Yes' : '❌ No'}</td>
                            </tr>
                        ))
                    )}
                </tbody>

            </table>

            {/* Pagination Controls (optional) */}
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                        return (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage && page <= currentPage + 3)
                        );
                    })
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
}
