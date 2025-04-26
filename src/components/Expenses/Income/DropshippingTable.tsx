import React from "react";
import styles from "./DropshippingTable.module.css";

const DropshippingTable: React.FC = () => {
    // Updated mock data with "takenFrom" field
    const rows = [
        { date: "2023-01-02", product: "Product A", qty: 1, price: 150, profit: 30, takenFrom: "AliExpress" },
        { date: "2023-01-03", product: "Product B", qty: 2, price: 200, profit: 50, takenFrom: "Amazon" },
        { date: "2023-01-04", product: "Product C", qty: 3, price: 300, profit: 100, takenFrom: "Alibaba" },
    ];

    const totalQty = rows.reduce((acc, row) => acc + row.qty, 0);
    const totalProfit = rows.reduce((acc, row) => acc + row.profit, 0);

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Selling Price</th>
                        <th>Profit Made</th>
                        <th>Taken From</th> {/* New column */}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>
                            <td>{row.product}</td>
                            <td>{row.qty}</td>
                            <td>{row.price}</td>
                            <td>{row.profit}</td>
                            <td>{row.takenFrom}</td> {/* New value */}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className={styles.footerRow}>
                        <td colSpan={2}><strong>Total</strong></td>
                        <td><strong>{totalQty}</strong></td>
                        <td></td>
                        <td><strong>{totalProfit}</strong></td>
                        <td></td> {/* Empty footer cell for new column */}
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default DropshippingTable;
