import React from 'react';

const PeriodDropdown: React.FC<{ period: string, setPeriod: React.Dispatch<React.SetStateAction<string>> }> = ({ period, setPeriod }) => (
    <select value={period} onChange={(e) => setPeriod(e.target.value)} className="dropdown">
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
    </select>
);

export default PeriodDropdown;
