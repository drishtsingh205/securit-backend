import React from 'react';
import { getRiskBadgeClass } from '@/utils/helpers';

interface BadgeProps {
  variant?: 'default' | 'risk' | 'status';
  value: string;
  className?: string;
}

export default function Badge({
  variant = 'default',
  value,
  className = '',
}: BadgeProps) {
  const baseClass =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border';

  if (variant === 'risk') {
    return (
      <span className={`${baseClass} ${getRiskBadgeClass(value)} ${className}`}>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            value === 'critical'
              ? 'bg-critical animate-pulse'
              : value === 'high'
              ? 'bg-orange-400'
              : value === 'medium'
              ? 'bg-warning'
              : 'bg-success'
          }`}
        />
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    );
  }

  if (variant === 'status') {
    const statusColors: Record<string, string> = {
      active: 'bg-success/20 text-success border-success/30',
      inactive: 'bg-text-muted/20 text-text-muted border-text-muted/30',
      blocked: 'bg-critical/20 text-critical border-critical/30',
      generating: 'bg-accent/20 text-accent border-accent/30',
      completed: 'bg-success/20 text-success border-success/30',
      failed: 'bg-critical/20 text-critical border-critical/30',
      dismissed: 'bg-text-muted/20 text-text-muted border-text-muted/30',
      resolved: 'bg-success/20 text-success border-success/30',
    };
    return (
      <span
        className={`${baseClass} ${statusColors[value] || statusColors['inactive']} ${className}`}
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    );
  }

  return (
    <span
      className={`${baseClass} bg-navy-700/50 text-text-secondary border-navy-600/30 ${className}`}
    >
      {value}
    </span>
  );
}
