// ✅ CartSummary.tsx
import React, { useState } from "react";
import styles from "./CartSummary.module.css";
import { X, PackagePlus } from "lucide-react";
import OrderModal from "./OrderModal";

const CartSummary = ({ customer, cart, onRemoveItem, onSubmitOrder, clearCart }) => {
    const [showModal, setShowModal] = useState(false);

    const totalAmount = cart?.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );

    const customerInfo = customer
        ? `${customer.name} from ${customer.region}${customer.district ? ` (${customer.district})` : ""}`
        : "";

    const handleOrderSubmit = (orderData) => {
        onSubmitOrder(orderData);
        clearCart();
        setShowModal(false);
        alert("✅ Order submitted successfully!");
    };

    return (
        <div className={styles.box} style={{ gridArea: "cartSummary" }}>
            <h2>Cart Summary</h2>

            {customer ? (
                cart && cart.length > 0 ? (
                    <>
                        <p className={styles.customerMessage}>
                            <strong>{customerInfo}</strong> has ordered:
                        </p>
                        <ul className={styles.productList}>
                            {cart.map((item, idx) => (
                                <li key={idx} className={styles.productItem}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={styles.image}
                                    />
                                    <div className={styles.details}>
                                        <p className={styles.name}>
                                            <strong>{item.name}</strong>
                                        </p>
                                        <p>Qty: {item.quantity}</p>
                                        <p>Price: {Number(item.price).toLocaleString()} TZS</p>
                                        <p>
                                            Subtotal: {Number(item.quantity * item.price).toLocaleString()} TZS
                                        </p>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => onRemoveItem(item)}
                                    >
                                        <X size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.total}>
                            Total: <strong>{totalAmount.toLocaleString()} TZS</strong>
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className={styles.createBtn}
                        >
                            <PackagePlus size={16} style={{ marginRight: "6px" }} />
                            Create Order
                        </button>
                    </>
                ) : (
                    <p className={styles.customerMessage}>
                        <strong>{customerInfo}</strong> has not selected any products yet.
                    </p>
                )
            ) : (
                <p className={styles.customerMessage}>No customer selected.</p>
            )}

            <OrderModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                customer={{ ...customer, cart }}
                onSubmitOrder={handleOrderSubmit}
            />
        </div>
    );
};

export default CartSummary;
