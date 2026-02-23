import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SecuRock | AI-Powered SOCaaS',
  description: 'Enterprise-grade cybersecurity monitoring, detection, and incident response platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-transparent text-foreground overflow-x-hidden antialiased`}>
        {children}
      </body>
    </html>
  )
}
