import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Filter as FilterIcon, XCircle } from 'lucide-react';
import styles from './CustomerFilter.module.css';

const allCards = [
    'GeneralStatsCard',
    'PurchaseBehaviorCard',
    'TimeBasedStatsCard',
    'DemographicStatsCard',
    'TopPerformersCard',
    'ProductStatsCard',
    'EngagementCard',
    'FinancialStatsCard',
    'AddCustomerCard' // ✅ Added this line
];

// Default visible cards
const defaultVisibleCards = [
    'GeneralStatsCard',
    'PurchaseBehaviorCard',
    'TimeBasedStatsCard',
];

export default function Filter({ visibleCards = defaultVisibleCards, setVisibleCards }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleCard = (card: string) => {
        setVisibleCards(
            visibleCards.includes(card)
                ? visibleCards.filter((c) => c !== card)
                : [...visibleCards, card]
        );
    };

    const uncheckAll = () => {
        setVisibleCards([]); // Clear all cards
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button className={styles.toggleButton} onClick={() => setIsOpen((prev) => !prev)}>
                <FilterIcon size={16} style={{ marginRight: '6px' }} />
                What do you want to see?
                {isOpen ? (
                    <ChevronUp size={16} style={{ marginLeft: '6px' }} />
                ) : (
                    <ChevronDown size={16} style={{ marginLeft: '6px' }} />
                )}
            </button>

            <div className={`${styles.dropdownMenu} ${isOpen ? styles.show : ''}`}>
                <button className={styles.uncheckAllBtn} onClick={uncheckAll}>
                    <XCircle size={14} style={{ marginRight: '4px' }} />
                    I don't want to see anything
                </button>

                {allCards.map((card) => (
                    <label key={card} className={styles.checkboxItem}>
                        <input
                            type="checkbox"
                            checked={visibleCards.includes(card)}
                            onChange={() => toggleCard(card)}
                        />
                        {card.replace('Card', '').replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                ))}
            </div>
        </div>
    );
}
