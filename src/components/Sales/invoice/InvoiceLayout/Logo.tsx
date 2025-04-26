import React from 'react';
import styles from './Logo.module.css';
import { Building2, Smartphone, MapPin } from 'lucide-react';

export default function Logo() {
    return (
        <div className={styles.logoContainer}>
            <div className={styles.logoText}>
                <h1>Welcoming Technology</h1>
                <p className={styles.tagline}>Technology & Accessories Store</p>
            </div>
            <div className={styles.contactInfo}>
                <span className={styles.infoItem}><Building2 size={18} /> Dar es Salaam, Tanzania</span>
                <span className={styles.infoItem}><Smartphone size={18} /> +255 789 123 456</span>
                <span className={styles.infoItem}><MapPin size={18} /> www.welcomingtech.co.tz</span>
            </div>
        </div>
    );
}
