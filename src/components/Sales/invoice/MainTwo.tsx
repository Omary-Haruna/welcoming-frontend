import React from 'react';
import styles from './MainTwo.module.css';
import Logo from './mainInvoice/Logo';
import Header from './mainInvoice/Header';
import Info from './mainInvoice/Info';
import Table from './mainInvoice/Table';
import FinalLayer from './mainInvoice/FinalLayer';

export default function MainTwo() {
    return (
        <div className={styles.mainGrid}>
            <div className={styles.logo}><Logo /></div>
            <div className={styles.header}><Header /></div>
            <div className={styles.info}><Info /></div>
            <div className={styles.table}><Table /></div>
            <div className={styles.final}><FinalLayer /></div>
        </div>
    );
}
