'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TrafficDataPoint } from '@/types/dashboard';

interface TrafficChartProps {
  data: TrafficDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 shadow-lg">
        <p className="text-xs text-text-muted mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-text-secondary capitalize">{entry.name}:</span>
            <span className="text-text-primary font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrafficChart({ data }: TrafficChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis
          dataKey="timestamp"
          stroke="#64748B"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#64748B"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          iconType="circle"
          iconSize={8}
        />
        <Area
          type="monotone"
          dataKey="inbound"
          stroke="#38BDF8"
          fill="url(#inboundGrad)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="outbound"
          stroke="#22C55E"
          fill="url(#outboundGrad)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="blocked"
          stroke="#EF4444"
          fill="url(#blockedGrad)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
