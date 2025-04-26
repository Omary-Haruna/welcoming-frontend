import React from 'react';
import styles from './BillTo.module.css';
import AnimatedDropdown from './AnimatedDropdown';
import {
    UserRound,
    Building2,
    Mail,
    MapPin,
    Phone,
    BadgePercent,
    Package,
    DollarSign,
    PlusCircle,
    RefreshCcw,
    FilePlus,
} from 'lucide-react';

export default function BillTo({ data, setData, onAdd, onDraft }) {
    const resetForm = () => {
        setData((prev) => ({
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



    const handleTaxChange = (value) => {
        const taxAmount = (parseFloat(data.unitPrice || 0) * parseFloat(value || 0)) / 100;
        const priceAfterTax = parseFloat(data.unitPrice || 0) + taxAmount;

        setData({
            ...data,
            tax: value,
            taxAmount: taxAmount.toFixed(2),
            priceAfterTax: priceAfterTax.toFixed(2),
        });
    };

    // Define common fields with their icons, placeholders, keys, and hints.
    const fields = [
        {
            icon: <UserRound size={16} />,
            placeholder: 'Customer Name',
            key: 'customerName',
            hint: 'Full name of the person or business representative',
        },
        {
            icon: <Building2 size={16} />,
            placeholder: 'Company Name',
            key: 'companyName',
            hint: 'Legal name of the company being billed',
        },
        {
            icon: <MapPin size={16} />,
            placeholder: 'Address',
            key: 'address',
            hint: 'Mailing or delivery address',
        },
        {
            icon: <Mail size={16} />,
            placeholder: 'Email',
            key: 'email',
            hint: "Customer's email address",
        },
        {
            icon: <Phone size={16} />,
            placeholder: 'Phone',
            key: 'phone',
            hint: 'Phone number for contact',
        },
        {
            icon: <BadgePercent size={16} />,
            placeholder: 'TIN Number',
            key: 'tin',
            hint: 'Taxpayer Identification Number (optional)',
        },
        {
            icon: <Package size={16} />,
            placeholder: 'Product',
            key: 'product',
            hint: 'Name of the product or service',
        },
    ];

    return (
        <div className={styles.billToBox}>
            <h3 className={styles.headerTitle}>🧾 Bill To</h3>

            <div className={styles.grid}>
                {fields.map((field, index) => (
                    <div key={index} className={styles.inputWrapper}>
                        <p className={styles.hint}>{field.hint}</p>
                        <div className={styles.inputGroup}>
                            {field.icon}
                            <input
                                placeholder={field.placeholder}
                                value={data[field.key]}
                                onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
                            />
                        </div>
                    </div>
                ))}

                {/* Quantity Field */}
                <div className={styles.inputWrapper}>
                    <p className={styles.hint}>Number of units being sold</p>
                    <div className={styles.inputGroup}>
                        <Package size={16} />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={data.quantity}
                            onChange={(e) => setData({ ...data, quantity: e.target.value })}
                        />
                    </div>
                </div>

                {/* Unit Price Field */}
                <div className={styles.inputWrapper}>
                    <p className={styles.hint}>Price per product before tax</p>
                    <div className={styles.inputGroup}>
                        <DollarSign size={16} />
                        <input
                            type="number"
                            placeholder="Unit Price"
                            value={data.unitPrice}
                            onChange={(e) => {
                                const tax = parseFloat(data.tax || 0);
                                const price = parseFloat(e.target.value || 0);
                                const taxAmount = (price * tax) / 100;
                                const priceAfterTax = price + taxAmount;

                                setData({
                                    ...data,
                                    unitPrice: e.target.value,
                                    taxAmount: taxAmount.toFixed(2),
                                    priceAfterTax: priceAfterTax.toFixed(2),
                                });
                            }}
                        />
                    </div>
                </div>

                {/* Tax % Field */}
                <div className={styles.inputWrapper}>
                    <p className={styles.hint}>Enter tax rate (e.g., 18 for 18%)</p>
                    <div className={styles.inputGroup}>
                        <BadgePercent size={16} />
                        <input
                            type="number"
                            placeholder="Tax %"
                            value={data.tax || ''}
                            onChange={(e) => handleTaxChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tax Amount Field */}
                <div className={styles.inputWrapper}>
                    <p className={styles.hint}>Automatically calculated from price and tax</p>
                    <div className={styles.inputGroup}>
                        <DollarSign size={16} />
                        <input type="text" placeholder="Tax Amount" value={data.taxAmount || ''} readOnly />
                    </div>
                </div>

                {/* Price After Tax Field */}
                <div className={styles.inputWrapper}>
                    <p className={styles.hint}>Final amount including tax</p>
                    <div className={styles.inputGroup}>
                        <DollarSign size={16} />
                        <input type="text" placeholder="Price After Tax" value={data.priceAfterTax || ''} readOnly />
                    </div>
                </div>
            </div>



            <div className={styles.buttonContainer}>
                <button className={`${styles.resetButton} ${styles.fullButton}`} onClick={resetForm}>
                    <RefreshCcw size={16} /> Reset
                </button>

                <button className={`${styles.draftButton} ${styles.fullButton}`} onClick={onDraft}>
                    <FilePlus size={16} /> Save as Draft
                </button>

                {onAdd && (
                    <button className={`${styles.addButton} ${styles.fullButton}`} onClick={onAdd}>
                        <PlusCircle size={16} /> Add to Table
                    </button>
                )}
            </div>
        </div>
    );
}
