import React, { useState, useEffect, useRef } from 'react';
import { FaEllipsisV } from 'react-icons/fa'; // Three-dot icon
import NotificationIcon from './NotificationIcon';
import SettingsIcon from './SettingsIcon';
import UserProfileIcon from './UserProfileIcon';
import ThemeToggle from './ThemeToggle';
import styles from '../styles/HeaderActions.module.css';

const HeaderActions: React.FC = () => {
    const [showActions, setShowActions] = useState(false);
    const actionsRef = useRef<HTMLDivElement>(null); // Reference for actions container
    const menuButtonRef = useRef<HTMLButtonElement>(null); // Reference for the menu button

    // Toggle the visibility of actions on small screens
    const toggleActions = () => {
        setShowActions(prev => !prev);
    };

    // Close the actions if the user clicks outside of the component
    const handleClickOutside = (event: MouseEvent) => {
        if (
            actionsRef.current && !actionsRef.current.contains(event.target as Node) &&
            menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)
        ) {
            setShowActions(false); // Hide the actions
        }
    };

    useEffect(() => {
        // Add event listener when the component mounts
        document.addEventListener('click', handleClickOutside);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.headerActionsWrapper}>
            {/* Three-dot menu button (only shown on small screens) */}
            <button
                className={styles.menuButton}
                onClick={toggleActions}
                aria-label="Toggle Actions"
                ref={menuButtonRef}
            >
                <FaEllipsisV />
            </button>

            {/* Actions: Show conditionally for small screens based on state, and always show on large screens */}
            <div
                className={`${styles.actions} ${showActions ? styles.show : ''}`}
                ref={actionsRef}
            >
                <ThemeToggle />
                <NotificationIcon />
                <SettingsIcon />
                <UserProfileIcon />
            </div>
        </div>
    );
};

export default HeaderActions;
