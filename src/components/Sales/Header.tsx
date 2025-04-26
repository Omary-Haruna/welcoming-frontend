import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const [dateTime, setDateTime] = useState<Date | null>(null);
    const username = 'John';

    useEffect(() => {
        setDateTime(new Date());
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Don't render time until component is mounted
    if (!dateTime) return null;

    const hour = dateTime.getHours();
    const greeting =
        hour < 12 ? 'Good Morning' :
            hour < 18 ? 'Good Afternoon' :
                'Good Evening';

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <h1 className={styles.welcome}>
                    {greeting}, <span className={styles.username}>{username}</span> 👋
                </h1>
                <p className={styles.subtitle}>Start your sales below</p>
            </div>
            <div className={styles.right}>
                <span className={styles.time}>
                    {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className={styles.date}>
                    {dateTime.toLocaleDateString()}
                </span>
            </div>
        </header>
    );
};

export default Header;
