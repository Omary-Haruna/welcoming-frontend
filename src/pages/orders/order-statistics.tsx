import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderStatistics from "../../components/order-statistics/OrderStatistics";

const OrderStatisticsPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("https://welcoming-backend.onrender.com/api/orders/recent");
                if (res.data.success) setOrders(res.data.orders);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Order Statistics</h1>
            <OrderStatistics orders={orders} />
        </div>
    );
};

export default OrderStatisticsPage;
