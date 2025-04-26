import React, { useEffect, useState } from 'react';
import styles from './Loader.module.css';

const messages = [
    "Hang tight, greatness is loading! 🚀",
    "Just a sec... magic’s happening ✨",
    "Your awesome content is on the way! 🧠",
    "Good things take time 😎",
    "Hold on... powering up! ⚡",
    "Patience, young padawan... 🧘‍♂️",
    "Loading joy and productivity 😄",
    "Summoning awesomeness... 🧙‍♂️",
];

export default function Loader() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, []);

    return (
        <div className={styles.loaderContainer}>
            <div className={styles.face}>😊</div>
            <p className={styles.message}>{message}</p>
        </div>
    );
}
