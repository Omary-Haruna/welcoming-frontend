import React from 'react';
import styles from '../styles/Main.module.css';
import TotalSales from './cards/TotalSales';
import Profits from './cards/Profits';
import RecentProducts from './cards/RecentProducts';
import OutOfStockOrders from './cards/OutOfStockOrders';
import LowStocks from './cards/LowStocks';
import PurchaseExpenses from './cards/PurchaseExpenses';
import StaticStats from './cards/StaticStats';
import BusinessOverview from './cards/BusinessOverview';
import IntroduceRole from './cards/IntroduceRole';

const Main: React.FC = () => {
    return (
        <main className={styles.main}>
            <div className={styles.gridContainer}>
                <IntroduceRole />
                <TotalSales />
                <Profits />
                <BusinessOverview />
                <LowStocks />
                <PurchaseExpenses />
                <RecentProducts />
                <OutOfStockOrders />
                <StaticStats />
            </div>
        </main>
    );
};

export default Main;
