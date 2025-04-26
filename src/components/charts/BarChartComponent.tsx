import React from 'react';
import { BarChart, Bar, Tooltip } from 'recharts';

const BarChartComponent: React.FC<{ data: any[] }> = ({ data }) => (
    <BarChart data={data}>
        <Bar dataKey="value" fill="#007bff" />
        <Tooltip />
    </BarChart>
);

export default BarChartComponent;
