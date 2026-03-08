import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Atlas Synapse | Trust Engine for AI Systems',
  description: 'Atlas Synapse is the trust layer for agentic AI — governance, verification, and auditability at the boundaries of your AI systems.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="text-slate-100 antialiased">
        <Suspense fallback={null}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
