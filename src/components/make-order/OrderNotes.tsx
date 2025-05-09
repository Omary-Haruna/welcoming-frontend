import React from "react";
import styles from "./OrderNotes.module.css";

const OrderNotes = () => {
    return (
        <div className={styles.box} style={{ gridArea: "orderNotes" }}>
            <h2>Order Notes</h2>
            <textarea className={styles.textarea} placeholder="Enter any special notes..."></textarea>
        </div>
    );
};

export default OrderNotes;
