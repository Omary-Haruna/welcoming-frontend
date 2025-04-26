import React, { useState, useEffect } from 'react';
import styles from './MainOne.module.css';
import Logo from './InvoiceLayout/Logo';
import InvoiceInfo from './InvoiceLayout/InvoiceInfo';
import BillTo from './InvoiceLayout/BillTo';
import Filter from './InvoiceLayout/Filter';

const generateInvoiceNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000);
    return `INV-${date}-${random}`;
};

const getDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
};

const getDescription = (term, invoiceDate, dueDate, netxDays) => {
    switch (term) {
        case 'netx':
            const netDays = netxDays || getDaysDifference(invoiceDate, dueDate);
            return `Net ${netDays} – Payment due within ${netDays} day(s) of invoice date.`;
        case 'due':
            return 'Payment is expected immediately when the invoice is received.';
        case 'cod':
            return 'Pay when goods are delivered.';
        case 'cia':
            return 'Pay before goods or services are delivered.';
        case 'pia':
            return 'Same as CIA — payment must be made up front.';
        case 'eom':
            return 'Payment is due at the end of the month the invoice is issued.';
        case '15mfi':
            return 'Payment is due on the 15th of the next month.';
        case '2net30':
            return '2% discount if paid in 10 days, otherwise full payment due in 30 days.';
        case 'halfupfront':
            return '50% upfront, 50% on delivery.';
        case 'milestone':
            return 'Payment is made after hitting certain project milestones.';
        case 'installments':
            return 'Payment is split into multiple parts over time.';
        default:
            return '';
    }
};

export default function MainOne({ showForm, setTableData }) {
    if (!showForm) return null;

    const [invoiceData, setInvoiceData] = useState({
        logo: '',
        customerName: '',
        companyName: '',
        address: '',
        email: '',
        phone: '',
        tin: '',
        product: '',
        quantity: 1,
        unitPrice: '',
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: '2025-04-13',
        dueDate: '2025-04-20',
        selectedInvoiceType: '',
        selectedPaymentTerm: 'netx',
        netxDays: '',
        reference: 'PO-7789',
        currency: 'TZS',
        paymentDescription: '',
        tax: '',
        taxAmount: '',
        priceAfterTax: '',
    });

    useEffect(() => {
        const desc = getDescription(
            invoiceData.selectedPaymentTerm,
            invoiceData.invoiceDate,
            invoiceData.dueDate,
            invoiceData.netxDays
        );
        setInvoiceData(prev => ({ ...prev, paymentDescription: desc }));
    }, [invoiceData.selectedPaymentTerm, invoiceData.invoiceDate, invoiceData.dueDate, invoiceData.netxDays]);

    const handleAddToTable = () => {
        const total = parseInt(invoiceData.quantity) * parseFloat(invoiceData.unitPrice || 0);

        if (setTableData) {
            setTableData(prev => [...prev, { ...invoiceData, total }]);
        }

        // ✅ Reset the form
        setInvoiceData(prev => ({
            ...prev,
            customerName: '',
            companyName: '',
            address: '',
            email: '',
            phone: '',
            tin: '',
            product: '',
            quantity: 1,
            unitPrice: '',
            tax: '',
            taxAmount: '',
            priceAfterTax: '',
        }));
    };


    return (
        <div className={styles.gridContainer}>
            <div className={styles.logo}><Logo /></div>
            <div className={styles.invoiceInfo}>
                <InvoiceInfo data={invoiceData} setData={setInvoiceData} />
            </div>
            <div className={styles.billTo}>
                <BillTo data={invoiceData} setData={setInvoiceData} onAdd={handleAddToTable} />
            </div>
            <div className={styles.filter}><Filter /></div>
        </div>
    );
}
