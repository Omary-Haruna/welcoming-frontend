import React from "react";
import styles from "./CartSummary.module.css";

const CartSummary = () => {
    return (
        <div className={styles.box} style={{ gridArea: "cartSummary" }}>
            <h2>Cart Summary</h2>
            <ul className={styles.list}>
                <li className={styles.listItem}>Product A - 2 pcs</li>
                <li className={styles.listItem}>Product B - 1 pc</li>
            </ul>

            <p>Total: $123.00</p>
        </div>
    );
};

export default CartSummary;
