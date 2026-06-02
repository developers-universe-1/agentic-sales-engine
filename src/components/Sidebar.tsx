'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Phone,
  BarChart3,
  Mail,
  Users,
  TrendingUp,
  FileText,
  LayoutDashboard,
  Activity,
  Skull,
  Plug,
} from 'lucide-react'

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/calls', label: 'Call Intelligence', icon: Phone },
  { href: '/dashboard/pipeline', label: 'Pipeline', icon: BarChart3 },
  { href: '/dashboard/loss-autopsy', label: 'Loss Autopsy', icon: Skull },
  { href: '/dashboard/followups', label: 'Follow-ups', icon: Mail },
  { href: '/dashboard/briefs', label: 'Pre-Call Briefs', icon: FileText },
  { href: '/dashboard/coaching', label: 'Coaching', icon: Users },
  { href: '/dashboard/benchmarks', label: 'Benchmarks', icon: TrendingUp },
  { href: '/dashboard/integrations', label: 'Integrations', icon: Plug },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-brand-500" />
          <span className="font-bold text-lg tracking-tight">MCP Sales Agent</span>
        </Link>
        <p className="text-xs text-zinc-500 mt-1">Open-source sales AI</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="bg-zinc-800/50 rounded-lg p-3">
          <p className="text-xs font-medium text-zinc-300">Demo Mode</p>
          <p className="text-xs text-zinc-500 mt-0.5">Mock data — no API keys needed</p>
        </div>
      </div>
    </aside>
  )
}
