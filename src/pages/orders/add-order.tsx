import React, { useEffect, useState } from "react";
import styles from "../../components/make-order/MakeOrderLayout.module.css";
import SelectCustomer from "../../components/make-order/SelectCustomer";
import AddNewCustomer from "../../components/make-order/AddNewCustomer";
import ProductSelector from "../../components/make-order/ProductSelector";
import CartSummary from "../../components/make-order/CartSummary";
import OrderSummary from "../../components/make-order/OrderSummary";
import { fetchData } from "../../utils/api";

const AddOrderPage = () => {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cartItems, setCartItems] = useState([]); // ⛔ no mock data

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const [productData, salesData] = await Promise.all([
                    fetchData('/api/products/all'),
                    fetchData('/api/sales/all'),
                ]);
                setProducts(productData.products);
                setSales(salesData.sales || salesData);
            } catch (error) {
                console.error("Failed to load data:", error);
            }
        };

        getInitialData();
    }, []);

    // ✅ Add to cart
    const handleAddToCart = (product) => {
        setCartItems((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === product._id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    // ✅ Remove from cart
    const handleRemoveItem = (itemToRemove) => {
        setCartItems((prev) =>
            prev.filter((item) => item._id !== itemToRemove._id)
        );
    };

    return (
        <div className={styles.grid}>
            <SelectCustomer onChoose={setSelectedCustomer} />
            <AddNewCustomer />
            <ProductSelector products={products} onAddToCart={handleAddToCart} />
            <CartSummary customer={selectedCustomer} cart={cartItems} onRemoveItem={handleRemoveItem} />
            <OrderSummary orders={sales} />
        </div>
    );
};

export default AddOrderPage;
