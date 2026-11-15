import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/dm-sans';
import CursorGlow from '@/components/CursorGlow';
import './globals.css';

export const metadata: Metadata = {
  title: 'Milestone OS',
  description: 'Manage mentees, sessions, meetings, and payments.',
};

export const viewport: Viewport = { themeColor: '#f5f5f7' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" style={{ '--font-milestone': '"DM Sans Variable"' } as React.CSSProperties}>
    <body suppressHydrationWarning>{children}<CursorGlow /></body>
  </html>;
}
