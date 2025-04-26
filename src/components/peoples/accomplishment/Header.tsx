import React from 'react';
import { Transition } from '@headlessui/react';
import styles from './Header.module.css'; // Assuming you’ll map Tailwind-like styles in here

const Header = () => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        else if (hour < 18) return 'Good afternoon';
        else return 'Good evening';
    };

    const userName = 'Alex'; // Replace with actual user data

    return (
        <Transition
            appear
            show={true}
            enter="transition ease-out duration-700"
            enterFrom="opacity-0 translate-y-5"
            enterTo="opacity-100 translate-y-0"
        >
            <header className={styles.headerContainer}>
                <div className={styles.textGroup}>
                    <p className={styles.greeting}>
                        {getGreeting()}, <span className={styles.userName}>{userName}</span> 👋
                    </p>
                    <h1 className={styles.pageTitle}>Staff Accomplishment Page</h1>
                </div>
            </header>
        </Transition>
    );
};

export default Header;
