import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function Card({
  title,
  subtitle,
  icon,
  action,
  children,
  className = '',
  noPadding = false,
}: CardProps) {
  return (
    <div
      className={`bg-navy-800 border border-navy-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-navy-600/50 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700/50">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-semibold text-text-primary">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}
