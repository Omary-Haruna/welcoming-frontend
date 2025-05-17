import React from "react";
import Select from "react-select";
import styles from "./ProductSelector.module.css";

const ProductSelector = ({ products, onAddToCart }) => {
    const options = Array.isArray(products)
        ? products.map((product) => ({
            ...product, // keep all original product fields
            value: product._id,
            label: product.name,
        }))
        : [];

    // 🔥 Trigger add to cart when selected
    const handleSelect = (selected) => {
        if (selected) {
            onAddToCart({
                _id: selected._id,
                name: selected.name,
                price: selected.sellingPrice,
                image: selected.image,
            });
        }
    };

    // 🎨 Custom dropdown with image + price
    const customOption = (props) => {
        const { data, innerRef, innerProps } = props;
        return (
            <div ref={innerRef} {...innerProps} className={styles.option}>
                <img src={data.image} alt={data.label} className={styles.image} />
                <div>
                    <p className={styles.name}>{data.label}</p>
                    <p className={styles.price}>Tsh {Number(data.sellingPrice).toLocaleString()}</p>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.box} style={{ gridArea: "productSelector" }}>
            <h2>Product Selector</h2>
            <Select
                options={options}
                onChange={handleSelect}
                placeholder="Search for products..."
                components={{ Option: customOption }}
                className={styles.select}
            />
        </div>
    );
};

export default ProductSelector;
