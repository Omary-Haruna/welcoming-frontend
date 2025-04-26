import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF66B2', '#66FF66'];

const PieChartComponent: React.FC<{ data: any[] }> = ({ data }) => (
    <PieChart>
        <Pie data={data} dataKey="value" outerRadius={60} fill="#007bff">
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        <Tooltip />
    </PieChart>
);

export default PieChartComponent;
