'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ThreatDistribution } from '@/types/dashboard';

interface ThreatChartProps {
  data: ThreatDistribution[];
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#22C55E',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 shadow-lg">
        <p className="text-xs text-text-primary font-medium mb-1">
          {data.category}
        </p>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-secondary">Count:</span>
          <span className="text-text-primary font-medium">{data.count}</span>
        </div>
        <div className="flex items-center gap-2 text-xs mt-1">
          <span className="text-text-secondary">Severity:</span>
          <span
            className="font-medium capitalize"
            style={{ color: SEVERITY_COLORS[data.severity] }}
          >
            {data.severity}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function ThreatChart({ data }: ThreatChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        layout="vertical"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#334155"
          horizontal={false}
        />
        <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          dataKey="category"
          type="category"
          stroke="#64748B"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={SEVERITY_COLORS[entry.severity]}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
