import styles from './HeaderOne.module.css';
import { Box } from 'lucide-react';

export default function HeaderOne() {
    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className={styles.header}>
            <div className={styles.titleGroup}>
                <Box size={28} className={styles.icon} />
                <h1 className={styles.title}>View Products</h1>
            </div>
            <div className={styles.meta}>
                <span>Hello, Admin 👋</span>
                <span>{today}</span>
            </div>
        </div>
    );
}
