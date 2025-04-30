import React, { useEffect, useState } from 'react';
import styles from '../../styles//PendingCartsPage.module.css';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface PendingCartItem {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    image: string;
}

const PendingCartsPage: React.FC = () => {
    const [pendingCarts, setPendingCarts] = useState<PendingCartItem[]>([]);

    const fetchPendingCarts = async () => {
        try {
            const res = await fetch('https://welcoming-backend.onrender.com/api/pending-cart/all');
            const data = await res.json();
            if (data.success) {
                setPendingCarts(data.carts);
            }
        } catch (err) {
            console.error('Error fetching pending carts:', err);
        }
    };

    const handleDelete = async (id: string) => {
        const confirm = await Swal.fire({
            title: 'Delete Cart Item?',
            text: 'Are you sure you want to delete this pending item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
        });

        if (confirm.isConfirmed) {
            try {
                await fetch(`https://welcoming-backend.onrender.com/api/pending-cart/item/${id}`, {
                    method: 'DELETE',
                });
                setPendingCarts(pendingCarts.filter(item => item._id !== id));
                Swal.fire('Deleted!', 'Pending item removed.', 'success');
            } catch (err) {
                console.error('Delete failed:', err);
            }
        }
    };

    useEffect(() => {
        fetchPendingCarts();
    }, []);

    return (
        <div className={styles.container}>
            <h1>Pending Carts</h1>
            {pendingCarts.length === 0 ? (
                <p>No pending carts found.</p>
            ) : (
                <div className={styles.grid}>
                    {pendingCarts.map((item) => (
                        <div key={item._id} className={styles.card}>
                            <img src={item.image} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>Qty: {item.quantity}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <p>Total: ${item.total.toFixed(2)}</p>
                            <button onClick={() => handleDelete(item._id)}>
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingCartsPage;
