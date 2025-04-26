import React, { useState } from 'react';
import styles from '../../styles/NewSale.module.css';
import {
    Header,
    SalesPoint,
    ProductsCategory,
    SalesCart,
    SalesSummary,
} from '../../components/Sales';

const NewSale: React.FC = () => {
    const [selectedCategory, setCategory] = useState('All');

    return (
        <div className={styles.container}>
            <div className={styles.category}>
                <ProductsCategory
                    onCategorySelect={(category) => setCategory(category)}
                    selectedCategory={selectedCategory}
                />

            </div>

            <div className={styles.pos}>
                <Header />
                <SalesPoint category={selectedCategory} onCategoryChange={setCategory} />
            </div>

            <div className={styles.cart}>
                <SalesCart />
            </div>

            <div className={styles.summary}>
                <SalesSummary />
            </div>
        </div>
    );
};

export default NewSale;
