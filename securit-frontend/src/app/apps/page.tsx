'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { MOCK_APPS } from '@/utils/mockData';
import {
  Search,
  Filter,
  AppWindow,
  ArrowUpDown,
  ExternalLink,
  Wifi,
  Database,
  Clock,
} from 'lucide-react';
import { formatRelativeTime } from '@/utils/helpers';

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('risk');

  const filteredApps = MOCK_APPS
    .filter((app) => {
      const matchesSearch =
        app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'all' || app.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'risk':
          const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return (
            riskOrder[a.riskLevel as keyof typeof riskOrder] -
            riskOrder[b.riskLevel as keyof typeof riskOrder]
          );
        case 'connections':
          return b.connectionsToday - a.connectionsToday;
        case 'score':
          return a.privacyScore - b.privacyScore;
        case 'name':
          return a.appName.localeCompare(b.appName);
        default:
          return 0;
      }
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Monitored Applications
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {MOCK_APPS.length} applications under surveillance
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by app name or package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-8 py-2.5 text-sm text-text-secondary focus:border-accent outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Risks</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-8 py-2.5 text-sm text-text-secondary focus:border-accent outline-none appearance-none cursor-pointer"
              >
                <option value="risk">Sort by Risk</option>
                <option value="connections">Sort by Connections</option>
                <option value="score">Sort by Privacy Score</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <Link href={`/apps/${app.packageName}`} key={app.id}>
              <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-5 hover:border-accent/30 transition-all duration-300 group cursor-pointer h-full">
                {/* App Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <AppWindow className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {app.appName}
                      </h3>
                      <p className="text-xs text-text-muted font-mono">
                        {app.packageName}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="risk" value={app.riskLevel} />
                  <Badge variant="status" value={app.status} />
                </div>

                {/* Privacy Score Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-secondary">Privacy Score</span>
                    <span
                      className={`font-medium ${
                        app.privacyScore >= 80
                          ? 'text-success'
                          : app.privacyScore >= 60
                          ? 'text-warning'
                          : app.privacyScore >= 40
                          ? 'text-orange-400'
                          : 'text-critical'
                      }`}
                    >
                      {app.privacyScore}/100
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        app.privacyScore >= 80
                          ? 'bg-success'
                          : app.privacyScore >= 60
                          ? 'bg-warning'
                          : app.privacyScore >= 40
                          ? 'bg-orange-400'
                          : 'bg-critical'
                      }`}
                      style={{ width: `${app.privacyScore}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-navy-900/50 rounded-lg">
                    <Wifi className="w-3.5 h-3.5 text-text-muted mx-auto mb-1" />
                    <p className="text-sm font-semibold text-text-primary">
                      {app.connectionsToday}
                    </p>
                    <p className="text-[10px] text-text-muted">Connections</p>
                  </div>
                  <div className="text-center p-2 bg-navy-900/50 rounded-lg">
                    <Database className="w-3.5 h-3.5 text-text-muted mx-auto mb-1" />
                    <p className="text-sm font-semibold text-text-primary">
                      {app.dataTransferred}
                    </p>
                    <p className="text-[10px] text-text-muted">Data</p>
                  </div>
                  <div className="text-center p-2 bg-navy-900/50 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-text-muted mx-auto mb-1" />
                    <p className="text-sm font-semibold text-text-primary">
                      {formatRelativeTime(app.lastActivity)}
                    </p>
                    <p className="text-[10px] text-text-muted">Last Active</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <AppWindow className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No applications found
              </h3>
              <p className="text-sm text-text-secondary">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
