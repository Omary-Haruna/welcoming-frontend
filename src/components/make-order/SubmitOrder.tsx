import React from "react";
import styles from "./SubmitOrder.module.css";

const SubmitOrder = () => {
    return (
        <div className={styles.box} style={{ gridArea: "submitOrder" }}>
            <button className={styles.button}>✅ Place Order</button>
        </div>
    );
};

export default SubmitOrder;
