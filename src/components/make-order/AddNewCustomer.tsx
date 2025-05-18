import React, { useState } from 'react';
import Select from 'react-select';
import styles from './AddNewCustomer.module.css';
import { regionOptions } from '../../data/regionOptions';
import { regionDistricts } from '../../data/regionDistricts';
import { UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';

const AddNewCustomer = () => {
    const [region, setRegion] = useState<{ value: string; label: string } | null>(null);
    const [district, setDistrict] = useState<{ value: string; label: string } | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegionChange = (selected: any) => {
        setRegion(selected);
        setDistrict(null); // Reset district
    };

    const handleAddCustomer = async () => {
        if (!name || !region || !district || !phone) {
            Swal.fire('Missing Info', 'Please fill in all fields.', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: 'Add Customer?',
            html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Region:</strong> ${region.label}</p>
        <p><strong>District:</strong> ${district.label}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Add',
            cancelButtonText: 'No',
        });

        if (result.isConfirmed) {
            setLoading(true);

            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/customers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        region: region.value,
                        district: district.value,
                        phone,
                    }),
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    Swal.fire('Success', 'Customer successfully added!', 'success');
                    setName('');
                    setPhone('');
                    setRegion(null);
                    setDistrict(null);
                } else {
                    Swal.fire('Error', data.message || 'Something went wrong', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to connect to the server.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const districtOptions = region?.value
        ? regionDistricts[region.value]?.map((d) => ({ value: d, label: d })) || []
        : [];

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
                onChange={handleRegionChange}
                className={styles.select}
            />

            {region && (
                <Select
                    options={districtOptions}
                    placeholder="Select District"
                    value={district}
                    onChange={(selected) => setDistrict(selected)}
                    className={styles.select}
                />
            )}

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
