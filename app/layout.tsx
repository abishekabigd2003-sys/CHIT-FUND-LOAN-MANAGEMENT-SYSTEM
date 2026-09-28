import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Chit Fund & Loan Management System | Enterprise Dashboard',
  description: 'Production-ready financial management platform for Chit funds, Gold loans, Vehicle loans, and collections.',
  icons: {
    icon: '/images/loans/chit-loan-logo.png',
    apple: '/images/loans/chit-loan-logo.png',
  },
};

const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('chit_fund_theme');
      var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} min-h-screen bg-slate-50 dark:bg-[#090d16] font-sans antialiased text-slate-900 dark:text-slate-100 selection:bg-brand-100 selection:text-brand-900 dark:selection:bg-brand-950 dark:selection:text-brand-200 transition-colors duration-150`}
      >
        <QueryProvider>
          <ThemeProvider defaultTheme="system">
            <ToastProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
