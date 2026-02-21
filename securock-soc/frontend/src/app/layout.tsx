import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SecuRock AI SOCaaS',
  description: 'AI-Powered Autonomous SOC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <h1 className="text-xl font-bold tracking-tight text-primary">SecuRock SOC</h1>
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary rounded-full">Autonomous Mode</span>
              <span className="text-sm text-muted-foreground">Admin</span>
            </div>
          </header>
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
