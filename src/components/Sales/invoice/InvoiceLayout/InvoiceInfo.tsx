import React from 'react';
import styles from './InvoiceInfo.module.css';
import {
    FileText,
    CalendarDays,
    CalendarCheck,
    Landmark,
    Hash,
    CircleDollarSign,
    FileSignature
} from 'lucide-react';
import AnimatedDropdown from './AnimatedDropdown';

const getDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
};


const paymentOptions = [
    { label: 'Net X (based on due date)', value: 'netx', description: 'Payment due after a specified number of days from the invoice date' },
    { label: 'Due on Receipt', value: 'due', description: 'Payment is due immediately when the invoice is received' },
    { label: 'COD (Cash on Delivery)', value: 'cod', description: 'Customer pays when the product is delivered' },
    { label: 'CIA (Cash in Advance)', value: 'cia', description: 'Full payment is required before service or delivery' },
    { label: 'PIA (Payment in Advance)', value: 'pia', description: 'Customer pays before the invoice date' },
    { label: 'EOM (End of Month)', value: 'eom', description: 'Payment is due at the end of the month of the invoice' },
    { label: '15 MFI (15th of Month Following Invoice)', value: '15mfi', description: 'Payment is due on the 15th of the next month after the invoice date' },
    { label: '2/10 Net 30', value: '2net30', description: '2% discount if paid in 10 days, full amount due in 30 days' },
    { label: '50% upfront, 50% on delivery', value: 'halfupfront', description: 'Split payment: half upfront, the rest on delivery' },
    { label: 'Milestone-based', value: 'milestone', description: 'Payment made in phases, based on progress or milestones' },
    { label: 'Installments', value: 'installments', description: 'Payment is broken into multiple scheduled parts' },
];

const allowedPaymentTermsByInvoiceType = {
    'Standard Invoice': ['netx', 'due', 'cod', 'eom', '2net30', 'halfupfront', 'installments'],
    'Proforma Invoice': ['cia', 'pia'],
    'Credit Invoice': [],
    'Debit Invoice': ['due', 'netx'],
    'Recurring Invoice': ['installments', '2net30', 'eom'],
    'Timesheet Invoice': ['netx', '2net30', 'milestone'],
    'Final Invoice': ['due', 'netx', '2net30'],
};

const isPaymentTermAllowed = (invoiceType, term) => {
    if (!invoiceType) return true;
    return allowedPaymentTermsByInvoiceType[invoiceType]?.includes(term);
};

export default function InvoiceInfo({ data, setData }) {
    const update = (key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const selectedTerm = paymentOptions.find(p => p.value === data.selectedPaymentTerm);

    return (
        <div className={styles.invoiceInfo}>
            <h2 className={styles.title}><FileText size={22} /> Invoice Details</h2>

            {/* INVOICE TYPE DROPDOWN */}
            <div className={styles.formGroup}>
                <AnimatedDropdown
                    selected={data.selectedInvoiceType}
                    setSelected={(value) => {
                        update('selectedInvoiceType', value);
                        const allowed = allowedPaymentTermsByInvoiceType[value];
                        if (!allowed.includes(data.selectedPaymentTerm)) {
                            update('selectedPaymentTerm', '');
                        }
                    }}
                />
            </div>

            {/* INVOICE NUMBER */}
            <div className={styles.formGroup}>
                <label className={styles.label}><Hash size={18} /> Invoice Number</label>
                <input className={styles.input} value={data.invoiceNumber} readOnly />
            </div>

            {/* INVOICE DATE */}
            <div className={styles.formGroup}>
                <label className={styles.label}><CalendarDays size={18} /> Invoice Date</label>
                <input
                    className={styles.input}
                    type="date"
                    value={data.invoiceDate}
                    onChange={(e) => update('invoiceDate', e.target.value)}
                />
            </div>

            {/* DUE DATE */}
            <div className={styles.formGroup}>
                <label className={styles.label}><CalendarCheck size={18} /> Due Date</label>
                <input
                    className={styles.input}
                    type="date"
                    value={data.dueDate}
                    onChange={(e) => update('dueDate', e.target.value)}
                />
            </div>

            {/* PAYMENT TERMS SELECT */}
            <div className={styles.formGroup}>
                <label className={styles.label}><Landmark size={18} /> Payment Terms</label>
                <select
                    className={styles.input}
                    value={data.selectedPaymentTerm}
                    onChange={(e) => update('selectedPaymentTerm', e.target.value)}
                >
                    {paymentOptions.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={!isPaymentTermAllowed(data.selectedInvoiceType, option.value)}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Warning if selected term is not valid for invoice type */}
                {data.selectedInvoiceType && data.selectedPaymentTerm &&
                    !isPaymentTermAllowed(data.selectedInvoiceType, data.selectedPaymentTerm) && (
                        <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                            ⚠️ This payment term is not valid for the selected invoice type.
                        </p>
                    )}

                {/* Description of selected term */}
                {selectedTerm?.description && (
                    <p className={styles.paymentDescription}>{selectedTerm.description}</p>
                )}
            </div>

            {/* NET X DAYS FIELD */}
            {data.selectedPaymentTerm === 'netx' && (
                <div className={styles.formGroup}>
                    <label className={styles.label}>Net X Days</label>
                    <input
                        className={styles.input}
                        value={getDaysDifference(data.invoiceDate, data.dueDate)}
                        readOnly
                    />
                </div>
            )}


            {/* REFERENCE NUMBER */}
            <div className={styles.formGroup}>
                <label className={styles.label}><FileSignature size={18} /> Reference No.</label>
                <input
                    className={styles.input}
                    value={data.reference}
                    onChange={(e) => update('reference', e.target.value)}
                    placeholder="e.g., PO-1234"
                />
            </div>

            {/* CURRENCY */}
            <div className={styles.formGroup}>
                <label className={styles.label}><CircleDollarSign size={18} /> Currency</label>
                <input
                    className={styles.input}
                    value={data.currency}
                    onChange={(e) => update('currency', e.target.value)}
                    placeholder="e.g., TZS, USD"
                />
            </div>
        </div>
    );
}
