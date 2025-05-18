import React, { useState } from "react";
import styles from "./OrderModal.module.css";
import Select from "react-select";
import { regionOptions } from "../../data/regionOptions";
import { regionDistricts } from "../../data/regionDistricts";

const OrderModal = ({ isOpen, onClose, customer, onSubmitOrder }) => {
    const [fromRegion, setFromRegion] = useState({ value: "Dar es Salaam", label: "Dar es Salaam" });
    const [toRegion, setToRegion] = useState(null);
    const [toDistrict, setToDistrict] = useState(null);
    const [expectedDate, setExpectedDate] = useState("");
    const [parcelHandler, setParcelHandler] = useState("");

    const handleSubmit = () => {
        if (!fromRegion || !toRegion || !toDistrict || !expectedDate || !parcelHandler) {
            alert("Please fill all fields.");
            return;
        }

        const order = {
            customerName: customer?.name,
            region: customer?.region,
            district: customer?.district || null,
            date: new Date().toISOString(),
            from: fromRegion.label,
            to: `${toRegion.label}, ${toDistrict.label}`,
            expectedDate,
            parcelHandler,
            products: customer?.cart || [],
            totalAmount: customer?.cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0,
        };

        onSubmitOrder(order);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Create Order for {customer?.name}</h2>

                <label>From Region</label>
                <Select
                    options={regionOptions}
                    value={fromRegion}
                    onChange={setFromRegion}
                />

                <label>To Region</label>
                <Select
                    options={regionOptions}
                    value={toRegion}
                    onChange={(val) => {
                        setToRegion(val);
                        setToDistrict(null);
                    }}
                />

                <label>To District</label>
                <Select
                    options={(regionDistricts[toRegion?.value] || []).map((d) => ({ value: d, label: d }))}
                    value={toDistrict}
                    onChange={setToDistrict}
                    placeholder={toRegion ? "Select district" : "Select region first"}
                    isDisabled={!toRegion}
                />

                <label>Expected Arrival</label>
                <input
                    type="datetime-local"
                    className={styles.input}
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                />

                <label>Parcel Given To</label>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g., Delivery Driver Name"
                    value={parcelHandler}
                    onChange={(e) => setParcelHandler(e.target.value)}
                />

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className={styles.submitBtn} onClick={handleSubmit}>Submit Order</button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
