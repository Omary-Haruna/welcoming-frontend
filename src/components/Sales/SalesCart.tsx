import React from 'react';
import { useCart } from '../../context/CartContext';
import styles from './SalesCart.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useSales } from '../../context/SalesContext';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';

const SalesCart: React.FC = () => {
    const { cart, clearCart, removeFromCart, updateQuantity } = useCart();
    const { addSummary } = useSales();

    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

    const handleCheckout = async () => {
        const result = await Swal.fire({
            title: 'Proceed to checkout?',
            text: `Total: $${totalAmount.toFixed(2)}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Checkout',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            const subtotal = totalAmount;
            const tax = 0;
            const total = subtotal;
            const soldAt = new Date().toISOString();

            addSummary({ subtotal, tax, total, items: cart, soldAt });
            clearCart();

            Swal.fire('Success!', 'Checkout completed.', 'success');
        }
    };

    return (
        <div className={styles.cart}>
            <h2 className={styles.title}>Sales Cart</h2>

            <AnimatePresence>
                {cart.length === 0 ? (
                    <motion.p
                        className={styles.empty}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        No items in the cart.
                    </motion.p>
                ) : (
                    <motion.div
                        className={styles.items}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {cart.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${index}`}
                                className={styles.item}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => removeFromCart(item.id)}
                                    title="Remove item"
                                >
                                    <X size={16} />
                                </button>

                                <img
                                    src={item.image}
                                    alt={item.name || 'Product'}
                                    className={styles.image}
                                />
                                <div className={styles.details}>
                                    <strong>{item.name}</strong>
                                    <div className={styles.qtyRow}>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity - 1)
                                            }
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p>Price: ${item.price.toFixed(2)}</p>
                                    <p>Total: ${item.total.toFixed(2)}</p>
                                </div>
                            </motion.div>
                        ))}

                        <div className={styles.cartFooter}>
                            <div className={styles.total}>Total: ${totalAmount.toFixed(2)}</div>
                            <button className={styles.checkoutBtn} onClick={handleCheckout}>
                                Checkout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SalesCart;
