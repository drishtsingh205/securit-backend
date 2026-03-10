import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import QueryProvider from '@/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'PRIVACYLENS — Real-Time Behavioral Privacy Intelligence',
  description:
    'Enterprise cybersecurity dashboard for real-time behavioral privacy intelligence and network traffic analysis.',
  keywords: ['privacy', 'cybersecurity', 'network analysis', 'dashboard'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-900 text-text-primary antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
