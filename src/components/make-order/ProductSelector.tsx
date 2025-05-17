import React from "react";
import Select from "react-select";
import styles from "./ProductSelector.module.css";

const ProductSelector = ({ products }) => {
    const options = Array.isArray(products)
        ? products.map((product) => ({
            value: product._id,
            label: product.name,
            price: product.sellingPrice,
            image: product.image,
        }))
        : [];

    const customOption = (props) => {
        const { data, innerRef, innerProps } = props;
        return (
            <div ref={innerRef} {...innerProps} className={styles.option}>
                <img src={data.image} alt={data.label} className={styles.image} />
                <div>
                    <p className={styles.name}>{data.label}</p>
                    <p className={styles.price}>Tsh {Number(data.price).toLocaleString()}</p>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.box} style={{ gridArea: "productSelector" }}>
            <h2>Product Selector</h2>
            <Select
                options={options}
                placeholder="Search for products..."
                components={{ Option: customOption }}
                className={styles.select}
            />
        </div>
    );
};

export default ProductSelector;
