import { clsx, type ClassValue } from 'clsx';

// Lightweight cn utility without tailwind-merge for simplicity
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function getSeverityColor(
  severity: string
): { bg: string; text: string; dot: string } {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-critical/10',
        text: 'text-critical',
        dot: 'bg-critical',
      };
    case 'high':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        dot: 'bg-orange-400',
      };
    case 'medium':
      return {
        bg: 'bg-warning/10',
        text: 'text-warning',
        dot: 'bg-warning',
      };
    case 'low':
      return {
        bg: 'bg-success/10',
        text: 'text-success',
        dot: 'bg-success',
      };
    default:
      return {
        bg: 'bg-text-muted/10',
        text: 'text-text-secondary',
        dot: 'bg-text-secondary',
      };
  }
}

export function getRiskBadgeClass(risk: string): string {
  switch (risk) {
    case 'critical':
      return 'bg-critical/20 text-critical border-critical/30';
    case 'high':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'medium':
      return 'bg-warning/20 text-warning border-warning/30';
    case 'low':
      return 'bg-success/20 text-success border-success/30';
    default:
      return 'bg-navy-700/50 text-text-secondary border-navy-600/30';
  }
}
