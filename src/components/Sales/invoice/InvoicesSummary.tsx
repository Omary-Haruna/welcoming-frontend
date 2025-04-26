import React from 'react';
import styles from './InvoicesSummary.module.css';
import {
    FileText,
    DollarSign,
    CheckCircle,
    Clock,
    AlertTriangle,
    FileMinus,
    BarChart3,
    PieChart,
    Search,
    Users,
    Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const barData = [
    { name: 'Jan', total: 2000000 },
    { name: 'Feb', total: 1800000 },
    { name: 'Mar', total: 2200000 },
    { name: 'Apr', total: 3000000 },
    { name: 'May', total: 2700000 },
];

const lineData = [
    { name: 'Week 1', revenue: 500000 },
    { name: 'Week 2', revenue: 1000000 },
    { name: 'Week 3', revenue: 750000 },
    { name: 'Week 4', revenue: 1200000 },
];

export default function InvoicesSummary() {
    return (
        <div className={styles.summaryWrapper}>
            <motion.h2 className={styles.title} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                📊 Invoice Summary Dashboard
            </motion.h2>

            <div className={styles.cardsGrid}>
                {[{
                    icon: <FileText size={24} />, label: 'Total Invoices', value: '30'
                }, {
                    icon: <DollarSign size={24} />, label: 'Total Amount Invoiced', value: 'Tshs 12,000,000'
                }, {
                    icon: <CheckCircle size={24} color="green" />, label: 'Total Paid', value: 'Tshs 8,000,000'
                }, {
                    icon: <Clock size={24} color="orange" />, label: 'Total Pending', value: 'Tshs 2,000,000'
                }, {
                    icon: <AlertTriangle size={24} color="red" />, label: 'Total Overdue', value: 'Tshs 2,000,000'
                }, {
                    icon: <FileMinus size={24} color="blue" />, label: 'Draft Invoices', value: '3 Drafts'
                }].map((card, index) => (
                    <motion.div className={styles.card} key={index} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                        {card.icon}
                        <span>{card.label}</span>
                        <strong>{card.value}</strong>
                    </motion.div>
                ))}
            </div>

            <div className={styles.filtersSection}>
                <div className={styles.filter}>
                    <Search size={20} />
                    <input type="text" placeholder="Search by invoice number or client" />
                </div>
                <div className={styles.filter}>
                    <Filter size={20} />
                    <select>
                        <option>Date Range</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>Custom Range</option>
                    </select>
                </div>
                <div className={styles.filter}>
                    <Users size={20} />
                    <select>
                        <option>Filter by Client</option>
                        <option>John Doe</option>
                        <option>Acme Corp</option>
                    </select>
                </div>
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartBox}>
                    <BarChart3 size={20} />
                    <h4>Monthly Revenue</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barData} margin={{ top: 10, right: 30, left: 40, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" padding={{ left: 10, right: 10 }} />
                            <YAxis padding={{ top: 10 }} tickFormatter={(value) => `Tshs ${value / 1000000}M`} />
                            <Tooltip formatter={(value) => `Tshs ${value.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.chartBox}>
                    <PieChart size={20} />
                    <h4>Weekly Revenue Trend</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={lineData} margin={{ top: 10, right: 30, left: 40, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                padding={{ left: 10, right: 10 }}
                                angle={-25}
                                textAnchor="end"
                            />
                            <YAxis padding={{ top: 10 }} tickFormatter={(value) => `Tshs ${value / 1000000}M`} />
                            <Tooltip formatter={(value) => `Tshs ${value.toLocaleString()}`} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Revenue" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.topClients}>
                <h4>🥇 Top Clients</h4>
                <ul>
                    <li>John Doe — $4,500</li>
                    <li>Acme Corp — $3,200</li>
                    <li>SoftTech Ltd. — $2,000</li>
                </ul>
            </div>
        </div>
    );
}
