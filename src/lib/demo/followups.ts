export interface FollowUp {
  id: string
  dealId: string
  company: string
  contact: string
  subject: string
  body: string
  status: 'draft' | 'sent' | 'replied' | 'paused'
  sentAt?: string
  replyAt?: string
  repName: string
}

export const mockFollowUps: FollowUp[] = [
  {
    id: 'fu-1',
    dealId: 'deal-1',
    company: 'Acme Corp',
    contact: 'Alex Rivera',
    subject: 'Demo scheduled + prep materials',
    body: "Hi Alex,\n\nGreat speaking with you today. As promised, I've blocked Tuesday at 2pm ET for the demo with your VP Engineering.\n\nAttached:\n- Product overview (7 min read)\n- Security FAQ\n- Two reference customers in your vertical\n\nThe demo will focus on the CRM auto-update and follow-up drafting features you asked about. No generic walkthrough — we'll use your actual stack.\n\nLet me know if anyone else from your side should join.\n\nBest,\nSarah",
    status: 'sent',
    sentAt: '2026-05-27T10:00:00Z',
    repName: 'Sarah Chen',
  },
  {
    id: 'fu-2',
    dealId: 'deal-2',
    company: 'Vertex Labs',
    contact: 'Jordan Lee',
    subject: 'ROI Calculator — 30% stack cost reduction',
    body: "Hi Jordan,\n\nPer our conversation, here's the ROI breakdown comparing your current three-tool stack to our single platform:\n\nCurrent monthly: $3,000 (Gong $1,200 + Outreach $1,000 + Gong Insights $800)\nOur monthly: $1,998 (5 seats @ $399)\nAnnual savings: $12,024\n\nPlus the unquantified: 4 hours/week saved per rep on manual CRM updates and follow-up drafting. At loaded cost, that's another $18k/year.\n\nHappy to walk through this with your CFO whenever works.\n\nBest,\nMarcus",
    status: 'replied',
    sentAt: '2026-05-26T16:00:00Z',
    replyAt: '2026-05-27T08:30:00Z',
    repName: 'Marcus Johnson',
  },
  {
    id: 'fu-3',
    dealId: 'deal-4',
    company: 'Orbital Data',
    contact: 'Rachel Kim',
    subject: 'SOC 2 timeline + interim security measures',
    body: "Hi Rachel,\n\nI connected you with our Head of Security, James Liu. He's available for a call Thursday at 11am ET.\n\nIn the meantime, here's what I can share:\n- SOC 2 Type II audit in progress (target: Q3)\n- Current interim: isolated Supabase region, enhanced audit logging, BAU available now\n- We already serve two other fintech customers under similar interim arrangements\n\nJames will bring the detailed security architecture doc to the call.\n\nBest,\nDavid",
    status: 'draft',
    repName: 'David Park',
  },
  {
    id: 'fu-4',
    dealId: 'deal-5',
    company: 'Pulse Health',
    contact: 'Chris Morgan',
    subject: 'Gong + MCP Sales Agent integration walkthrough',
    body: "Hi Chris,\n\nYou asked how we fit alongside Gong. Here's the 3-minute version:\n\n1. Gong records and transcribes (you keep this)\n2. We read the transcript via API (no extra work for you)\n3. We update Salesforce, draft follow-ups, and brief your next meeting\n\nThink of it as the action layer that sits on top of Gong's capture layer. We don't replace — we complete the loop.\n\nI've attached a one-pager with the architecture diagram. Want to see it live?\n\nBest,\nAisha",
    status: 'sent',
    sentAt: '2026-05-23T11:00:00Z',
    repName: 'Aisha Patel',
  },
]
