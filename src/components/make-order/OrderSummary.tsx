import React from "react";
import styles from "./OrderSummary.module.css";

const OrderSummary = ({ orders }) => {
    if (!orders || orders.length === 0) {
        return (
            <div className={styles.box} style={{ gridArea: "orderSummary" }}>
                <h2>Order Summary</h2>
                <p>No submitted orders yet.</p>
            </div>
        );
    }

    return (
        <div className={styles.box} style={{ gridArea: "orderSummary" }}>
            <h2>Order Summary</h2>
            <ul className={styles.orderList}>
                {orders.map((order, index) => (
                    <li key={index} className={styles.orderItem}>
                        <div className={styles.header}>
                            <strong>{order.customerName || "Unnamed Customer"}</strong>
                            <span>{new Date(order.date).toLocaleString()}</span>
                        </div>
                        <div className={styles.details}>
                            <p>Region: {order.region}</p>
                            <p>Total Items: {order.products?.length || 0}</p>
                            <p>Total: <strong>{Number(order.totalAmount || 0).toLocaleString()} TZS</strong></p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderSummary;
