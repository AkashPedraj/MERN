// F:\mern-challenge-frontend\src\pages\BarChart.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartData {
  range: string;
  count: number;
}

interface CustomBarChartProps {
  data: BarChartData[];
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="range" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

export default CustomBarChart;
