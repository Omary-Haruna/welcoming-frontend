// src/components/peoples/accomplishment/SearchAndFilter.tsx
import React from 'react';
import styles from './SearchAndFilter.module.css';
import { Search, CalendarCheck, Star, BadgeCheck } from 'lucide-react';
import { useAccomplishmentFilter } from '@/store/accomplishmentFilterStore';

const SearchAndFilter = () => {
    const {
        search,
        sort,
        dateJoined,
        starFilter,
        outcomeFilter,
        setSearch,
        setSort,
        setDateJoined,
        setStarFilter,
        setOutcomeFilter,
    } = useAccomplishmentFilter();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleDateJoinedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDateJoined(e.target.value);
    };

    const handleStarFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStarFilter(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value);
    };

    const handleOutcomeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOutcomeFilter(e.target.value as '' | 'success' | 'fail');
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* Search */}
                <div className={styles.block}>
                    <div className={styles.label}>Search</div>
                    <div className={styles.inputGroup}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {/* Time in Company */}
                <div className={styles.block}>
                    <div className={styles.label}>Time in Company</div>
                    <div className={styles.inputGroup}>
                        <CalendarCheck size={18} />
                        <select value={dateJoined} onChange={handleDateJoinedChange}>
                            <option value="">All</option>
                            <option value="new">🆕 New</option>
                            <option value="1to6">📅 1–6 months</option>
                            <option value="6to12">🕓 6–12 months</option>
                            <option value="1plus">👴 1+ year</option>
                            <option value="2plus">🧓 2+ years</option>
                        </select>
                    </div>
                </div>

                {/* Star Rating */}
                <div className={styles.block}>
                    <div className={styles.label}>Star Rating</div>
                    <div className={styles.inputGroup}>
                        <Star size={18} />
                        <select value={starFilter} onChange={handleStarFilterChange}>
                            <option value="">All</option>
                            <option value="5">★★★★★</option>
                            <option value="4">★★★★☆</option>
                            <option value="3">★★★☆☆</option>
                            <option value="2">★★☆☆☆</option>
                            <option value="1">★☆☆☆☆</option>
                        </select>
                    </div>
                </div>

                {/* Sort by Role */}
                <div className={styles.block}>
                    <div className={styles.label}>Sort by Role</div>
                    <div className={styles.inputGroup}>
                        <BadgeCheck size={18} />
                        <select value={sort} onChange={handleSortChange}>
                            <option value="">None</option>
                            <option value="salesperson">Salesperson</option>
                            <option value="support">Support</option>
                            <option value="delivery">Delivery</option>
                        </select>
                    </div>
                </div>

                {/* Outcome Filter */}
                <div className={styles.block}>
                    <div className={styles.label}>Outcome</div>
                    <div className={styles.inputGroup}>
                        <select value={outcomeFilter} onChange={handleOutcomeChange}>
                            <option value="">All</option>
                            <option value="success">✅ Success</option>
                            <option value="fail">❌ Failed</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchAndFilter;
