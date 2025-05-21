const TotalOrdersCard = ({ orders }) => {
    return (
        <div style={{ background: "#f3f4f6", padding: "1rem", borderRadius: "8px" }}>
            <h3>Total Orders</h3>
            <p style={{ fontSize: "1.5rem" }}>{orders.length}</p>
        </div>
    );
};

export default TotalOrdersCard;
