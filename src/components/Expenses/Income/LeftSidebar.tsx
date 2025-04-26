import React, { useState } from "react";
import Swal from "sweetalert2";
import { CheckCircle, XCircle, PlusCircle } from "lucide-react";
import styles from "./LeftSidebar.module.css";

type DropProduct = {
    id: string;
    name: string;
    takenFrom: string;
    givenPrice: number;
    status: "Pending" | "Sold" | "Failed";
    soldPrice?: number;
};

const LeftSidebar: React.FC = () => {
    const shopProducts = [
        { name: "Dell Inspiron 15", price: 750000 },
        { name: "HP Pavilion x360", price: 680000 },
    ];

    const [dropshippingProducts, setDropshippingProducts] = useState<DropProduct[]>([]);
    const [showTotals, setShowTotals] = useState(false);

    const handleStatusChange = (id: string, type: "success" | "fail") => {
        const updated = dropshippingProducts.map((p) => {
            if (p.id === id) {
                if (type === "success") {
                    Swal.fire({
                        title: "Enter Sold Price",
                        input: "number",
                        inputLabel: "Sold For (TZS)",
                        inputPlaceholder: "e.g. 150000",
                        showCancelButton: true,
                        confirmButtonText: "Save",
                        inputValidator: (value) => {
                            if (!value || isNaN(Number(value))) {
                                return "Enter a valid number";
                            }
                            return null;
                        },
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const soldPrice = Number(result.value);
                            setDropshippingProducts((prev) =>
                                prev.map((item) =>
                                    item.id === id
                                        ? {
                                            ...item,
                                            status: "Sold",
                                            soldPrice,
                                        }
                                        : item
                                )
                            );
                        }
                    });
                } else {
                    Swal.fire("Marked as Failed", "", "info");
                    return { ...p, status: "Failed" };
                }
            }
            return p;
        });
        setDropshippingProducts(updated);
    };

    const handleAddDropProduct = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Add Dropshipping Product",
            html:
                `<input id="product" class="swal2-input" placeholder="Product Taken">` +
                `<input id="from" class="swal2-input" placeholder="Taken From">` +
                `<input id="price" type="number" class="swal2-input" placeholder="Given Price (TZS)">`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Add",
            preConfirm: () => {
                const name = (document.getElementById("product") as HTMLInputElement).value;
                const from = (document.getElementById("from") as HTMLInputElement).value;
                const price = parseInt((document.getElementById("price") as HTMLInputElement).value);

                if (!name || !from || isNaN(price)) {
                    Swal.showValidationMessage("Please fill all fields correctly.");
                    return;
                }

                return { name, takenFrom: from, givenPrice: price };
            }
        });

        if (formValues) {
            const newProduct: DropProduct = {
                id: crypto.randomUUID(),
                name: formValues.name,
                takenFrom: formValues.takenFrom,
                givenPrice: formValues.givenPrice,
                status: "Pending",
            };

            setDropshippingProducts((prev) => [...prev, newProduct]);

            Swal.fire("Added!", `${formValues.name} added to dropshipping list.`, "success");
        }
    };

    const dropTotalCost = dropshippingProducts.reduce((sum, p) => sum + p.givenPrice, 0);
    const dropTotalProfit = dropshippingProducts.reduce((profit, p) => {
        if (p.status === "Sold" && p.soldPrice) {
            return profit + (p.soldPrice - p.givenPrice);
        }
        return profit;
    }, 0);

    return (
        <div className={styles.sidebarContainer}>
            <h3 className={styles.sectionTitle}>🛍️ Top Selling - My Shop</h3>
            <ul className={styles.productList}>
                {shopProducts.map((item, index) => (
                    <li key={index} className={styles.productItem}>
                        {item.name} <strong>{item.price.toLocaleString()} TZS</strong>
                    </li>
                ))}
            </ul>
            <p className={styles.total}>Total: {shopProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()} TZS</p>

            <h3 className={styles.sectionTitle}>🚚 Dropshipping</h3>
            <button onClick={handleAddDropProduct} className={styles.addButton}>
                <PlusCircle size={16} style={{ marginRight: 6 }} />
                Add New Product
            </button>

            {dropshippingProducts.length > 0 && (
                <div className={styles.tableWrapper}>
                    <table className={styles.dropTable}>
                        <thead>
                            <tr>
                                <th>Product Taken</th>
                                <th>Taken From</th>
                                <th>Given Price</th>
                                <th>Status</th>
                                <th>Action</th>
                                <th>Sold Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dropshippingProducts.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.takenFrom}</td>
                                    <td>{item.givenPrice.toLocaleString()} TZS</td>
                                    <td>
                                        <span
                                            className={
                                                item.status === "Sold"
                                                    ? styles.statusSold
                                                    : item.status === "Failed"
                                                        ? styles.statusFailed
                                                        : styles.statusPending
                                            }
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={styles.iconButton}
                                            onClick={() => handleStatusChange(item.id, "success")}
                                        >
                                            <CheckCircle size={18} strokeWidth={2} color="#28a745" />
                                        </button>
                                        <button
                                            className={styles.iconButton}
                                            onClick={() => handleStatusChange(item.id, "fail")}
                                        >
                                            <XCircle size={18} strokeWidth={2} color="#dc3545" />
                                        </button>
                                    </td>
                                    <td>
                                        {item.status === "Sold" && item.soldPrice
                                            ? `${item.soldPrice.toLocaleString()} TZS`
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {dropshippingProducts.length > 0 && (
                <button
                    onClick={() => setShowTotals((prev) => !prev)}
                    className={styles.toggleButton}
                >
                    {showTotals ? "🔽 Hide Totals" : "🔼 Show Totals"}
                </button>
            )}

            {showTotals && (
                <div className={styles.totalsBox}>
                    <p><strong>Total Cost:</strong> {dropTotalCost.toLocaleString()} TZS</p>
                    <p><strong>Total Profit:</strong> {dropTotalProfit.toLocaleString()} TZS</p>
                </div>
            )}
        </div>
    );
};

export default LeftSidebar;
