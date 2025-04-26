import React, { useState } from 'react';
import styles from './Table.module.css';

export default function Table({ rows = [] }) { // ✅ Default empty array
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setExpandedIndex((prev) => (prev === index ? null : index));
    };

    return (
        <table className={styles.invoiceTable}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {rows?.map((row, index) => (  // ✅ Optional chaining for safety
                    <React.Fragment key={index}>
                        <tr
                            className={`${styles.clickableRow} ${expandedIndex === index ? styles.expanded : ''}`}
                            onClick={() => handleToggle(index)}
                        >
                            <td>{index + 1}</td>
                            <td>{row.customerName}</td>
                            <td>{row.product}</td>
                            <td>{row.quantity}</td>
                            <td>{row.total}</td>
                        </tr>

                        {expandedIndex === index && (
                            <tr className={styles.expandedRow}>
                                <td colSpan={5}>
                                    <div className={styles.expandedContent}>
                                        {/* BILLING INFO */}
                                        <div className={styles.block}>
                                            <h4>Billing Info</h4>
                                            <p><strong>Customer:</strong> {row.customerName}</p>
                                            <p><strong>Company:</strong> {row.companyName}</p>
                                            <p><strong>Address:</strong> {row.address}</p>
                                            <p><strong>Email:</strong> {row.email}</p>
                                            <p><strong>Phone:</strong> {row.phone}</p>
                                            <p><strong>TIN:</strong> {row.tin}</p>
                                        </div>

                                        {/* PRODUCT INFO */}
                                        <div className={styles.block}>
                                            <h4>Product</h4>
                                            <p><strong>Item:</strong> {row.product}</p>
                                            <p><strong>Quantity:</strong> {row.quantity}</p>
                                            <p><strong>Unit Price:</strong> {row.unitPrice}</p>
                                            <p><strong>Total:</strong> {row.total}</p>
                                        </div>

                                        {/* INVOICE INFO */}
                                        <div className={styles.block}>
                                            <h4>Invoice</h4>
                                            <p><strong>Invoice No:</strong> {row.invoiceNumber}</p>
                                            <p><strong>Invoice Date:</strong> {row.invoiceDate}</p>
                                            <p><strong>Due Date:</strong> {row.dueDate}</p>
                                            <p><strong>Payment Terms:</strong> {row.selectedPaymentTerm}</p>
                                            <p><strong>Description:</strong> {row.paymentDescription}</p>
                                            <p><strong>Reference:</strong> {row.reference}</p>
                                            <p><strong>Currency:</strong> {row.currency}</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
}
