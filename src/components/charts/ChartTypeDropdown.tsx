import React from 'react';

const ChartTypeDropdown: React.FC<{ chartType: string, setChartType: React.Dispatch<React.SetStateAction<string>> }> = ({ chartType, setChartType }) => (
    <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="dropdown">
        <option value="line">Line Chart</option>
        <option value="bar">Bar Chart</option>
        <option value="pie">Pie Chart</option>
    </select>
);

export default ChartTypeDropdown;
