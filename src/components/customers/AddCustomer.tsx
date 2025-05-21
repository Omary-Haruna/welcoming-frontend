import React, { useState } from 'react';
import styles from './AddCustomer.module.css';
import { regionOptions } from '../../data/regionOptions';
import { regionDistricts } from '../../data/regionDistricts';
import Select from 'react-select';
import { toast } from 'react-toastify';

export default function AddCustomer({ onAdd }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [region, setRegion] = useState(null);
    const [district, setDistrict] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !phone || !region || !district) {
            toast.warn('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('https://welcoming-backend.onrender.com/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone,
                    region: region.value,
                    district: district.value
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Customer added successfully ✅');
                setName('');
                setPhone('');
                setRegion(null);
                setDistrict(null);
                onAdd?.();
            } else {
                toast.error(data.message || 'Failed to add customer');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const districtOptions = region ? (regionDistricts[region.value] || []).map(d => ({ label: d, value: d })) : [];

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3>Add New Customer</h3>
            <input
                className={styles.input}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Select
                className={styles.select}
                placeholder="Select Region"
                options={regionOptions}
                value={region}
                onChange={(selected) => setRegion(selected)}
            />
            {region && (
                <Select
                    className={styles.select}
                    placeholder="Select District"
                    options={districtOptions}
                    value={district}
                    onChange={(selected) => setDistrict(selected)}
                />
            )}
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Add Customer'}
            </button>
        </form>
    );
}