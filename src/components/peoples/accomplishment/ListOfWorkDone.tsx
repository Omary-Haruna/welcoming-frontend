import React, { useMemo, useState } from 'react';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import styles from './ListOfWorkDone.module.css';
import { useAccomplishmentFilter } from '@/store/accomplishmentFilterStore';

type TaskRow = {
    task: string;
    staff: string;
    details: string;
    amount: string;
    role: string;
    rating: number;
    date: string;
    outcome: 'success' | 'fail';
    failureReason?: string;
};

// Format date like "4th April 2025"
const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const suffix = (d: number) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${suffix(day)} ${month} ${year}`;
};

const calculateJoinedInfo = (dateStr: string) => {
    const joined = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24));
    const daysAgo = `Joined ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    let group = '';
    if (diffDays < 30) {
        group = '🆕 New';
    } else if (diffDays < 180) {
        group = '📅 1–6 months';
    } else if (diffDays < 365) {
        group = '🕓 6–12 months';
    } else {
        group = '👴 1+ year';
    }
    return { daysAgo, group, diffDays };
};

const ListOfWorkDone = () => {
    const { search, sort, starFilter, dateJoined, outcomeFilter } = useAccomplishmentFilter();

    const data = useMemo<TaskRow[]>(() => {
        const all: TaskRow[] = [
            { task: 'Sales', staff: 'John', details: 'Sold 3 laptops', amount: '3,000,000 TZS', role: 'Salesperson', rating: 4, date: '2023-03-04', outcome: 'success' },
            { task: 'Delivery', staff: 'Alice', details: 'Delivered 2 monitors', amount: '600,000 TZS', role: 'Delivery', rating: 3, date: '2024-08-01', outcome: 'success' },
            {
                task: 'Support',
                staff: 'Mike',
                details: 'Fixed network issues',
                amount: '0 TZS',
                role: 'Support',
                rating: 5,
                date: '2024-12-10',
                outcome: 'fail',
                failureReason: 'Late response',
            },
            {
                task: 'Sales',
                staff: 'Liam',
                details: 'Sold 1 printer',
                amount: '400,000 TZS',
                role: 'Salesperson',
                rating: 2,
                date: '2025-03-05',
                outcome: 'fail',
                failureReason: 'Customer canceled',
            },
            { task: 'Delivery', staff: 'Noah', details: 'Delivered 5 phones', amount: '1,250,000 TZS', role: 'Delivery', rating: 4, date: '2025-02-26', outcome: 'success' },
            { task: 'Sales', staff: 'Sophia', details: 'Sold 2 desktops', amount: '2,000,000 TZS', role: 'Salesperson', rating: 3, date: '2025-01-15', outcome: 'success' },
        ];

        return all.filter((item) => {
            const nameMatch = item.staff.toLowerCase().includes(search.toLowerCase());
            const roleMatch = !sort || item.role.toLowerCase() === sort.toLowerCase();
            const starMatch = !starFilter || item.rating === parseInt(starFilter);
            const outcomeMatch = !outcomeFilter || item.outcome === outcomeFilter;
            const dateMatch = (() => {
                if (!dateJoined) return true;
                const { diffDays } = calculateJoinedInfo(item.date);
                switch (dateJoined) {
                    case 'new': return diffDays < 30;
                    case '1to6': return diffDays >= 30 && diffDays < 180;
                    case '6to12': return diffDays >= 180 && diffDays < 365;
                    case '1plus': return diffDays >= 365 && diffDays < 730;
                    case '2plus': return diffDays >= 730;
                    default: return true;
                }
            })();
            return nameMatch && roleMatch && starMatch && dateMatch && outcomeMatch;
        });
    }, [search, sort, starFilter, dateJoined, outcomeFilter]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    }, [data, currentPage]);

    const columns = useMemo<ColumnDef<TaskRow>[]>(() => [
        { accessorKey: 'task', header: 'Task', cell: info => info.getValue() },
        { accessorKey: 'staff', header: 'Staff', cell: info => info.getValue() },
        { accessorKey: 'details', header: 'Details', cell: info => info.getValue() },
        { accessorKey: 'amount', header: 'Amount', cell: info => info.getValue() },
        { accessorKey: 'role', header: 'Role', cell: info => info.getValue() },
        {
            accessorKey: 'rating',
            header: 'Rating',
            cell: info => '⭐'.repeat(info.getValue() as number) || '—',
        },
        {
            accessorKey: 'date',
            header: 'Date Joined',
            cell: info => {
                const dateStr = info.getValue() as string;
                const { daysAgo, group } = calculateJoinedInfo(dateStr);
                return (
                    <div>
                        <div>{formatDate(dateStr)}</div>
                        <div style={{ fontSize: '0.8rem', color: '#555' }}>{daysAgo}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999' }}>{group}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'outcome',
            header: 'Outcome',
            cell: info => {
                const row = info.row.original;
                return row.outcome === 'success' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'green' }}>
                        <CheckCircle size={20} />
                        <span style={{ fontSize: '0.9rem' }}>Success</span>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', color: 'red' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <XCircle size={20} />
                            <span style={{ fontSize: '0.9rem' }}>Failed</span>
                        </div>
                        {row.failureReason && (
                            <span style={{ fontSize: '0.75rem', marginLeft: '1.8rem' }}>{row.failureReason}</span>
                        )}
                    </div>
                );
            },
        },
    ], []);

    const table = useReactTable({
        data: paginatedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            {/* ✅ Desktop Table View */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '1rem' }}>
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 📱 Mobile Card View */}
            <div className={styles.cardContainer}>
                {paginatedData.length > 0 ? (
                    paginatedData.map((row, index) => (
                        <div className={styles.card} key={index}>
                            <div><strong>Task:</strong> {row.task}</div>
                            <div><strong>Staff:</strong> {row.staff}</div>
                            <div><strong>Details:</strong> {row.details}</div>
                            <div><strong>Amount:</strong> {row.amount}</div>
                            <div><strong>Role:</strong> {row.role}</div>
                            <div><strong>Rating:</strong> {'⭐'.repeat(row.rating)}</div>
                            <div><strong>Date Joined:</strong> {formatDate(row.date)}</div>
                            <div><strong>Status:</strong>
                                {row.outcome === 'success' ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'green' }}>
                                        <CheckCircle size={18} />
                                        Success
                                    </span>
                                ) : (
                                    <div style={{ color: 'red' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <XCircle size={18} />
                                            Failed
                                        </div>
                                        {row.failureReason && (
                                            <div style={{ fontSize: '0.75rem', marginLeft: '1.8rem' }}>
                                                {row.failureReason}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>No data found.</div>
                )}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                    <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? styles.activePage : ''}
                    >
                        {i + 1}
                    </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                    <ChevronRight size={20} />
                </button>
            </div>
        </>
    );
};

export default ListOfWorkDone;
