import Link from 'next/link'
import {
  Phone,
  BarChart3,
  Mail,
  Users,
  TrendingUp,
  FileText,
  Activity,
  ArrowRight,
  Code2,
  CheckCircle2,
  Plug,
  Zap,
  Shield,
} from 'lucide-react'

const features = [
  {
    icon: Phone,
    title: 'Call Intelligence',
    desc: 'Ingests recordings from Gong, Fathom, Fireflies, or Otter. Extracts sentiment, objections, next steps, and talk-time ratios.',
  },
  {
    icon: BarChart3,
    title: 'Auto Pipeline',
    desc: 'Infers deal stage from call content and pushes updates to Salesforce or HubSpot. Managers override with drag-to-pin.',
  },
  {
    icon: Mail,
    title: 'AI Follow-ups',
    desc: 'Drafted post-call from actual conversation content. Sent from Gmail or Outlook. Pauses sequences on reply.',
  },
  {
    icon: FileText,
    title: 'Pre-Call Briefs',
    desc: 'Reads Google Calendar or Outlook every morning. Surfaces 60-second prep: last call summary, open commitments, and winning patterns.',
  },
  {
    icon: Users,
    title: 'Rep Coaching',
    desc: 'Per-position scorecards with talk-time ratios, objection-resolution rates, and side-by-side comparisons. Coach the gap.',
  },
  {
    icon: TrendingUp,
    title: 'Benchmarks',
    desc: 'Your funnel plotted against comparable orgs across 28 industry segments. Know whether 38% is actually good.',
  },
]

const integrations = [
  { category: 'Call Recorders', items: ['Gong', 'Fathom', 'Fireflies', 'Otter'] },
  { category: 'CRM', items: ['Salesforce', 'HubSpot'] },
  { category: 'Mailbox & Calendar', items: ['Gmail', 'Outlook', 'Google Calendar'] },
  { category: 'Notifications', items: ['Slack'] },
]

const tech = [
  'Next.js 15 App Router',
  'TypeScript',
  'Tailwind CSS',
  'OpenAI GPT-4o',
  'Zod structured output',
  'Prisma ORM',
  'Recharts',
  'Framer Motion',
  'Jest',
]

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-zinc-950 to-zinc-950" />
        <div className="max-w-5xl mx-auto px-6 py-24 relative">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-brand-500/10 text-brand-400 text-xs font-medium px-3 py-1 rounded-full border border-brand-500/20">
              Open Source — v1.0
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            MCP Sales Agent
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10">
            An AI agent for sales observability. Reads calls from Gong or Fathom,
            updates Salesforce, drafts follow-ups from Gmail, and coaches your reps —
            with full architectural transparency.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/developers-universe-1/meetingagent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors px-4 py-3"
            >
              <Code2 className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-t border-zinc-900 py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-400" />
              For Revenue Leaders
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Replace 3–4 manual tools. Save every rep 4+ hours per week. Get scorecards built from real call data,
              not manager gut feel. Know why deals are lost with automated Loss Autopsy.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-400" />
              For Engineering Leaders
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Production-grade AI agent architecture with Zod-structured LLM output, SSE streaming,
              typed error hierarchy, and zero-config demo mode. Fork it, extend it, or use it as a reference.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-t border-zinc-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-full mb-4">
              <Plug className="w-4 h-4 text-brand-400" />
              Plugs into the stack you already use
            </div>
            <p className="text-zinc-400">No rip-and-replace. Connect what you already use — we listen, read, and write into the tools your team lives in.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {integrations.map((group) => (
              <div key={group.category} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold mb-10 text-center">Six capabilities. One agent.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
            >
              <div className="bg-zinc-800/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-500/10 transition-colors">
                <f.icon className="w-5 h-5 text-zinc-300 group-hover:text-brand-400 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold mb-10 text-center">Architecture</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 overflow-x-auto">
          <div className="flex items-center justify-center min-w-[700px]">
            <div className="flex items-center gap-4">
              {[
                { label: 'Recorders', sub: 'Gong / Fathom', color: 'bg-zinc-800 text-zinc-300' },
                { label: 'Ingest', sub: 'Webhooks', color: 'bg-zinc-800 text-zinc-300' },
                { label: 'Analyze', sub: 'GPT-4o + Zod', color: 'bg-brand-950/40 text-brand-400' },
                { label: 'Enrich', sub: 'Pipeline + CRM', color: 'bg-brand-950/40 text-brand-400' },
                { label: 'Act', sub: 'Email + Briefs', color: 'bg-brand-950/40 text-brand-400' },
                { label: 'Surface', sub: 'Dashboard', color: 'bg-zinc-800 text-zinc-300' },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-28 h-12 rounded-lg flex items-center justify-center text-xs font-mono border border-zinc-700 ${step.color}`}>
                      {step.label}
                    </div>
                    <span className="text-xs text-zinc-500">{step.sub}</span>
                  </div>
                  {i < 5 && <div className="w-8 h-px bg-zinc-700" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="border-t border-zinc-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-8 text-center">Built with</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {tech.map((t) => (
              <span
                key={t}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-lg"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why open source */}
      <section className="border-t border-zinc-900 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Why open source?</h2>
          <p className="text-zinc-400 leading-relaxed mb-8">
            Sales tooling should be transparent. This project documents the full architecture of an AI-powered
            sales observability platform — from call ingestion to structured output parsing to real-time dashboards.
            Fork it, extend it, or use it as a reference for your own implementation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {[
              { title: 'Structured Output', desc: 'Zod schemas guarantee valid, typed data from every LLM call. No free-form JSON parsing.' },
              { title: 'Streaming Pipeline', desc: 'Real-time SSE progress updates from the analysis engine to the UI.' },
              { title: 'Demo Mode', desc: 'Works without API keys. Rich mock data lets anyone explore the full dashboard instantly.' },
            ].map((item) => (
              <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  <h3 className="font-medium text-sm">{item.title}</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-500" />
            <span className="font-semibold">MCP Sales Agent</span>
          </div>
          <p className="text-sm text-zinc-500">
            Open-source sales AI — MIT License
          </p>
        </div>
      </footer>
    </main>
  )
}
