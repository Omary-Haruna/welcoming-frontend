import Image from 'next/image';
import React from 'react';
import styles from '../styles/Icon.module.css';

const UserProfileIcon: React.FC = () => {
    return (
        <button className={styles.iconButton} aria-label="User Profile">
            <Image
                src="/assets/images/avatars/avatar.png"
                alt="User Profile"
                width={40}
                height={40}
                className={styles.icon}
            />
        </button>
    );
};

export default UserProfileIcon;
