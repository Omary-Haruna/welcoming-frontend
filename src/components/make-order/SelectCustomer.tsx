import React, { useEffect, useState } from "react";
import Select from "react-select";
import styles from "./SelectCustomer.module.css";

interface Customer {
    name: string;
    phone: string;
    region: string;
}

const SelectCustomer = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    useEffect(() => {
        fetch("https://welcoming-backend.onrender.com/api/sales/customers")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setCustomers(data.customers);
                }
            })
            .catch((err) => console.error("Error fetching customers:", err));
    }, []);

    const options = customers.map((customer) => ({
        value: customer.name,
        label: `${customer.name} (${customer.region} - ${customer.phone})`,
        ...customer
    }));

    return (
        <div className={styles.box} style={{ gridArea: "selectCustomer" }}>
            <h2>Select Customer</h2>
            <Select
                options={options}
                value={selectedCustomer}
                onChange={setSelectedCustomer}
                placeholder="Search and select a customer"
                isSearchable
                className={styles.select}
            />
        </div>
    );
};

export default SelectCustomer;
