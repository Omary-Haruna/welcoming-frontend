const OrderStatusBreakdown = ({ orders }) => {
    const statusCount = orders.reduce((acc, order) => {
        const status = order.orderStatus || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div style={{ background: "#eef2ff", padding: "1rem", borderRadius: "8px" }}>
            <h3>Order Status Breakdown</h3>
            <ul>
                {Object.entries(statusCount).map(([status, count]) => (
                    <li key={status}>{status}: {count}</li>
                ))}
            </ul>
        </div>
    );
};

export default OrderStatusBreakdown;
