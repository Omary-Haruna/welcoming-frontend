const TotalSalesAmount = ({ orders }) => {
    const total = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return (
        <div style={{ background: "#ecfdf5", padding: "1rem", borderRadius: "8px" }}>
            <h3>Total Sales Amount</h3>
            <p style={{ fontSize: "1.5rem" }}>{total.toLocaleString()} TZS</p>
        </div>
    );
};

export default TotalSalesAmount;
