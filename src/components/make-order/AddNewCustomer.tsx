import React, { useState } from 'react';
import Select from 'react-select';
import styles from './AddNewCustomer.module.css';
import { regionOptions } from '../../data/regionOptions';
import { UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';

const AddNewCustomer = () => {
    const [region, setRegion] = useState<{ value: string; label: string } | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddCustomer = async () => {
        if (!name || !region || !phone) {
            Swal.fire('Missing Info', 'Please fill in all fields.', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: 'Add Customer?',
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Region:</strong> ${region.label}</p>
                <p><strong>Phone:</strong> ${phone}</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Add',
            cancelButtonText: 'No',
        });

        if (result.isConfirmed) {
            setLoading(true);

            // Simulate saving (you can add fetch/axios here)
            setTimeout(() => {
                setLoading(false);
                Swal.fire('Success', 'Customer successfully added!', 'success');
                setName('');
                setRegion(null);
                setPhone('');
            }, 1000);
        }
    };

    return (
        <div className={styles.box} style={{ gridArea: 'addNewCustomer' }}>
            <h2>Add New Customer</h2>

            <input
                className={styles.input}
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <Select
                options={regionOptions}
                placeholder="Select Region"
                value={region}
                onChange={(selected) => setRegion(selected)}
                className={styles.select}
            />

            <input
                className={styles.input}
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <button className={styles.addBtn} onClick={handleAddCustomer} disabled={loading}>
                <UserPlus size={16} style={{ marginRight: '6px' }} />
                {loading ? 'Adding...' : 'Add'}
            </button>
        </div>
    );
};

export default AddNewCustomer;
