import { useTheme } from '@mui/material';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'T1',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'T2',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'T3',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'T4',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'T5',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'T6',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'T7',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'T8',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'T9',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'T10',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'T11',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'T12',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function ChartData() {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          style={{
            fontSize: 13,
            fontWeight: 400,
            fontFamily: 'Roboto, sans-serif',
            color: theme.palette.primary.light,
          }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          style={{
            fontSize: 13,
            fontWeight: 400,
            fontFamily: 'Roboto, sans-serif',
            color: theme.palette.primary.light,
          }}
        />
        <Bar dataKey="pv" fill="#D9F8FC" />
        <Bar dataKey="uv" fill="#001D6E" />
      </BarChart>
    </ResponsiveContainer>
  );
}
