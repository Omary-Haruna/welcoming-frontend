import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { UserRound, Clock, Calendar, FileText } from 'lucide-react';

const Header: React.FC = () => {
    const [dateTime, setDateTime] = useState<Date | null>(null);
    const username = 'John'; // You can make this dynamic if needed

    useEffect(() => {
        setDateTime(new Date());
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!dateTime) return null;

    const hour = dateTime.getHours();
    const greeting =
        hour < 12 ? 'Good Morning' :
            hour < 18 ? 'Good Afternoon' :
                'Good Evening';

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <h1 className={styles.greeting}>
                    <UserRound size={20} /> {greeting}, <span className={styles.username}>{username}</span> 👋
                </h1>
                <p className={styles.subtitle}>
                    <FileText size={18} /> This is the invoice page
                </p>
            </div>
            <div className={styles.right}>
                <p className={styles.time}>
                    <Clock size={16} /> {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className={styles.date}>
                    <Calendar size={16} /> {dateTime.toLocaleDateString()}
                </p>
            </div>
        </header>
    );
};

export default Header;
