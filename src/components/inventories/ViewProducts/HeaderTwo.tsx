// src/components/inventories/ViewProducts/HeaderTwo.tsx
import styles from './HeaderTwo.module.css';

interface HeaderTwoProps {
    stats: { label: string; value: string | number }[];
    onCardClick: (label: string) => void;
    activeFilter: string;
}

export default function HeaderTwo({ stats, onCardClick, activeFilter }: HeaderTwoProps) {
    return (
        <div className={styles.cards}>
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className={`${styles.card} ${activeFilter === stat.label ? styles.active : ''}`}
                    onClick={() => onCardClick(stat.label)}
                    style={{ cursor: 'pointer' }}
                >
                    <span className={styles.label}>{stat.label}</span>
                    <strong className={styles.value}>{stat.value}</strong>
                </div>
            ))}
        </div>
    );
}
