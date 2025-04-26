import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    ChevronUp,
    FilePlus,
    FileText,
    FileSearch,
    BadgeDollarSign,
    FilePlus2,
    Repeat,
    Timer,
    FileCheck
} from 'lucide-react';
import styles from './AnimatedDropdown.module.css';

const options = [
    {
        value: 'Standard Invoice',
        icon: <FileText size={16} />,
        label: 'Standard Invoice',
        hint: 'Regular invoice after a product or service is sold'
    },
    {
        value: 'Proforma Invoice',
        icon: <FileSearch size={16} />,
        label: 'Proforma Invoice',
        hint: 'Preliminary invoice sent before a sale is confirmed'
    },
    {
        value: 'Credit Invoice',
        icon: <BadgeDollarSign size={16} />,
        label: 'Credit Invoice',
        hint: 'Used for refunds or discounts — reduces what the customer owes'
    },
    {
        value: 'Debit Invoice',
        icon: <FilePlus2 size={16} />,
        label: 'Debit Invoice',
        hint: 'Adds extra charges to what the customer owes'
    },
    {
        value: 'Recurring Invoice',
        icon: <Repeat size={16} />,
        label: 'Recurring Invoice',
        hint: 'Automatically sent at regular intervals, like subscriptions'
    },
    {
        value: 'Timesheet Invoice',
        icon: <Timer size={16} />,
        label: 'Timesheet Invoice',
        hint: 'Based on hours worked — common for freelancers'
    },
    {
        value: 'Final Invoice',
        icon: <FileCheck size={16} />,
        label: 'Final Invoice',
        hint: 'Last invoice after the work or project is completed'
    }
];

export default function AnimatedDropdown({ selected, setSelected }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <p className={styles.hint}>Select Invoice Type</p>
            <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
                <FilePlus size={16} />
                <span>{selected || 'Choose Type...'}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        className={styles.dropdownList}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className={styles.dropdownItem}
                                title={option.hint}
                                onClick={() => {
                                    setSelected(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {option.icon}
                                    {option.label}
                                </div>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}
