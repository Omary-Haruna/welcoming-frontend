import React from 'react';
import { Settings } from '@mui/icons-material'; // Import the Material UI Settings icon
import styles from '../styles/Icon.module.css';

const SettingsIcon: React.FC = () => {
    return (
        <button className={styles.iconButton} aria-label="Settings">
            <Settings className={styles.icon} /> {/* Use the Settings icon from Material UI */}
        </button>
    );
};

export default SettingsIcon;
