import React from "react";
import styles from "./SelectCustomer.module.css";

const SelectCustomer = () => {
    return (
        <div className={styles.box} style={{ gridArea: "selectCustomer" }}>
            <h2>Select Customer</h2>
            <select>
                <option>Choose a customer</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
            </select>
        </div>
    );
};

export default SelectCustomer;
