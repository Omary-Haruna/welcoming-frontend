import React, { useState } from 'react';
//import Header from '../../components/sales/invoice/Header';
//import MainOne from '../../components/sales/invoice/MainOne';
//import MainTwo from '../../components/sales/invoice/MainTwo';
//import Table from '../../components/sales/invoice/Table';
//import FinalLayer from '../../components/sales/invoice/FinalLayer';
//import InvoicesSummary from '../../components/sales/invoice/InvoicesSummary';
//import styles from '../../styles/invoices.module.css';

export default function InvoicesPage() {
    const [showForm, setShowForm] = useState(false);
    const [tableData, setTableData] = useState([]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Header />
            </header>
            <section className={styles.summary}>
                <InvoicesSummary />
            </section>

            <section className={styles.mainSplit}>
                <div className={styles.mainOne}><MainOne showForm={showForm} setTableData={setTableData} /></div>
                <div className={styles.mainTwo}><MainTwo /></div>
            </section>



            <section className={styles.table}>
                <Table rows={tableData} />
            </section>

            <footer className={styles.finalLayer}>
                <FinalLayer />
            </footer>
        </div>
    );
}
