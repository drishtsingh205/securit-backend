'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import TrafficChart from '@/components/charts/TrafficChart';
import PrivacyScoreGauge from '@/components/charts/PrivacyScoreGauge';
import { MOCK_APPS, MOCK_TRAFFIC_DATA } from '@/utils/mockData';
import {
  ArrowLeft,
  AppWindow,
  Shield,
  Wifi,
  Database,
  Clock,
  Globe,
  Lock,
  Unlock,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

const MOCK_CONNECTIONS = [
  { id: '1', timestamp: '2026-03-10T23:12:00Z', destination: 'analytics.tracker.io', protocol: 'HTTPS', port: 443, bytesTransferred: 24560, status: 'flagged' as const, encrypted: true },
  { id: '2', timestamp: '2026-03-10T23:10:00Z', destination: 'api.socialconnect.com', protocol: 'HTTPS', port: 443, bytesTransferred: 128000, status: 'allowed' as const, encrypted: true },
  { id: '3', timestamp: '2026-03-10T23:08:00Z', destination: 'ads.network.com', protocol: 'HTTP', port: 80, bytesTransferred: 8900, status: 'blocked' as const, encrypted: false },
  { id: '4', timestamp: '2026-03-10T23:05:00Z', destination: 'cdn.provider.net', protocol: 'HTTPS', port: 443, bytesTransferred: 456000, status: 'allowed' as const, encrypted: true },
  { id: '5', timestamp: '2026-03-10T23:02:00Z', destination: 'telemetry.service.io', protocol: 'HTTPS', port: 443, bytesTransferred: 12400, status: 'flagged' as const, encrypted: true },
];

const MOCK_TRACKERS = [
  'analytics.google.com',
  'graph.facebook.com',
  'ads.doubleclick.net',
  'tracker.adjust.com',
  'api.branch.io',
];

const MOCK_DATA_CATEGORIES = [
  { category: 'Location Data', percentage: 35 },
  { category: 'Device Info', percentage: 25 },
  { category: 'Usage Data', percentage: 20 },
  { category: 'Contact Info', percentage: 12 },
  { category: 'Identifiers', percentage: 8 },
];

export default function AppDetailPage() {
  const params = useParams();
  const packageName = params.package as string;

  const app = MOCK_APPS.find(
    (a) => a.packageName === decodeURIComponent(packageName)
  );

  if (!app) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <AppWindow className="w-16 h-16 text-text-muted mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Application Not Found
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            Package: {decodeURIComponent(packageName)}
          </p>
          <Link
            href="/apps"
            className="text-accent hover:text-accent-hover transition-colors text-sm"
          >
            ← Back to Applications
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back & Header */}
        <div>
          <Link
            href="/apps"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Applications
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center">
                <AppWindow className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {app.appName}
                </h1>
                <p className="text-sm text-text-muted font-mono">
                  {app.packageName}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="risk" value={app.riskLevel} />
                  <Badge variant="status" value={app.status} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-4 text-center">
            <Shield className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-xl font-bold text-text-primary">{app.privacyScore}</p>
            <p className="text-xs text-text-muted">Privacy Score</p>
          </div>
          <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-4 text-center">
            <Wifi className="w-5 h-5 text-success mx-auto mb-2" />
            <p className="text-xl font-bold text-text-primary">{app.connectionsToday}</p>
            <p className="text-xs text-text-muted">Connections Today</p>
          </div>
          <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-4 text-center">
            <Database className="w-5 h-5 text-warning mx-auto mb-2" />
            <p className="text-xl font-bold text-text-primary">{app.dataTransferred}</p>
            <p className="text-xs text-text-muted">Data Transferred</p>
          </div>
          <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-4 text-center">
            <AlertTriangle className="w-5 h-5 text-critical mx-auto mb-2" />
            <p className="text-xl font-bold text-text-primary">{app.permissions.length}</p>
            <p className="text-xs text-text-muted">Permissions</p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Chart */}
          <Card
            title="Traffic Pattern"
            subtitle="24-hour activity"
            icon={<Activity className="w-4 h-4 text-accent" />}
            className="lg:col-span-2"
          >
            <TrafficChart data={MOCK_TRAFFIC_DATA} />
          </Card>

          {/* Privacy Score & Data Categories */}
          <div className="space-y-6">
            <Card title="Privacy Analysis" icon={<Shield className="w-4 h-4 text-accent" />}>
              <div className="flex justify-center py-2">
                <PrivacyScoreGauge score={app.privacyScore} size={150} />
              </div>
            </Card>

            <Card title="Data Categories" icon={<Database className="w-4 h-4 text-accent" />}>
              <div className="space-y-3">
                {MOCK_DATA_CATEGORIES.map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-secondary">{cat.category}</span>
                      <span className="text-text-primary font-medium">{cat.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-700"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Connection Logs & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connection Logs */}
          <Card
            title="Recent Connections"
            subtitle="Latest network activity"
            icon={<Globe className="w-4 h-4 text-accent" />}
            className="lg:col-span-2"
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-700/50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Destination</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Protocol</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Encrypted</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Bytes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/30">
                  {MOCK_CONNECTIONS.map((conn) => (
                    <tr
                      key={conn.id}
                      className="hover:bg-navy-700/20 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="text-text-primary font-mono text-xs">
                          {conn.destination}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-text-secondary text-xs">{conn.protocol}:{conn.port}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant="status" value={conn.status} />
                      </td>
                      <td className="px-5 py-3">
                        {conn.encrypted ? (
                          <Lock className="w-4 h-4 text-success" />
                        ) : (
                          <Unlock className="w-4 h-4 text-critical" />
                        )}
                      </td>
                      <td className="px-5 py-3 text-right text-text-secondary text-xs font-mono">
                        {(conn.bytesTransferred / 1024).toFixed(1)} KB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Tracker Domains & Permissions */}
          <div className="space-y-6">
            <Card
              title="Tracker Domains"
              subtitle={`${MOCK_TRACKERS.length} detected`}
              icon={<Globe className="w-4 h-4 text-warning" />}
            >
              <div className="space-y-2">
                {MOCK_TRACKERS.map((domain) => (
                  <div
                    key={domain}
                    className="flex items-center gap-2 px-3 py-2 bg-navy-900/50 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 bg-warning rounded-full" />
                    <span className="text-xs text-text-secondary font-mono truncate">
                      {domain}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Permissions"
              subtitle={`${app.permissions.length} granted`}
              icon={<Shield className="w-4 h-4 text-accent" />}
            >
              <div className="flex flex-wrap gap-2">
                {app.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="text-xs bg-navy-900/50 border border-navy-700/50 text-text-secondary px-2.5 py-1 rounded-full"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
