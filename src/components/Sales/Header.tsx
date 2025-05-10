import React, { useEffect, useState, useContext } from 'react';
import styles from './Header.module.css';
import { AuthContext } from '../../context/AuthContext'; // Update path if needed

const Header: React.FC = () => {
    const [dateTime, setDateTime] = useState<Date | null>(null);
    const { user } = useContext(AuthContext);
    const username = user?.name || 'User';

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
