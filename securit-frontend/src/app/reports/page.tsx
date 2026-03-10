'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { MOCK_REPORTS } from '@/utils/mockData';
import {
  FileText,
  Download,
  Plus,
  Clock,
  FileCheck,
  FileClock,
  FileWarning,
  Shield,
  Activity,
  AlertTriangle,
  ClipboardCheck,
  Loader2,
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';

const REPORT_TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  privacy_audit: {
    label: 'Privacy Audit',
    icon: <Shield className="w-4 h-4" />,
    color: 'text-accent',
  },
  traffic_analysis: {
    label: 'Traffic Analysis',
    icon: <Activity className="w-4 h-4" />,
    color: 'text-success',
  },
  threat_assessment: {
    label: 'Threat Assessment',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-warning',
  },
  compliance: {
    label: 'Compliance',
    icon: <ClipboardCheck className="w-4 h-4" />,
    color: 'text-purple-400',
  },
};

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const completedReports = MOCK_REPORTS.filter(
    (r) => r.status === 'completed'
  );
  const pendingReports = MOCK_REPORTS.filter(
    (r) => r.status === 'generating'
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Reports</h1>
            <p className="text-sm text-text-secondary mt-1">
              {completedReports.length} completed · {pendingReports.length}{' '}
              generating
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 text-sm disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
        </div>

        {/* Report Type Quick Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(REPORT_TYPE_CONFIG).map(([key, config]) => {
            const count = MOCK_REPORTS.filter((r) => r.type === key).length;
            return (
              <div
                key={key}
                className="bg-navy-800 border border-navy-700/50 rounded-xl p-4 hover:border-navy-600/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`${config.color}`}>{config.icon}</div>
                  <div>
                    <p className="text-xs text-text-secondary">
                      {config.label}
                    </p>
                    <p className="text-lg font-bold text-text-primary">
                      {count}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Generating Reports */}
        {pendingReports.length > 0 && (
          <Card
            title="In Progress"
            icon={<FileClock className="w-4 h-4 text-accent" />}
          >
            <div className="space-y-3">
              {pendingReports.map((report) => {
                const typeConfig = REPORT_TYPE_CONFIG[report.type];
                return (
                  <div
                    key={report.id}
                    className="flex items-center gap-4 p-4 bg-navy-900/50 rounded-lg border border-navy-700/30"
                  >
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-accent animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-text-primary">
                        {report.title}
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5">
                        {report.summary}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs ${typeConfig?.color}`}>
                          {typeConfig?.label}
                        </span>
                        <span className="text-xs text-text-muted">
                          Started {formatDate(report.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Badge variant="status" value={report.status} />
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Completed Reports */}
        <Card
          title="Completed Reports"
          subtitle={`${completedReports.length} reports available`}
          icon={<FileCheck className="w-4 h-4 text-success" />}
          noPadding
        >
          <div className="divide-y divide-navy-700/30">
            {completedReports.map((report, index) => {
              const typeConfig = REPORT_TYPE_CONFIG[report.type];
              return (
                <div
                  key={report.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-navy-700/20 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center bg-navy-900/50`}
                  >
                    <FileText className={`w-5 h-5 ${typeConfig?.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-text-primary">
                      {report.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                      {report.summary}
                    </p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className={`text-xs ${typeConfig?.color}`}>
                        {typeConfig?.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                        <Clock className="w-3 h-3" />
                        {formatDate(report.completedAt || report.createdAt)}
                      </span>
                      {report.fileSize && (
                        <span className="text-xs text-text-muted">
                          {report.fileSize}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="status" value={report.status} />
                    <button className="p-2 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
