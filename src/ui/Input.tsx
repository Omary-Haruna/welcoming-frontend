import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
    <div className={styles.inputContainer}>
        {label && <label className={styles.label}>{label}</label>}
        <input className={styles.input} {...props} />
    </div>
);

export default Input;
