import React, { useEffect, useState } from 'react';
import CustomerHeader from '../../components/customers/Header';
import Filter from '../../components/customers/Filter';
import CustomerCards from '../../components/customers/CustomerCards';
import CustomerSearchAndFilter from '../../components/customers/CustomerSearchAndFilter';
import CustomerTable from '../../components/customers/CustomerTable';

export default function CustomerManagementPage() {
    const [allCustomers, setAllCustomers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({});

    const [visibleCards, setVisibleCards] = useState([
        'GeneralStatsCard',
        'PurchaseBehaviorCard',
        'TimeBasedStatsCard',
    ]);

    // 🔁 Fetch customers (can be reused on add)
    const fetchCustomers = async () => {
        try {
            const res = await fetch('https://welcoming-backend.onrender.com/api/sales/customers');
            const data = await res.json();

            if (data.success && Array.isArray(data.customers)) {
                const enhanced = data.customers.map((c, index) => ({
                    ...c,
                    id: index.toString()
                }));

                setAllCustomers(enhanced);
                setCustomers(enhanced);
            }
        } catch (error) {
            console.error('❌ Failed to fetch customers:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const applyFilters = (filters) => {
        let filtered = allCustomers;

        if (filters.name) {
            filtered = filtered.filter((c) =>
                c.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        if (filters.productBought) {
            filtered = filtered.filter((c) => c.productBought === filters.productBought);
        }

        if (filters.price) {
            filtered = filtered.filter((c) => c.price >= filters.price);
        }

        if (filters.region) {
            filtered = filtered.filter((c) => c.region === filters.region);
        }

        if (filters.joinedDate) {
            filtered = filtered.filter((c) => c.joinedDate === filters.joinedDate);
        }

        if (filters.returning) {
            filtered = filtered.filter((c) => c.returning === true);
        }

        setCustomers(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    return (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CustomerHeader />
            <Filter visibleCards={visibleCards} setVisibleCards={setVisibleCards} />
            <CustomerCards visibleCards={visibleCards} customers={customers} onAddCustomer={fetchCustomers} />
            <CustomerSearchAndFilter filters={filters} onChange={handleFilterChange} />
            <CustomerTable customers={customers} />
        </div>
    );
}
