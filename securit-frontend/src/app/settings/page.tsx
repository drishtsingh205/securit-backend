'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Card from '@/components/ui/Card';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Database,
  Key,
  Monitor,
  Save,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  User,
  Lock,
} from 'lucide-react';

interface SettingToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function SettingToggle({ label, description, enabled, onToggle }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      <button onClick={onToggle} className="flex-shrink-0 ml-4">
        {enabled ? (
          <ToggleRight className="w-8 h-8 text-accent" />
        ) : (
          <ToggleLeft className="w-8 h-8 text-text-muted" />
        )}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    realTimeMonitoring: true,
    autoBlock: false,
    notifications: true,
    emailAlerts: true,
    criticalOnly: false,
    darkMode: true,
    compactView: false,
    autoRefresh: true,
    dataRetention: '90',
    refreshInterval: '30',
    apiUrl: 'https://api.privacylens.io/v1',
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const settingSections = [
    {
      title: 'Monitoring',
      icon: <Monitor className="w-4 h-4 text-accent" />,
      items: [
        {
          key: 'realTimeMonitoring' as const,
          label: 'Real-Time Monitoring',
          description: 'Continuously monitor all application network traffic',
        },
        {
          key: 'autoBlock' as const,
          label: 'Auto-Block Threats',
          description: 'Automatically block detected privacy threats',
        },
        {
          key: 'autoRefresh' as const,
          label: 'Auto-Refresh Dashboard',
          description: 'Automatically refresh dashboard data at set intervals',
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-4 h-4 text-accent" />,
      items: [
        {
          key: 'notifications' as const,
          label: 'Push Notifications',
          description: 'Receive browser push notifications for alerts',
        },
        {
          key: 'emailAlerts' as const,
          label: 'Email Alerts',
          description: 'Send email notifications for security events',
        },
        {
          key: 'criticalOnly' as const,
          label: 'Critical Alerts Only',
          description: 'Only notify for critical severity alerts',
        },
      ],
    },
    {
      title: 'Display',
      icon: <Monitor className="w-4 h-4 text-accent" />,
      items: [
        {
          key: 'darkMode' as const,
          label: 'Dark Mode',
          description: 'Use dark color scheme for the dashboard',
        },
        {
          key: 'compactView' as const,
          label: 'Compact View',
          description: 'Reduce spacing and card padding for denser layout',
        },
      ],
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-sm text-text-secondary mt-1">
            Configure your PRIVACYLENS dashboard preferences
          </p>
        </div>

        {/* Toggle Settings */}
        {settingSections.map((section) => (
          <Card
            key={section.title}
            title={section.title}
            icon={section.icon}
          >
            <div className="divide-y divide-navy-700/30">
              {section.items.map((item) => (
                <SettingToggle
                  key={item.key}
                  label={item.label}
                  description={item.description}
                  enabled={settings[item.key] as boolean}
                  onToggle={() => toggleSetting(item.key)}
                />
              ))}
            </div>
          </Card>
        ))}

        {/* API Configuration */}
        <Card
          title="API Configuration"
          icon={<Globe className="w-4 h-4 text-accent" />}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2">
                API Base URL
              </label>
              <input
                type="text"
                value={settings.apiUrl}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, apiUrl: e.target.value }))
                }
                className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-text-primary font-mono focus:border-accent outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-2">
                  Data Retention (days)
                </label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      dataRetention: e.target.value,
                    }))
                  }
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-text-secondary focus:border-accent outline-none appearance-none cursor-pointer"
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">365 days</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-2">
                  Refresh Interval (seconds)
                </label>
                <select
                  value={settings.refreshInterval}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      refreshInterval: e.target.value,
                    }))
                  }
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-text-secondary focus:border-accent outline-none appearance-none cursor-pointer"
                >
                  <option value="10">10 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                  <option value="300">5 minutes</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Account & Security */}
        <Card
          title="Account & Security"
          icon={<Lock className="w-4 h-4 text-accent" />}
          noPadding
        >
          <div className="divide-y divide-navy-700/30">
            {[
              {
                icon: <User className="w-4 h-4" />,
                label: 'Profile Settings',
                desc: 'Update your name, email, and avatar',
              },
              {
                icon: <Key className="w-4 h-4" />,
                label: 'Change Password',
                desc: 'Update your authentication password',
              },
              {
                icon: <Shield className="w-4 h-4" />,
                label: 'Two-Factor Authentication',
                desc: 'Add an extra layer of security',
              },
              {
                icon: <Database className="w-4 h-4" />,
                label: 'Export Data',
                desc: 'Download all your monitoring data',
              },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-navy-700/20 transition-colors group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-navy-900/50 flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {item.label}
                  </p>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />
              </button>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-6">
          <button className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-navy-900 font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button className="inline-flex items-center gap-2 bg-navy-800 border border-navy-700 hover:border-navy-600 text-text-secondary hover:text-text-primary font-medium px-5 py-2.5 rounded-lg transition-all text-sm">
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
