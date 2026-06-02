# Quick Test Queries

Run through these in under 5 minutes to validate the system end-to-end.

## Prerequisites

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

---

## 1. Dashboard Overview

**Action:** Click **Open Dashboard** on the landing page.

**Expected:** Overview view loads with pipeline value ($2.3M), 6 calls analyzed, 62% win rate, and a top performer card.

**Validation:** All numbers should be non-zero and charts should render without console errors.

---

## 2. Call Intelligence Drill-Down

**Action:** Navigate to **Call Intelligence**. Click the first call card ("Acme Corp — Discovery Call").

**Expected:** Expandable card reveals transcript, sentiment label (Positive/Neutral/Negative), detected objections, and talk-time ratio bar.

**Validation:** Transcript should be multi-paragraph. Sentiment badge should be visible. Objections should show category tags.

---

## 3. Pipeline Kanban

**Action:** Navigate to **Pipeline**. Drag any deal card from "Qualification" to "Proposal".

**Expected:** Card moves to the new column. Stage badge updates. Pipeline value recalculates in the header.

**Validation:** No full-page reload. Animation should be smooth. Deal count per stage updates.

---

## 4. AI Follow-ups

**Action:** Navigate to **Follow-ups**. Click the copy icon on the first drafted email.

**Expected:** Toast notification confirms "Copied to clipboard". Email body contains realistic post-call copy with no fabricated names or promises.

**Validation:** Subject line should reference actual call content. No placeholder text like `[Name]` or `[Company]`.

---

## 5. Pre-Call Brief

**Action:** Navigate to **Pre-Call Briefs**. Click the brief for "Globex Industries".

**Expected:** Brief shows last call summary, open commitments with checkboxes, recurring objections, and a winning pattern from a similar closed deal.

**Validation:** All four sections should have content. Winning pattern should reference a real deal name from the dataset.

---

## 6. Rep Coaching Scorecard

**Action:** Navigate to **Coaching**. Select the second rep from the dropdown.

**Expected:** Scorecard loads with weekly trend line, objection-resolution rate, and a side-by-side team comparison bar chart.

**Validation:** Trend line should have 4 data points (one per week). Comparison chart should show all 4 reps.

---

## 7. Industry Benchmarks

**Action:** Navigate to **Benchmarks**. Select "SaaS — Mid-Market" from the segment dropdown.

**Expected:** Radar chart renders with 6 dimensions. Win rate and show rate compare your team vs. benchmark.

**Validation:** Both series (Your Team + Benchmark) should be visible. Legend should be readable.

---

## 8. Streaming API

**Action:** Run the following curl in your terminal:

```bash
curl -N http://localhost:3000/api/analyze/stream
```

**Expected:** SSE stream with 4 events: `ingest`, `analyze`, `enrich`, `complete`. Each has a `data:` payload.

**Validation:** Stream ends with a `complete` event containing the full dashboard snapshot JSON. No connection drops.

---

## 9. REST API

**Action:** Run:

```bash
curl http://localhost:3000/api/analyze
```

**Expected:** JSON response with `calls`, `deals`, `reps`, `followups`, `briefs`, `benchmarks`, and `metrics` arrays.

**Validation:** `calls.length` should be 6. `deals.length` should be 10. Response time should be < 500ms (cached).

---

## 10. Loss Autopsy

**Action:** Navigate to **Loss Autopsy**.

**Expected:** Objection clusters render behind stalled deals. Each cluster shows count, top affected deals, and a suggested counter-move.

**Validation:** At least 3 objection clusters. Counter-moves should be actionable sentences, not generic advice.

---

## All Green?

If all 10 pass, the framework is running correctly. Ready to wire real integrations.
