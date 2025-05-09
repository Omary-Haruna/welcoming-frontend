import React from "react";
import styles from "./PaymentDetails.module.css";

const PaymentDetails = () => {
    return (
        <div className={styles.box} style={{ gridArea: "paymentDetails" }}>
            <h2>Payment Details</h2>
            <select>
                <option value="">Select payment method</option>
                <option>Cash</option>
                <option>Mobile Money</option>
                <option>Bank</option>
            </select>
        </div>
    );
};

export default PaymentDetails;
