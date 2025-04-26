import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

const barData = [
    { name: "Total Orders", value: 100 },
    { name: "Avg Profit", value: 20 },
    { name: "Conversion %", value: 5 },
];

const lineData = [
    { day: "Mon", profit: 100 },
    { day: "Tue", profit: 150 },
    { day: "Wed", profit: 80 },
    { day: "Thu", profit: 180 },
    { day: "Fri", profit: 120 },
    { day: "Sat", profit: 220 },
    { day: "Sun", profit: 90 },
];

const pieData = [
    { name: "Shop Income", value: 8000 },
    { name: "Dropshipping", value: 6000 },
    { name: "Other", value: 2000 },
];

const COLORS = ["#1a6fef", "#4caf50", "#ff9800"];

const RightSidebar: React.FC = () => {
    return (
        <div style={{ width: "100%" }}>
            <h3 style={{ marginBottom: "1rem" }}>📊 Statistics</h3>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1a6fef" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            <h4 style={{ margin: "1.5rem 0 0.5rem" }}>📈 Weekly Profit Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="profit" stroke="#4caf50" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>

            <h4 style={{ margin: "1.5rem 0 0.5rem" }}>🧁 Income Breakdown</h4>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RightSidebar;
