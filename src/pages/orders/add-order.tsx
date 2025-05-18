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
    const [cartItems, setCartItems] = useState([]);
    const [submittedOrders, setSubmittedOrders] = useState([]);

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

    const handleRemoveItem = (itemToRemove) => {
        setCartItems((prev) =>
            prev.filter((item) => item._id !== itemToRemove._id)
        );
    };

    const clearCart = () => setCartItems([]);

    return (
        <div className={styles.grid}>
            <SelectCustomer onChoose={setSelectedCustomer} />
            <AddNewCustomer />
            <ProductSelector products={products} onAddToCart={handleAddToCart} />
            <CartSummary
                customer={selectedCustomer}
                cart={cartItems}
                onRemoveItem={handleRemoveItem}
                onSubmitOrder={(newOrder) => setSubmittedOrders((prev) => [...prev, newOrder])}
                clearCart={clearCart}
            />
            <OrderSummary orders={submittedOrders} />
        </div>
    );
};

export default AddOrderPage;
