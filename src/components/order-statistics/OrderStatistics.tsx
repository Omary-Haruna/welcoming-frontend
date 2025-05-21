import React from "react";
import TotalOrdersCard from "./TotalOrdersCard";
import MostOrderedProducts from "./MostOrderedProducts";
import TotalSalesAmount from "./TotalSalesAmount";
import OrderStatusBreakdown from "./OrderStatusBreakdown";

const OrderStatistics = ({ orders }) => {
    return (
        <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
            <TotalOrdersCard orders={orders} />
            <TotalSalesAmount orders={orders} />
            <MostOrderedProducts orders={orders} />
            <OrderStatusBreakdown orders={orders} />
        </div>
    );
};

export default OrderStatistics;
