import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './ManualTask.module.css';

const ManualTask = () => {
    const formik = useFormik({
        initialValues: {
            staffName: '',
            taskTitle: '',
            description: '',
            earnedDate: '',
            role: '',
        },
        validationSchema: Yup.object({
            staffName: Yup.string().required('Required'),
            taskTitle: Yup.string().required('Required'),
            description: Yup.string().required('Required'),
            earnedDate: Yup.date().required('Required'),
            role: Yup.string().required('Required'),
        }),
        onSubmit: (values, { resetForm }) => {
            alert(`Task "${values.taskTitle}" assigned to ${values.staffName}`);
            resetForm();
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className={styles.formWrapper}>
            <div className={styles.formField}>
                <label htmlFor="staffName">Staff Name</label>
                <input
                    id="staffName"
                    name="staffName"
                    type="text"
                    className={styles.input}
                    {...formik.getFieldProps('staffName')}
                />
                {formik.touched.staffName && formik.errors.staffName && (
                    <div className={styles.error}>{formik.errors.staffName}</div>
                )}
            </div>

            <div className={styles.formField}>
                <label htmlFor="taskTitle">Task Title</label>
                <input
                    id="taskTitle"
                    name="taskTitle"
                    type="text"
                    className={styles.input}
                    {...formik.getFieldProps('taskTitle')}
                />
                {formik.touched.taskTitle && formik.errors.taskTitle && (
                    <div className={styles.error}>{formik.errors.taskTitle}</div>
                )}
            </div>

            <div className={styles.formField}>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className={styles.textarea}
                    {...formik.getFieldProps('description')}
                />
                {formik.touched.description && formik.errors.description && (
                    <div className={styles.error}>{formik.errors.description}</div>
                )}
            </div>

            <div className={styles.formField}>
                <label htmlFor="earnedDate">Earned Date</label>
                <input
                    id="earnedDate"
                    name="earnedDate"
                    type="date"
                    className={styles.input}
                    {...formik.getFieldProps('earnedDate')}
                />
                {formik.touched.earnedDate && formik.errors.earnedDate && (
                    <div className={styles.error}>{formik.errors.earnedDate}</div>
                )}
            </div>

            <div className={styles.formField}>
                <label htmlFor="role">Role</label>
                <select
                    id="role"
                    name="role"
                    className={styles.select}
                    {...formik.getFieldProps('role')}
                >
                    <option value="">Select role</option>
                    <option value="Manager">Manager</option>
                    <option value="Salesperson">Salesperson</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Support">Support</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                    <div className={styles.error}>{formik.errors.role}</div>
                )}
            </div>

            <button type="submit" className={styles.submitBtn}>Assign Task</button>
        </form>
    );
};

export default ManualTask;
