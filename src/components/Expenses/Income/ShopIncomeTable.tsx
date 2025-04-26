import React from "react";
import styles from "./ShopIncomeTable.module.css";

const ShopIncomeTable: React.FC = () => {
    const data = [
        { date: "2023-01-01", product: "Product 1", price: 100, quantity: 2, profit: 50 },
        { date: "2023-01-02", product: "Product 2", price: 150, quantity: 1, profit: 60 },
        { date: "2023-01-03", product: "Product 3", price: 200, quantity: 3, profit: 120 },
    ];

    const totalQuantity = data.reduce((sum, row) => sum + row.quantity, 0);
    const totalProfit = data.reduce((sum, row) => sum + row.profit, 0);

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Profit Made</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>
                            <td>{row.product}</td>
                            <td className={styles.blue}>{row.price}</td>
                            <td className={styles.blue}>{row.quantity}</td>
                            <td className={styles.blue}>{row.profit}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className={styles.footerRow}>
                        <td colSpan={3}><strong>Total</strong></td>
                        <td className={styles.blue}><strong>{totalQuantity}</strong></td>
                        <td className={styles.blue}><strong>{totalProfit}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ShopIncomeTable;
