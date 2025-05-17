import React, { useEffect, useState } from "react";
import styles from "../../components/make-order/MakeOrderLayout.module.css";
import SelectCustomer from "../../components/make-order/SelectCustomer";
import AddNewCustomer from "../../components/make-order/AddNewCustomer";
import ProductSelector from "../../components/make-order/ProductSelector";
import CartSummary from "../../components/make-order/CartSummary";
import PaymentDetails from "../../components/make-order/PaymentDetails";
import OrderNotes from "../../components/make-order/OrderNotes";
import SubmitOrder from "../../components/make-order/SubmitOrder";
import { fetchData } from "../../utils/api";

const AddOrderPage = () => {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const [productData, salesData] = await Promise.all([
                    fetchData('/api/products/all'),
                    fetchData('/api/sales/all'),
                ]);

                // ✅ Destructure array from backend response
                setProducts(productData.products); // not the whole object
                setSales(salesData.sales || salesData); // fallback if sales is not nested
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setLoading(false);
            }
        };

        getInitialData();
    }, []);

    if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;

    return (
        <div className={styles.grid}>
            <SelectCustomer />
            <AddNewCustomer />
            <ProductSelector products={products} />
            <CartSummary />
            <PaymentDetails />
            <OrderNotes />
            <SubmitOrder sales={sales} />
        </div>
    );
};

export default AddOrderPage;
