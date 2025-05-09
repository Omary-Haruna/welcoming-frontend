import React from "react";
import styles from "../../components/make-order/MakeOrderLayout.module.css";
import SelectCustomer from "../../components/make-order/SelectCustomer";
import AddNewCustomer from "../../components/make-order/AddNewCustomer";
import ProductSelector from "../../components/make-order/ProductSelector";
import CartSummary from "../../components/make-order/CartSummary";
import PaymentDetails from "../../components/make-order/PaymentDetails";
import OrderNotes from "../../components/make-order/OrderNotes";
import SubmitOrder from "../../components/make-order/SubmitOrder";

const AddOrderPage = () => {
    return (
        <div className={styles.grid}>
            <SelectCustomer />
            <AddNewCustomer />
            <ProductSelector />
            <CartSummary />
            <PaymentDetails />
            <OrderNotes />
            <SubmitOrder />
        </div>
    );
};

export default AddOrderPage;
