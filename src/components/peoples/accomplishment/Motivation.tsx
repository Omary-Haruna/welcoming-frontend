// Motivation.tsx
import React from 'react';
import styles from './motivation.module.css';
import { FaTrophy } from 'react-icons/fa';

const quote = "Success is the sum of small efforts, repeated day in and day out.";

const Motivation = () => {
    const words = quote.split(" ");

    return (
        <div className={styles.motivationContainer}>
            <div className={styles.iconWrapper}>
                <FaTrophy className={styles.rotatingIcon} />
            </div>
            <h1 className={styles.quote}>
                {words.map((word, index) => (
                    <span
                        key={index}
                        className={styles.danceWord}
                        style={{ animationDelay: `${index * 0.15}s` }}
                    >
                        {word}&nbsp;
                    </span>
                ))}
            </h1>
        </div>
    );
};

export default Motivation;
