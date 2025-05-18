import React, { useEffect, useState } from "react";
import styles from "./SelectCustomer.module.css";

interface Customer {
    name: string;
    phone: string;
    region: string;
}

const SelectCustomer = ({ onChoose }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        fetch("https://welcoming-backend.onrender.com/api/sales/customers")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setCustomers(data.customers);
                    setFilteredCustomers(data.customers);
                }
            })
            .catch((err) => console.error("Error fetching customers:", err));
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = customers.filter(
            (c) =>
                c.name.toLowerCase().includes(term) ||
                c.region.toLowerCase().includes(term) ||
                c.phone.toLowerCase().includes(term)
        );
        setFilteredCustomers(filtered);
    }, [searchTerm, customers]);

    const handleChoose = () => {
        if (selectedIndex !== null) {
            const customer = filteredCustomers[selectedIndex];
            onChoose(customer);
            alert(`Customer selected: ${customer.name}`);
        }
    };

    return (
        <div className={styles.box} style={{ gridArea: "selectCustomer" }}>
            <h2>Select Customer</h2>

            <input
                type="text"
                placeholder="Search by name, region or phone..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedIndex(null); // clear selection on search
                }}
                className={styles.searchInput}
            />

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Region</th>
                            <th>Phone</th>
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer, index) => (
                            <tr
                                key={index}
                                className={
                                    selectedIndex === index ? styles.selectedRow : ""
                                }
                            >
                                <td>{index + 1}</td>
                                <td>{customer.name}</td>
                                <td>{customer.region}</td>
                                <td>{customer.phone}</td>
                                <td>
                                    <button
                                        className={styles.bigBoxBtn}
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        Select
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedIndex !== null && (
                <button onClick={handleChoose} className={styles.bigBoxBtn}>
                    I choose this customer
                </button>
            )}
        </div>
    );
};

export default SelectCustomer;
