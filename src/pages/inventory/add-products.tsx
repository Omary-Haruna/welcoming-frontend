import { useState } from 'react';
import styles from '../../styles/add-products.module.css';
import LeftSide from '../../components/inventories/AddProduct/LeftSide';
import RightSide from '../../components/inventories/AddProduct/RightSide';

export default function AddProducts() {
    const [products, setProducts] = useState<any[]>([]);

    // ✅ Edit Handler
    const handleEdit = (index: number) => {
        const product = products[index];
        console.log("📝 Edit product:", product);
        // You can show an edit modal or inline form here
        alert(`Edit product: ${product.name}`);
    };

    // ✅ Delete Handler
    const handleDelete = (index: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            const updated = [...products];
            updated.splice(index, 1);
            setProducts(updated);
        }
    };

    // ✅ Upload Image Handler
    const handleUploadImage = (index: number, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                const updated = [...products];
                updated[index].image = reader.result as string;
                updated[index].images = [reader.result as string]; // optional for multiple
                setProducts(updated);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <LeftSide setProducts={setProducts} />
            </div>
            <div className={styles.right}>
                <RightSide
                    products={products}
                    onEdit={(updatedProducts) => setProducts(updatedProducts)}
                    onDelete={(index) => {
                        const updated = [...products];
                        updated.splice(index, 1);
                        setProducts(updated);
                    }}
                    onUploadImage={(index, file) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            if (reader.result) {
                                const updated = [...products];
                                updated[index].image = reader.result as string;
                                updated[index].images = [reader.result as string];
                                setProducts(updated);
                            }
                        };
                        reader.readAsDataURL(file);
                    }}
                />

            </div>
        </div>
    );
}
