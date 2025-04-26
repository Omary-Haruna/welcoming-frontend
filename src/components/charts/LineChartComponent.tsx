import React from 'react';
import { LineChart, Line, Tooltip } from 'recharts';

const LineChartComponent: React.FC<{ data: any[] }> = ({ data }) => (
    <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={2} />
        <Tooltip />
    </LineChart>
);

export default LineChartComponent;
