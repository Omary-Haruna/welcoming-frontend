const MostOrderedProducts = ({ orders }) => {
    const productCount = {};

    orders.forEach(order => {
        order.products?.forEach(product => {
            productCount[product.name] = (productCount[product.name] || 0) + product.quantity;
        });
    });

    const sortedProducts = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return (
        <div style={{ background: "#fff7ed", padding: "1rem", borderRadius: "8px" }}>
            <h3>Most Ordered Products</h3>
            <ul>
                {sortedProducts.map(([name, count], index) => (
                    <li key={index}>{name} — {count} pcs</li>
                ))}
            </ul>
        </div>
    );
};

export default MostOrderedProducts;
