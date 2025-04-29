import { useEffect, useState } from 'react';
import LeftSide from '../../components/inventories/AddProduct/LeftSide';
import RightSide from '../../components/inventories/AddProduct/RightSide';
import styles from '../../styles/add-products.module.css';

export default function AddProducts() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('https://welcoming-backend.onrender.com/api/products/all');
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (err) {
            console.error('Failed to load products:', err);
        }
    };

    useEffect(() => {
        fetchProducts(); // Load at first
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <LeftSide fetchProducts={fetchProducts} />
            </div>
            <div className={styles.right}>
                <RightSide products={products} fetchProducts={fetchProducts} />
            </div>
        </div>
    );
}
