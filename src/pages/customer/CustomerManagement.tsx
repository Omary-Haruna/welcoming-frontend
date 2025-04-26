import React, { useEffect, useState } from 'react';
import { generateCustomers } from '../../utils/CustomerData';
import CustomerHeader from '../../components/customers/Header';
import Filter from '../../components/customers/Filter';
import CustomerCards from '../../components/customers/CustomerCards';
import CustomerSearchAndFilter from '../../components/customers/CustomerSearchAndFilter';
import CustomerTable from '../../components/customers/CustomerTable';

export default function CustomerManagementPage() {
    const [allCustomers, setAllCustomers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({});

    // ✅ Show only the first 3 cards by default
    const [visibleCards, setVisibleCards] = useState([
        'GeneralStatsCard',
        'PurchaseBehaviorCard',
        'TimeBasedStatsCard',
    ]);

    useEffect(() => {
        const generated = generateCustomers(234); // You can adjust this number
        setAllCustomers(generated);
        setCustomers(generated);
    }, []);

    const applyFilters = (filters) => {
        let filtered = allCustomers;

        if (filters.name) {
            filtered = filtered.filter((c) =>
                c.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        if (filters.gender) {
            filtered = filtered.filter((c) => c.gender === filters.gender);
        }

        if (filters.productBought) {
            filtered = filtered.filter((c) => c.productBought === filters.productBought);
        }

        if (filters.quantity) {
            filtered = filtered.filter((c) => c.quantity >= filters.quantity);
        }

        if (filters.price) {
            filtered = filtered.filter((c) => c.price >= filters.price);
        }

        if (filters.frequency) {
            filtered = filtered.filter((c) => c.frequency >= filters.frequency);
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

        if (filters.process) {
            filtered = filtered.filter((c) => c.process === filters.process);
        }

        if (filters.paymentMethod) {
            filtered = filtered.filter((c) => c.paymentMethod === filters.paymentMethod);
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
            <CustomerCards visibleCards={visibleCards} customers={customers} />
            <CustomerSearchAndFilter filters={filters} onChange={handleFilterChange} />
            <CustomerTable customers={customers} />
        </div>
    );
}
