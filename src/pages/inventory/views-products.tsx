import styles from './view-products.module.css';
import HeaderOne from '../../components/inventories/ViewProducts/HeaderOne';
import MainPage from '../../components/inventories/ViewProducts/MainPage';

export default function ViewProducts() {
    return (
        <div className={styles.container}>
            <HeaderOne />

            <MainPage />
        </div>
    );
}
