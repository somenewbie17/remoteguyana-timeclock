import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RemoteGuyana Timeclock',
  description: 'Minimal timeclock for RemoteGuyana'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-text">
        {children}
      </body>
    </html>
  )
}
