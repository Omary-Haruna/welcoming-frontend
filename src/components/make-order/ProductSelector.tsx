import React from "react";
import styles from "./ProductSelector.module.css";

const ProductSelector = () => {
    return (
        <div className={styles.box} style={{ gridArea: "productSelector" }}>
            <h2>Product Selector</h2>
            <input className={styles.input} type="text" placeholder="Search for products..." />

        </div>
    );
};

export default ProductSelector;
