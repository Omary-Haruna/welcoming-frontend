import React from 'react';
import { Notifications } from '@mui/icons-material'; // Import the Material UI Notifications icon
import styles from '../styles/Icon.module.css';

const NotificationIcon: React.FC = () => {
    return (
        <button className={styles.iconButton} aria-label="Notifications">
            <Notifications className={styles.icon} />
        </button>
    );
};

export default NotificationIcon;
