'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  AppWindow,
  AlertTriangle,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Eye,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/apps', label: 'Applications', icon: AppWindow },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggle, closeMobile } = useSidebar();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-navy-900 text-text-primary overflow-hidden">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col
          bg-navy-800 border-r border-navy-700/50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[72px]' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-navy-700/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-accent" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h1 className="text-sm font-bold tracking-wider text-accent">
                  PRIVACYLENS
                </h1>
                <p className="text-[10px] text-text-muted tracking-widest uppercase">
                  Privacy Intelligence
                </p>
              </div>
            )}
          </div>
          <button
            onClick={toggle}
            className="ml-auto text-text-secondary hover:text-text-primary transition-colors hidden lg:block"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={closeMobile}
            className="ml-auto text-text-secondary hover:text-text-primary transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 group relative
                  ${
                    isActive
                      ? 'bg-accent/10 text-accent shadow-glow'
                      : 'text-text-secondary hover:bg-navy-700/50 hover:text-text-primary'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r" />
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-accent' : ''}`} />
                {!isCollapsed && (
                  <span className="text-sm font-medium truncate animate-fade-in">
                    {item.label}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-navy-700 text-text-primary text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-navy-700/50 p-3">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-accent" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-medium truncate">
                  {user?.name || 'Analyst'}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.role || 'admin'}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={logout}
                className="text-text-muted hover:text-critical transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-navy-700/50 bg-navy-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              className="text-text-secondary hover:text-text-primary transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold capitalize">
                {pathname?.split('/').pop() || 'Dashboard'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow" />
              <span className="text-text-secondary">System Online</span>
            </div>
            <div className="text-xs text-text-muted font-mono">
              v1.0.0
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-grid-pattern bg-grid">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
