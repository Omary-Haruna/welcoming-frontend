import React, { useState } from "react";
import styles from "./CartSummary.module.css";
import { X, PackagePlus } from "lucide-react";
import OrderModal from "./OrderModal";
import axios from "axios";

const CartSummary = ({ customer, cart, onRemoveItem, clearCart, user, refreshOrders }) => {
    const [showModal, setShowModal] = useState(false);

    const totalAmount = cart?.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );

    const customerInfo = customer
        ? `${customer.name} from ${customer.region}${customer.district ? ` (${customer.district})` : ""}`
        : "";

    const handleOrderSubmit = async (detailsFromModal) => {
        try {
            const orderData = {
                customer: {
                    ...customer,
                    expectedArrival: detailsFromModal.expectedArrival,
                    parcelGivenTo: detailsFromModal.parcelGivenTo || null,
                    fromRegion: detailsFromModal.fromRegion,
                    toRegion: detailsFromModal.toRegion,
                    toDistrict: detailsFromModal.toDistrict,
                },
                cart,
                totalAmount,
                createdBy: user?.name || user?.email || "Unknown"
            };

            const response = await axios.post(
                "https://welcoming-backend.onrender.com/api/orders/create",
                orderData
            );

            if (response.data.success) {
                clearCart();
                setShowModal(false);
                alert("✅ Order submitted successfully!");
                if (refreshOrders) {
                    refreshOrders(); // ✅ Refresh OrderSummary
                }
            } else {
                alert("❌ Failed to submit order.");
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("❌ Something went wrong while submitting the order.");
        }
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
                                        <p>Subtotal: {Number(item.quantity * item.price).toLocaleString()} TZS</p>
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
                onSubmitOrder={handleOrderSubmit}
                customer={customer}
            />
        </div>
    );
};

export default CartSummary;
