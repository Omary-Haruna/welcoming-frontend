import React, { useState } from 'react';
import styles from './StaticStats.module.css';
import CustomDropdown from './CustomDropdown';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Legend,
} from 'recharts';
import { TooltipProps } from 'recharts'; // ✅ ADDED: For typing CustomTooltip

// Custom tooltip component with correct types
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <p>{`${label}: ${payload[0].value.toLocaleString()} $`}</p>
            </div>
        );
    }
    return null;
};

const StaticStats: React.FC = () => {
    const [chartType, setChartType] = useState('line');
    const [period, setPeriod] = useState('week');
    const [category, setCategory] = useState('sales');

    const data = {
        week: {
            sales: [
                { name: 'Mon', value: 400 },
                { name: 'Tue', value: 300 },
                { name: 'Wed', value: 200 },
                { name: 'Thu', value: 278 },
                { name: 'Fri', value: 189 },
                { name: 'Sat', value: 239 },
                { name: 'Sun', value: 349 },
            ],
            profit: [
                { name: 'Mon', value: 150 },
                { name: 'Tue', value: 100 },
                { name: 'Wed', value: 50 },
                { name: 'Thu', value: 70 },
                { name: 'Fri', value: 40 },
                { name: 'Sat', value: 60 },
                { name: 'Sun', value: 80 },
            ],
            expenses: [
                { name: 'Mon', value: 50 },
                { name: 'Tue', value: 60 },
                { name: 'Wed', value: 40 },
                { name: 'Thu', value: 30 },
                { name: 'Fri', value: 20 },
                { name: 'Sat', value: 45 },
                { name: 'Sun', value: 35 },
            ],
        },
        month: {
            sales: [
                { name: 'Week 1', value: 3500 },
                { name: 'Week 2', value: 4200 },
                { name: 'Week 3', value: 3900 },
                { name: 'Week 4', value: 4500 },
            ],
            profit: [
                { name: 'Week 1', value: 1500 },
                { name: 'Week 2', value: 1700 },
                { name: 'Week 3', value: 1600 },
                { name: 'Week 4', value: 1800 },
            ],
            expenses: [
                { name: 'Week 1', value: 800 },
                { name: 'Week 2', value: 950 },
                { name: 'Week 3', value: 850 },
                { name: 'Week 4', value: 900 },
            ],
        },
        year: {
            sales: [
                { name: 'Q1', value: 15000 },
                { name: 'Q2', value: 17000 },
                { name: 'Q3', value: 16000 },
                { name: 'Q4', value: 18000 },
            ],
            profit: [
                { name: 'Q1', value: 7000 },
                { name: 'Q2', value: 8000 },
                { name: 'Q3', value: 7500 },
                { name: 'Q4', value: 8500 },
            ],
            expenses: [
                { name: 'Q1', value: 5000 },
                { name: 'Q2', value: 5500 },
                { name: 'Q3', value: 5200 },
                { name: 'Q4', value: 6000 },
            ],
        },
    };

    const chartData = data[period][category];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF66B2', '#66FF66'];

    const chartTitle = `${category.charAt(0).toUpperCase() + category.slice(1)} - ${period.charAt(0).toUpperCase() + period.slice(1)}`;

    // Custom label renderer for Pie chart
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius * 1.2;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const { name, value } = chartData[index];
        return (
            <text
                x={x}
                y={y}
                fill="#333"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
            >
                {`${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
            </text>
        );
    };

    const periodOptions = [
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
    ];

    const categoryOptions = period === 'year'
        ? [
            { value: 'sales', label: 'Sales' },
            { value: 'profit', label: 'Profit' },
        ]
        : [
            { value: 'sales', label: 'Sales' },
            { value: 'profit', label: 'Profit' },
            { value: 'expenses', label: 'Expenses' },
        ];

    const chartTypeOptions = [
        { value: 'line', label: 'Line' },
        { value: 'bar', label: 'Bar' },
        { value: 'pie', label: 'Pie' },
    ];

    return (
        <div className={styles.card}>
            <div className={styles.headerContainer}>
                <h2 className={styles.header}>{chartTitle}</h2>
            </div>
            <div className={styles.controlsContainer}>
                <CustomDropdown
                    options={periodOptions}
                    selected={period}
                    onChange={setPeriod}
                    placeholder="Select Period"
                />
                <CustomDropdown
                    options={categoryOptions}
                    selected={category}
                    onChange={setCategory}
                    placeholder="Select Category"
                />
                <CustomDropdown
                    options={chartTypeOptions}
                    selected={chartType}
                    onChange={setChartType}
                    placeholder="Select Chart Type"
                />
            </div>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={250}>
                    {chartType === 'line' && (
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={2} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={30} />
                        </LineChart>
                    )}
                    {chartType === 'bar' && (
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Bar dataKey="value" fill="#007bff" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={30} />
                        </BarChart>
                    )}
                    {chartType === 'pie' && (
                        <PieChart margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                label={renderCustomLabel}
                                labelLine={{ stroke: '#666', strokeWidth: 1 }}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: 12, paddingTop: 5 }} />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StaticStats;
