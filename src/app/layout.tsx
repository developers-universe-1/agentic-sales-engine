import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'MCP Sales Agent — MCP-Native Sales Intelligence',
  description: 'Open-source AI agent that reads sales calls, updates your pipeline, drafts follow-ups, and coaches your reps.',
  openGraph: {
    title: 'MCP Sales Agent — MCP-Native Sales Intelligence',
    description: 'MCP-native sales intelligence framework. Orchestrate CRM, call recorders, and email through a unified Model Context Protocol layer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCP Sales Agent — MCP-Native Sales Intelligence',
    description: 'MCP-native sales intelligence framework. Orchestrate CRM, call recorders, and email through a unified Model Context Protocol layer.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#e4e4e7',
              border: '1px solid #27272a',
            },
          }}
        />
      </body>
    </html>
  )
}
