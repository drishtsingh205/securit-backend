'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { MOCK_ALERTS } from '@/utils/mockData';
import {
  AlertTriangle,
  Search,
  Filter,
  Clock,
  ChevronRight,
  Bell,
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatRelativeTime, getSeverityColor } from '@/utils/helpers';

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAlerts = MOCK_ALERTS.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus =
      statusFilter === 'all' || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const alertCounts = {
    total: MOCK_ALERTS.length,
    critical: MOCK_ALERTS.filter((a) => a.severity === 'critical').length,
    high: MOCK_ALERTS.filter((a) => a.severity === 'high').length,
    medium: MOCK_ALERTS.filter((a) => a.severity === 'medium').length,
    low: MOCK_ALERTS.filter((a) => a.severity === 'low').length,
    active: MOCK_ALERTS.filter((a) => a.status === 'active').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Security Alerts
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {alertCounts.active} active alerts · {alertCounts.critical} critical
          </p>
        </div>

        {/* Alert Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total', count: alertCounts.total, color: 'text-text-primary', bgColor: 'bg-navy-700/30' },
            { label: 'Critical', count: alertCounts.critical, color: 'text-critical', bgColor: 'bg-critical/10' },
            { label: 'High', count: alertCounts.high, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
            { label: 'Medium', count: alertCounts.medium, color: 'text-warning', bgColor: 'bg-warning/10' },
            { label: 'Low', count: alertCounts.low, color: 'text-success', bgColor: 'bg-success/10' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() =>
                setSeverityFilter(
                  item.label === 'Total' ? 'all' : item.label.toLowerCase()
                )
              }
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                (severityFilter === 'all' && item.label === 'Total') ||
                severityFilter === item.label.toLowerCase()
                  ? `${item.bgColor} border-current`
                  : 'bg-navy-800 border-navy-700/50 hover:border-navy-600'
              }`}
            >
              <span className="text-xs text-text-secondary">{item.label}</span>
              <span className={`text-lg font-bold ${item.color}`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-8 py-2.5 text-sm text-text-secondary focus:border-accent outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="dismissed">Dismissed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert, index) => {
            const colors = getSeverityColor(alert.severity);
            return (
              <div
                key={alert.id}
                className="bg-navy-800 border border-navy-700/50 rounded-xl p-5 hover:border-navy-600/50 transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Severity indicator */}
                  <div
                    className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <ShieldAlert className={`w-5 h-5 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-sm font-semibold text-text-primary">
                        {alert.title}
                      </h3>
                      <Badge variant="risk" value={alert.severity} />
                      <Badge variant="status" value={alert.status} />
                    </div>
                    <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                        <Bell className="w-3 h-3" />
                        {alert.source}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(alert.timestamp)}
                      </span>
                      {alert.packageName && (
                        <span className="text-xs text-text-muted font-mono bg-navy-900/50 px-2 py-0.5 rounded">
                          {alert.packageName}
                        </span>
                      )}
                      <span className="text-xs text-text-muted bg-navy-900/50 px-2 py-0.5 rounded">
                        {alert.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {alert.status === 'active' && (
                      <>
                        <button
                          className="p-2 rounded-lg hover:bg-success/10 text-text-muted hover:text-success transition-all"
                          title="Resolve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-navy-700 text-text-muted hover:text-text-primary transition-all"
                          title="Dismiss"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button className="p-2 rounded-lg hover:bg-navy-700 text-text-muted hover:text-text-primary transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAlerts.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  No alerts found
                </h3>
                <p className="text-sm text-text-secondary">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
