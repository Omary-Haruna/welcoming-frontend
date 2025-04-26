import React from 'react';
import styles from './IntroduceRole.module.css';

const IntroduceRole: React.FC = () => {
    const currentHour = new Date().getHours();
    let greeting = '';

    if (currentHour < 12) {
        greeting = 'Good Morning';
    } else if (currentHour < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }

    return (
        <div className={styles.card}>
            <h2 className={styles.header}>{greeting}, Admin!</h2>
            <p className={styles.message}>Manage all aspects of your business with ease.</p>
        </div>
    );
};

export default IntroduceRole;
