// src/components/peoples/StaffHeader.tsx
import React from 'react';
import styles from './StaffHeader.module.css';
import { Users } from 'lucide-react'; // Optional: Lucide icon for visual flair

export default function StaffHeader() {
    return (
        <section className={styles.headerArea}>
            <div className={styles.iconTitle}>
                <Users className={styles.icon} />
                <h1 className={styles.title}>Staff Management</h1>
            </div>
            <p className={styles.subtitle}>View, add, and manage your team effectively.</p>
        </section>
    );
}
