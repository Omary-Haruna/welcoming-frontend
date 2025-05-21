import React, { useState } from "react";
import styles from "./OrderSummary.module.css";
import {
    PackageCheck,
    Clock10,
    UserCircle,
    MapPin,
    Truck,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"; // ✅ Next.js client-side routing

const OrderSummary = ({ orders }) => {
    if (!orders || orders.length === 0) {
        return (
            <div className={styles.box} style={{ gridArea: "orderSummary" }}>
                <h2>Order Summary</h2>
                <p>No submitted orders yet.</p>
            </div>
        );
    }

    const now = new Date();
    const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(
        (order) => new Date(order.orderDate) >= past24Hours
    );

    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };

    return (
        <div className={styles.box} style={{ gridArea: "orderSummary" }}>
            <h2>Recent Orders (Last 24 hrs)</h2>

            {recentOrders.length === 0 ? (
                <p>No recent orders in the past 24 hours.</p>
            ) : (
                <ul className={styles.orderList}>
                    {recentOrders.map((order, index) => {
                        const isExpanded = expandedIndex === index;
                        return (
                            <li
                                key={index}
                                className={styles.orderCard}
                                onClick={() => toggleExpand(index)}
                            >
                                <div className={styles.orderHeader}>
                                    <UserCircle size={18} />
                                    <strong>
                                        This is {order.customerName}'s order that goes to{" "}
                                        {order.toRegion} Region, {order.toDistrict} District
                                    </strong>
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            className={styles.orderBody}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p>
                                                <PackageCheck size={14} /> <strong>Order ID:</strong>{" "}
                                                {order.orderId}
                                            </p>
                                            <p>
                                                <Clock10 size={14} /> <strong>Status:</strong>{" "}
                                                <span className={styles.status}>{order.orderStatus}</span>
                                            </p>
                                            <p>
                                                <MapPin size={14} /> <strong>From:</strong>{" "}
                                                {order.fromRegion}
                                            </p>
                                            <p>
                                                <Truck size={14} /> <strong>To:</strong> {order.toRegion},{" "}
                                                {order.toDistrict}
                                            </p>
                                            <p>
                                                <strong>Expected Arrival:</strong>{" "}
                                                {order.expectedArrival || "N/A"}
                                            </p>
                                            <p>
                                                <strong>Parcel Given To:</strong>{" "}
                                                {order.parcelGivenTo || "N/A"}
                                            </p>
                                            <p>
                                                <strong>Created By:</strong>{" "}
                                                {order.createdBy || "Unknown"}
                                            </p>
                                            <p>
                                                <strong>Total Items:</strong>{" "}
                                                {order.products?.length || 0}
                                            </p>
                                            <p>
                                                <strong>Total:</strong>{" "}
                                                {Number(order.totalAmount || 0).toLocaleString()} TZS
                                            </p>

                                            {order.products?.length > 0 && (
                                                <ul className={styles.productList}>
                                                    {order.products.map((product, idx) => (
                                                        <li key={idx} className={styles.productItem}>
                                                            - {product.name} (x{product.quantity})
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* ✅ Bottom Link */}
            {recentOrders.length > 0 && (
                <div className={styles.linkContainer}>
                    <Link href="/orders/view-orders" className={styles.viewAllLink}>
                        👉 Click here to see all orders
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OrderSummary;
