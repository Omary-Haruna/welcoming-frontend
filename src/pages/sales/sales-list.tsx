import React from 'react';
import styles from '../../styles/sales-list.module.css';
import HeaderOne from '../../components/sale/HeaderOne';
import MainPage from '../../components/sale/MainPage';

const SalesList = () => {
    return (
        <div className={styles.container}>
            <HeaderOne />
            <MainPage />
        </div>
    );
};

export default SalesList;
