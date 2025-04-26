import React from "react";
import IncomeHeader from "../../components/Expenses/Income/IncomeHeader";
import SummaryCards from "../../components/Expenses/Income/SummaryCards";
import ShopIncomeTable from "../../components/Expenses/Income/ShopIncomeTable";
import DropshippingTable from "../../components/Expenses/Income/DropshippingTable";
import LeftSidebar from "../../components/Expenses/Income/LeftSidebar";
import RightSidebar from "../../components/Expenses/Income/RightSidebar";
import BottomSummary from "../../components/Expenses/Income/BottomSummary";
import styles from "../../styles/Income.module.css";

const IncomePage: React.FC = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <IncomeHeader />
            </header>
            <section className={styles.cards}>
                <SummaryCards />
            </section>
            <aside className={styles.left}>
                <LeftSidebar />
            </aside>
            <main className={styles.main}>
                <div className={styles.shopSection}>
                    <h2>My Shop Income</h2>
                    <ShopIncomeTable />
                </div>
                <div className={styles.dropSection}>
                    <h2>Dropshipping</h2>
                    <DropshippingTable />
                </div>
            </main>
            <aside className={styles.right}>
                <RightSidebar />
            </aside>
            <footer className={styles.bottom}>
                <BottomSummary />
            </footer>
        </div>
    );
};

export default IncomePage;
