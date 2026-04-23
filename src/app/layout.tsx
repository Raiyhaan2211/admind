import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AdMind — Unified Ad Intelligence',
  description: 'Cross-platform ad performance dashboard for performance marketers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
