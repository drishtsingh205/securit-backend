'use client';

import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import TrafficChart from '@/components/charts/TrafficChart';
import ThreatChart from '@/components/charts/ThreatChart';
import PrivacyScoreGauge from '@/components/charts/PrivacyScoreGauge';
import {
  MOCK_DASHBOARD_STATS,
  MOCK_TRAFFIC_DATA,
  MOCK_THREAT_DISTRIBUTION,
  MOCK_ALERTS,
} from '@/utils/mockData';
import {
  Activity,
  Shield,
  AlertTriangle,
  Wifi,
  ShieldCheck,
  Ban,
  Radio,
  Clock,
} from 'lucide-react';
import { formatRelativeTime, getSeverityColor } from '@/utils/helpers';

export default function DashboardPage() {
  const stats = MOCK_DASHBOARD_STATS;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Privacy Intelligence Overview
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Real-time monitoring of {stats.totalAppsMonitored} applications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-sm text-text-secondary focus:border-accent outline-none">
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Apps Monitored"
            value={stats.totalAppsMonitored}
            icon={<Shield className="w-5 h-5 text-accent" />}
            trend={{ value: 5, label: 'vs last week' }}
            subtitle="Active monitoring"
          />
          <StatsCard
            title="Active Connections"
            value={stats.activeConnections}
            icon={<Wifi className="w-5 h-5 text-success" />}
            trend={{ value: 12, label: 'vs yesterday' }}
            subtitle="Real-time tracking"
          />
          <StatsCard
            title="Alerts Today"
            value={stats.alertsToday}
            icon={<AlertTriangle className="w-5 h-5 text-warning" />}
            trend={{ value: -8, label: 'vs yesterday' }}
            subtitle={`${stats.criticalAlerts} critical`}
          />
          <StatsCard
            title="Data Leaks Blocked"
            value={stats.dataLeaksBlocked}
            icon={<Ban className="w-5 h-5 text-critical" />}
            trend={{ value: 23, label: 'this month' }}
            subtitle="Threats neutralized"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Chart */}
          <Card
            title="Network Traffic Analysis"
            subtitle="Inbound · Outbound · Blocked"
            icon={<Activity className="w-4 h-4 text-accent" />}
            className="lg:col-span-2"
          >
            <TrafficChart data={MOCK_TRAFFIC_DATA} />
          </Card>

          {/* Privacy Score */}
          <Card
            title="System Privacy Score"
            subtitle="Aggregate analysis"
            icon={<ShieldCheck className="w-4 h-4 text-accent" />}
          >
            <div className="flex flex-col items-center py-4">
              <PrivacyScoreGauge score={stats.privacyScore} />
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="text-center p-3 bg-navy-900/50 rounded-lg">
                  <p className="text-lg font-bold text-text-primary">
                    {stats.bandwidthAnalyzed}
                  </p>
                  <p className="text-xs text-text-muted">Analyzed</p>
                </div>
                <div className="text-center p-3 bg-navy-900/50 rounded-lg">
                  <p className="text-lg font-bold text-text-primary">
                    {stats.uptime}
                  </p>
                  <p className="text-xs text-text-muted">Uptime</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Threat Distribution */}
          <Card
            title="Threat Distribution"
            subtitle="By category and severity"
            icon={<Radio className="w-4 h-4 text-accent" />}
          >
            <ThreatChart data={MOCK_THREAT_DISTRIBUTION} />
          </Card>

          {/* Recent Alerts */}
          <Card
            title="Recent Alerts"
            subtitle={`${MOCK_ALERTS.filter((a) => a.status === 'active').length} active`}
            icon={<AlertTriangle className="w-4 h-4 text-warning" />}
            action={
              <a
                href="/alerts"
                className="text-xs text-accent hover:text-accent-hover transition-colors"
              >
                View All →
              </a>
            }
            noPadding
          >
            <div className="divide-y divide-navy-700/50">
              {MOCK_ALERTS.slice(0, 5).map((alert) => {
                const colors = getSeverityColor(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className="px-5 py-3 hover:bg-navy-700/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors.dot} ${
                          alert.severity === 'critical' ? 'animate-pulse' : ''
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {alert.title}
                          </p>
                          <Badge variant="risk" value={alert.severity} />
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 truncate">
                          {alert.source}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-muted flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
