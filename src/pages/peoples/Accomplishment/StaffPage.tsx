// src/pages/staff/StaffPage.tsx
import React, { useState } from 'react';
import styles from '../../../styles/StaffPage.module.css';

import AddStaffForm from '../../../components/peoples/AddStaffForm';
import StaffTable from '../../../components/peoples/StaffTable';
import StaffHeader from '../../../components/peoples/StaffHeader';

export default function StaffPage() {
    const [staffList, setStaffList] = useState([]);

    const handleAddStaff = (staffData: any) => {
        const newStaff = {
            id: Date.now(),
            avatar: '👤',
            outcome: staffData.outcome || 'success',
            status: staffData.status || 'active',
            tasks: staffData.tasks || 'No task recorded',
            ...staffData,
        };
        setStaffList(prev => [...prev, newStaff]);
    };

    return (
        <div className={styles.container}>
            <StaffHeader />

            <section className={styles.gridArea}>
                <div className={styles.leftPanel}>
                    <AddStaffForm onAddStaff={handleAddStaff} />
                </div>

                <div className={styles.rightPanel}>
                    <StaffTable staffList={staffList} />
                </div>
            </section>
        </div>
    );
}
