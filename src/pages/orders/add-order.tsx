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

    // ✅ Load logged-in user (from localStorage or context)
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    // ✅ Fetch products + sales once on mount
    useEffect(() => {
        const getInitialData = async () => {
            try {
                const [productData, salesData] = await Promise.all([
                    fetchData("/api/products/all"),
                    fetchData("/api/sales/all"),
                ]);
                setProducts(productData.products);
                setSales(salesData.sales || salesData);
            } catch (error) {
                console.error("Failed to load data:", error);
            }
        };

        getInitialData();
    }, []);

    // ✅ Fetch recent orders from backend
    const fetchRecentOrders = async () => {
        try {
            const res = await fetchData("/api/orders/recent");
            setSubmittedOrders(res.orders || []);
        } catch (err) {
            console.error("Failed to fetch recent orders:", err);
        }
    };

    // ✅ Fetch recent orders once on page load
    useEffect(() => {
        fetchRecentOrders();
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
                clearCart={clearCart}
                user={loggedInUser} // ✅ Send logged-in user to CartSummary
                refreshOrders={fetchRecentOrders} // ✅ Refresh OrderSummary after submission
            />

            <OrderSummary orders={submittedOrders} />
        </div>
    );
};

export default AddOrderPage;
