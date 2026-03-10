import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  accentColor?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'accent',
  className = '',
}: StatsCardProps) {
  return (
    <div
      className={`bg-navy-800 border border-navy-700/50 rounded-xl p-5 hover:border-${accentColor}/30 transition-all duration-300 group ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-lg bg-${accentColor}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend.value >= 0
                ? 'bg-success/10 text-success'
                : 'bg-critical/10 text-critical'
            }`}
          >
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-1">{value}</h3>
      <p className="text-sm text-text-secondary">{title}</p>
      {subtitle && (
        <p className="text-xs text-text-muted mt-1">{subtitle}</p>
      )}
    </div>
  );
}
