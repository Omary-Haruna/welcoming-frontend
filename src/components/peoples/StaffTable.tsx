import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './StaffTable.module.css';
import { Pencil, Trash, Ban, KeyRound, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

interface Staff {
    id: number;
    name: string;
    role: string;
    phone: string;
    email: string;
    status?: 'active' | 'inactive';
    tasks?: string;
    outcome?: 'success' | 'failure';
    failureReason?: string;
    earning: number;
    date: string;
    avatar?: string;
    rating: number;
}

const generateDummyStaff = (): Staff[] => {
    return Array.from({ length: 20 }, (_, i) => {
        const status = i % 3 === 0 ? 'inactive' : 'active';
        const earning = status === 'inactive' ? 0 : Math.floor(Math.random() * 2000000) + 300000;
        const isFailure = earning === 0;
        const task = status === 'inactive' ? 'No tasks assigned' : (i % 2 === 0 ? 'Sold 5 laptops' : 'Delivered 3 orders');
        const failureReason = status === 'inactive'
            ? 'Staff member is inactive and not allowed to perform tasks or earn money'
            : isFailure ? 'Did not perform any tasks or generate earnings' : '';
        const date = new Date(Date.now() - i * 86400000).toLocaleDateString('en-TZ', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

        return {
            id: i + 1,
            name: `Staff Member ${i + 1}`,
            role: i % 2 === 0 ? 'Manager' : 'Salesperson',
            phone: `0712 34${i} 000`,
            email: `staff${i + 1}@example.com`,
            status,
            tasks: task,
            earning,
            outcome: isFailure ? 'failure' : 'success',
            failureReason,
            date,
            avatar: '👤',
            rating: Math.floor(Math.random() * 5) + 1
        };
    });
};

const StaffTable = () => {
    const [data, setData] = useState<Staff[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [outcomeFilter, setOutcomeFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState(0);
    const [sortProfit, setSortProfit] = useState('');

    const itemsPerPage = 5;
    const topRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setData(generateDummyStaff());
    }, []);

    useEffect(() => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    const filteredData = useMemo(() => {
        let result = [...data];

        if (search) {
            result = result.filter((s) =>
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (roleFilter) {
            result = result.filter((s) => s.role === roleFilter);
        }

        if (outcomeFilter) {
            result = result.filter((s) => s.outcome === outcomeFilter);
        }

        if (ratingFilter) {
            result = result.filter((s) => s.rating === ratingFilter);
        }

        if (sortProfit === 'high') {
            result.sort((a, b) => b.earning - a.earning);
        } else if (sortProfit === 'low') {
            result.sort((a, b) => a.earning - b.earning);
        }

        return result;
    }, [data, search, roleFilter, outcomeFilter, ratingFilter, sortProfit]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const currentItems = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    return (
        <div className={styles.wrapper} ref={topRef}>
            <div className={styles.emptyTopDiv}>
                <div className={styles.filters}>
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select onChange={(e) => setRoleFilter(e.target.value)} value={roleFilter}>
                        <option value="">All Roles</option>
                        <option value="Manager">Manager</option>
                        <option value="Salesperson">Salesperson</option>
                    </select>
                    <select onChange={(e) => setOutcomeFilter(e.target.value)} value={outcomeFilter}>
                        <option value="">All Outcomes</option>
                        <option value="success">Success</option>
                        <option value="failure">Failure</option>
                    </select>
                    <select onChange={(e) => setRatingFilter(Number(e.target.value))} value={ratingFilter}>
                        <option value={0}>All Ratings</option>
                        {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>{r} Stars</option>
                        ))}
                    </select>
                    <select onChange={(e) => setSortProfit(e.target.value)} value={sortProfit}>
                        <option value="">Sort by Profit</option>
                        <option value="high">High to Low</option>
                        <option value="low">Low to High</option>
                    </select>
                </div>
            </div>

            <div className={styles.gridWrapper}>
                {currentItems.map((staff) => (
                    <motion.div
                        key={staff.id}
                        className={styles.card}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className={styles.avatar}>{staff.avatar || '👤'}</div>
                        <div className={styles.name}>{staff.name}</div>
                        <div className={`${styles.status} ${styles[staff.status || 'inactive']}`}>
                            {staff.status === 'active' ? '✅ Active' : '❌ Inactive'}
                        </div>
                        <div className={styles.role}>Role: {staff.role}</div>
                        <div className={styles.contact}>📞 {staff.phone} • ✉️ {staff.email}</div>
                        <div className={styles.tasks}>📝 {staff.tasks || 'No task recorded'}</div>
                        <div className={styles.earning}>💰 Earning: {staff.earning.toLocaleString()} TZS</div>
                        <div className={styles.date}>📅 {staff.date}</div>
                        <div className={styles.rating}>
                            ⭐ Rating:{' '}
                            {Array.from({ length: 5 }, (_, idx) => (
                                <Star key={idx} size={14} fill={idx < staff.rating ? '#ffc107' : 'none'} stroke="#ffc107" />
                            ))}
                        </div>
                        <div className={`${styles.outcome} ${styles[staff.outcome || 'failure']}`}>
                            {staff.outcome === 'success' ? '✅ Success' : '❌ Failure'}
                        </div>
                        {staff.outcome === 'failure' && staff.failureReason && (
                            <div className={styles.failureReason}>Reason: {staff.failureReason}</div>
                        )}
                        <div className={styles.actions}>
                            <Pencil size={18} data-tooltip-id="staff-tooltip" data-tooltip-content="Edit Staff Info" />
                            <Ban size={18} data-tooltip-id="staff-tooltip" data-tooltip-content="Suspend Staff" />
                            <Trash size={18} data-tooltip-id="staff-tooltip" data-tooltip-content="Delete Staff" />
                            <KeyRound size={18} data-tooltip-id="staff-tooltip" data-tooltip-content="Reset Staff Password" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <Tooltip id="staff-tooltip" place="top" effect="solid" />

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}
        </div>
    );
};

export default StaffTable;
