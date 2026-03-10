'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

interface PrivacyScoreGaugeProps {
  score: number;
  size?: number;
}

export default function PrivacyScoreGauge({
  score,
  size = 180,
}: PrivacyScoreGaugeProps) {
  const getColor = (s: number) => {
    if (s >= 80) return '#22C55E';
    if (s >= 60) return '#F59E0B';
    if (s >= 40) return '#F97316';
    return '#EF4444';
  };

  const getLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Poor';
  };

  const color = getColor(score);
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  return (
    <div className="relative flex flex-col items-center">
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.42}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="#1E293B" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-text-muted mt-1">/ 100</span>
      </div>
      <p className="text-sm font-medium mt-2" style={{ color }}>
        {getLabel(score)}
      </p>
      <p className="text-xs text-text-muted">Privacy Score</p>
    </div>
  );
}
