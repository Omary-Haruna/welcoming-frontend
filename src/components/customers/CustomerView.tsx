import React, { useEffect, useState } from 'react';
import CustomerTable from './CustomerTable'; // Adjust path if needed

interface Product {
    name: string;
    price: number;
}

interface Customer {
    id: string;
    name: string;
    phone: string;
    region: string;
    productBought: string; // formatted text for display
    price: number;         // total price
    joinedDate: string;
    returning: boolean;
}

const CustomerView: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/sales/customers');
                const data = await res.json();

                if (data.success && Array.isArray(data.customers)) {
                    const enhanced: Customer[] = data.customers.map((c, index) => {
                        const productsFormatted = c.products?.map(
                            (p: Product) => `${p.name} (TSh ${p.price.toLocaleString()})`
                        );

                        const totalSpent = c.products?.reduce(
                            (sum: number, p: Product) => sum + p.price,
                            0
                        ) || 0;

                        return {
                            id: index.toString(),
                            name: c.name,
                            phone: c.phone,
                            region: c.region || 'Unknown',
                            productBought: productsFormatted?.join('\n') || '—',
                            price: totalSpent,
                            joinedDate: c.joinedDate || 'Unknown',
                            returning: c.returning || false,
                        };
                    });

                    setCustomers(enhanced);
                }
            } catch (err) {
                console.error('❌ Failed to fetch customers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) return <p>Loading...</p>;

    return <CustomerTable customers={customers} />;
};

export default CustomerView;
