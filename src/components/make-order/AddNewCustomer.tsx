import React from "react";
import styles from "./AddNewCustomer.module.css";

const AddNewCustomer = () => {
    return (
        <div className={styles.box} style={{ gridArea: "addNewCustomer" }}>
            <h2>Add New Customer</h2>
            <input className={styles.input} type="text" placeholder="Full Name" />
            <input className={styles.input} type="email" placeholder="Email Address" />
            <input className={styles.input} type="text" placeholder="Phone Number" />

        </div>
    );
};

export default AddNewCustomer;
