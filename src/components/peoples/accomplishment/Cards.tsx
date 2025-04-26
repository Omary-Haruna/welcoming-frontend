import React from 'react';
import Tilt from 'react-parallax-tilt';
import styles from './Cards.module.css';
import {
    Trophy,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    ThumbsDown
} from 'lucide-react';

const Cards = () => {
    const cards = [
        {
            title: 'Most Performer This Week',
            value: 'Aisha S.',
            emoji: '🏆',
            special: true,
            icon: <Trophy size={24} />,
        },
        {
            title: 'Total Tasks',
            value: 45,
            icon: <CheckCircle2 size={24} />,
        },
        {
            title: 'Completed',
            value: 30,
            icon: <CheckCircle2 size={24} />,
        },
        {
            title: 'Pending',
            value: 15,
            icon: <Clock size={24} />,
        },
        {
            title: 'Failed Tasks',
            value: 5,
            icon: <XCircle size={24} />,
        },
        {
            title: 'Things to Improve',
            value: <small className={styles.improvement}>Time Management</small>,
            icon: <AlertCircle size={24} />,
        },

        {
            title: 'Weakest Employee This Month',
            value: (
                <>
                    John D. <br />
                    <small className={styles.reason}>Missed 3 deadlines</small>
                </>
            ),
            icon: <ThumbsDown size={24} />,
        },
    ];

    return (
        <div className={styles.cardContainer}>
            {cards.map((card, idx) => (
                <Tilt
                    key={idx}
                    tiltMaxAngleX={10}
                    tiltMaxAngleY={10}
                    glareEnable={card.special}
                    glareMaxOpacity={0.1}
                    scale={1.02}
                    transitionSpeed={1500}
                >
                    <div className={`${styles.card} ${card.special ? styles.specialCard : ''}`}>
                        <div className={styles.blurTitle}>
                            {card.icon && <span className={styles.icon}>{card.icon}</span>}
                            {card.emoji && <span className={styles.emoji}>{card.emoji}</span>}
                            {card.title}
                        </div>
                        <div className={styles.blurNumber}>{card.value}</div>
                    </div>
                </Tilt>
            ))}
        </div>
    );
};

export default Cards;
