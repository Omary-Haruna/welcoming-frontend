import { useEffect, useState } from 'react';
import styles from './view-products.module.css';
import HeaderOne from '../../components/inventories/ViewProducts/HeaderOne';
import MainPage from '../../components/inventories/ViewProducts/MainPage';

interface Product {
    _id: string;
    name: string;
    category: string;
    buyingPrice: number;
    sellingPrice: number;
    quantity: number;
    image: string;
    images?: string[];
}

export default function ViewProducts() {
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('https://welcoming-backend.onrender.com/api/products/all');
            const data = await res.json();
            setProducts(data.products); // Assuming your backend sends { products: [] }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className={styles.container}>
            <HeaderOne />

            <MainPage products={products} />
        </div>
    );
}
