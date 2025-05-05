import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import styles from './SalesCart.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const SalesCart: React.FC = () => {
    const { cart, clearCart, removeFromCart, updateQuantity, setCart } = useCart();

    const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

    useEffect(() => {
        const loadPendingCart = async () => {
            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/pending-cart');
                const data = await res.json();
                if (data.success && data.cart.length > 0) {
                    setCart(data.cart);
                }
            } catch (err) {
                console.error('Failed to fetch pending cart:', err);
            }
        };

        loadPendingCart();
    }, [setCart]);

    useEffect(() => {
        const savePendingCart = async () => {
            try {
                await fetch('https://welcoming-backend.onrender.com/api/pending-cart/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart }),
                });
            } catch (err) {
                console.error('Failed to save cart:', err);
            }
        };

        if (cart.length > 0) {
            savePendingCart();
        }
    }, [cart]);

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
            const saleData = {
                soldAt: new Date().toISOString(),
                subtotal: totalAmount,
                total: totalAmount,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    total: item.quantity * item.price,
                })),
            };

            // ✅ Merge duplicate products before reducing quantity
            const mergedItems = cart.reduce((acc, item) => {
                const existing = acc.find(p => p.productId === item.id);
                if (existing) {
                    existing.quantitySold += item.quantity;
                } else {
                    acc.push({ productId: item.id, quantitySold: item.quantity });
                }
                return acc;
            }, [] as { productId: string; quantitySold: number }[]);

            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/sales/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(saleData),
                });

                const data = await res.json();

                if (data.success) {
                    await fetch('https://welcoming-backend.onrender.com/api/products/reduce-quantity', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: mergedItems }),
                    });

                    toast.success('Checkout completed! ✅');
                    clearCart();

                    await fetch('https://welcoming-backend.onrender.com/api/pending-cart/clear', {
                        method: 'DELETE',
                    });

                    window.location.reload();
                } else {
                    toast.error('Failed to record sale.');
                }
            } catch (err) {
                console.error('Checkout failed:', err);
                toast.error('Server error during checkout.');
            }
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
                        {cart.map((item, index) => {
                            const itemTotal = item.quantity * item.price;
                            return (
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

                                    <img src={item.image} alt={item.name} className={styles.image} />
                                    <div className={styles.details}>
                                        <strong>{item.name}</strong>
                                        <div className={styles.qtyRow}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <p>Price: ${item.price.toFixed(2)}</p>
                                        <p>Total: ${itemTotal.toFixed(2)}</p>
                                    </div>
                                </motion.div>
                            );
                        })}

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
