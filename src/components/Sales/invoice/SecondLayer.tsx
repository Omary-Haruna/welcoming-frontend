import React from 'react';
import styles from './SecondLayer.module.css';
import { FilePlus, XCircle } from 'lucide-react';

export default function SecondLayer({ onAddClick, showForm }) {
    return (
        <div className={styles.secondLayer}>
            <button className={styles.addButton} onClick={onAddClick}>
                {showForm ? <XCircle size={20} /> : <FilePlus size={20} />}
                <span>{showForm ? 'Hide Invoice' : 'Add Invoice'}</span>
            </button>
        </div>
    );
}
