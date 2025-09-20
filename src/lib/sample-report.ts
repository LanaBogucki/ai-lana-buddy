export const SAMPLE_REPORT_METADATA = {
  generatedOn: "April 12, 2025",
  clientName: "Lana B.",
  email: "demo@ailanabuddy.app",
};

export const SAMPLE_SCORE_DETAILS = {
  value: 82,
  label: "Radiant baseline",
  description:
    "Balanced hydration, calm barrier, and even tone overall. Keep consistent moisturizing, add targeted actives only where needed, and maintain SPF diligence for sustained glow.",
};

export const SAMPLE_METRICS = [
  {
    label: "Hydration balance",
    value: 84,
    description: "Moisture barrier looks supported; keep lightweight humectants in rotation.",
  },
  {
    label: "Texture smoothness",
    value: 78,
    description: "Minor dry patches along cheeks. Pair chemical exfoliant with barrier repair.",
  },
  {
    label: "Tone evenness",
    value: 74,
    description: "Subtle hyperpigmentation around jawline. Target with vitamin C + SPF diligence.",
  },
];

export const SAMPLE_ROUTINE = [
  {
    step: "Cleanser",
    summary: "Amino-gel cleanser for sensitive skin",
    note: "AM & PM · Massage 60 seconds, lukewarm rinse",
  },
  {
    step: "Target",
    summary: "5% niacinamide + panthenol serum",
    note: "AM · Calm redness and support moisture barrier",
  },
  {
    step: "Moisturizer",
    summary: "Barrier-repair cream with ceramides",
    note: "AM & PM · Press onto damp skin for better absorption",
  },
  {
    step: "SPF",
    summary: "Mineral SPF 30 with zinc + tint",
    note: "AM · Shake well, apply two fingers for full coverage",
  },
];

export const SAMPLE_TIPS = [
  "Opt for soft microfiber towel pats instead of rubbing to minimize irritation.",
  "Layer humectants (mist + serum) beneath moisturizer when flying or in dry climates.",
  "Schedule a routine check-in every 6 weeks to adjust actives with seasonal shifts.",
];

export const SAMPLE_BADGES = [
  "5s mock analysis",
  "Dermatologist reviewed playbook",
  "Local product matches",
];

type BuildReportOptions = {
  score?: number | null;
  analysis?: string | null;
};

const escapeHtml = (input: string) =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const deriveScoreLabel = (score: number) => {
  if (score >= 80) return "Radiant baseline";
  if (score >= 55) return "Glow in progress";
  if (score >= 40) return "Needs barrier boost";
  return "Gentle care recommended";
};

export const buildSampleReportHtml = (options: BuildReportOptions = {}) => {
  const hasCustomScore = typeof options.score === "number" && Number.isFinite(options.score);

  const safeScore = hasCustomScore
    ? Math.max(0, Math.min(100, Math.round(options.score!)))
    : SAMPLE_SCORE_DETAILS.value;

  const scoreLabel = hasCustomScore ? deriveScoreLabel(safeScore) : SAMPLE_SCORE_DETAILS.label;
  const fallbackDescription = escapeHtml(SAMPLE_SCORE_DETAILS.description);

  const scoreDescription = options.analysis?.trim()
    ? escapeHtml(options.analysis.trim())
    : fallbackDescription;

  const metricsHtml = SAMPLE_METRICS.map(
    (metric) => `
      <div class="metric">
        <p class="label">${metric.label}</p>
        <div class="value"><span>${metric.value}</span><small>/100</small></div>
        <div class="bar"><span style="width:${metric.value}%"></span></div>
        <p class="body">${metric.description}</p>
      </div>
    `
  ).join("");

  const routineHtml = SAMPLE_ROUTINE.map(
    (item) => `
      <div class="routine-card">
        <p class="step">${item.step}</p>
        <h4>${item.summary}</h4>
        <p class="body">${item.note}</p>
        <div class="note">✔ Clinically-vetted ingredient list</div>
      </div>
    `
  ).join("");

  const tipsHtml = SAMPLE_TIPS.map((tip) => `<li>${tip}</li>`).join("");

  const badgesHtml = SAMPLE_BADGES.map(
    (badge) => `<span class="badge"><span class="badge-icon"></span>${badge}</span>`
  ).join("");

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root { color-scheme: light; }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: #f8fafc; color: #1f2937; font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; }
        .card { width: 816px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 32px; box-shadow: 0 24px 60px rgba(15,23,42,0.12); overflow: hidden; }
        .header { padding: 48px 56px 40px; background: linear-gradient(135deg,#ffe4e6 5%,#ffffff 45%,#e0f2fe 100%); border-bottom: 1px solid #e2e8f0; }
        .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
        .brand { display: flex; align-items: center; gap: 18px; }
        .brand-badge { width: 48px; height: 48px; border-radius: 24px; background: linear-gradient(135deg,#d946ef 0%,#fbbf24 100%); }
        .eyebrow { margin: 0; font-size: 12px; letter-spacing: 0.3em; font-weight: 600; text-transform: uppercase; color: #64748b; }
        .title { margin: 8px 0 0; font-size: 32px; font-weight: 800; color: #0f172a; }
        .meta { text-align: right; font-size: 14px; color: #475569; }
        .meta p { margin: 0; }
        .meta .name { font-weight: 600; color: #0f172a; }
        .meta .generated { margin-top: 8px; font-size: 12px; color: #64748b; }
        .score-grid { margin-top: 40px; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 40px; align-items: center; }
        .label { margin: 0; font-size: 12px; letter-spacing: 0.3em; font-weight: 600; text-transform: uppercase; color: #64748b; }
        .score-row { display: flex; align-items: flex-end; gap: 16px; margin-top: 12px; }
        .score-value { margin: 0; font-size: 60px; font-weight: 900; color: #0f172a; }
        .score-tag { font-size: 14px; font-weight: 600; color: #34d399; }
        .progress { margin-top: 20px; height: 16px; width: 100%; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
        .progress span { display: block; height: 100%; background: #0f172a; border-radius: 999px; }
        .score-text { margin-top: 16px; font-size: 16px; line-height: 24px; color: #475569; max-width: 480px; }
        .badges { margin-top: 24px; display: flex; flex-wrap: wrap; gap: 12px; }
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; font-size: 13px; font-weight: 500; background: #f3f4f6; border: 1px solid #e2e8f0; color: #111827; }
        .badge-icon { width: 8px; height: 8px; border-radius: 50%; background: #111827; display: inline-block; }
        .hero { position: relative; height: 256px; border-radius: 28px; border: 1px solid #e2e8f0; background: linear-gradient(135deg,#e2e8f0 0%,#ffffff 55%,#ffe4e6 100%); overflow: hidden; }
        .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top left, rgba(244,114,182,0.35) 0%, rgba(244,114,182,0) 55%); }
        .hero-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-center; text-align: center; padding: 0 40px; color: #475569; }
        .hero-content h3 { margin: 16px 0 0; font-size: 22px; font-weight: 600; color: #0f172a; }
        .hero-content p { margin: 12px 0 0; font-size: 14px; color: #64748b; }
        .section { padding: 48px 56px; background: #ffffff; }
        .metrics { display: grid; gap: 24px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .metric { border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; background: #ffffff; box-shadow: 0 6px 18px rgba(15,23,42,0.04); }
        .metric .value { display: flex; align-items: baseline; gap: 12px; margin-top: 12px; }
        .metric .value span { font-size: 34px; font-weight: 700; color: #0f172a; }
        .metric .value small { font-size: 14px; color: #64748b; }
        .metric .bar { margin-top: 16px; height: 12px; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
        .metric .bar span { display: block; height: 100%; background: #0f172a; border-radius: 999px; }
        .metric .body { margin-top: 16px; font-size: 14px; line-height: 22px; color: #475569; }
        .routine { margin-top: 40px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
        .routine-card { border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; background: #f8fafc; }
        .routine-card .step { font-size: 12px; letter-spacing: 0.3em; font-weight: 600; text-transform: uppercase; color: #64748b; margin: 0; }
        .routine-card h4 { margin: 14px 0 0; font-size: 18px; font-weight: 600; color: #0f172a; }
        .routine-card .body { margin: 12px 0 0; font-size: 14px; color: #475569; }
        .routine-card .note { margin-top: 16px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #34d399; font-weight: 500; }
        .tips { margin-top: 40px; border: 1px solid #e2e8f0; border-radius: 24px; padding: 32px; background: linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%); color: #f8fafc; }
        .tips h3 { margin: 0; font-size: 22px; font-weight: 600; }
        .tips p { margin: 12px 0 24px; font-size: 14px; color: rgba(241,245,249,0.8); }
        .tips ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
        .tips li { display: flex; gap: 12px; }
        .tips li::before { content: '✔'; font-size: 14px; color: #34d399; margin-top: 2px; }
        .footer { padding: 24px 56px; border-top: 1px solid #e2e8f0; background: #f8fafc; font-size: 12px; color: #64748b; display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="row">
            <div class="brand">
              <div class="brand-badge"></div>
              <div>
                <p class="eyebrow">AI Lana Buddy</p>
                <h1 class="title">Glow Insights Preview</h1>
              </div>
            </div>
            <div class="meta">
              <p class="name">${SAMPLE_REPORT_METADATA.clientName}</p>
              <p>${SAMPLE_REPORT_METADATA.email}</p>
              <p class="generated">Generated ${SAMPLE_REPORT_METADATA.generatedOn}</p>
            </div>
          </div>
          <div class="score-grid">
            <div>
              <p class="label">AI Glow Score</p>
              <div class="score-row">
                <p class="score-value">${safeScore}</p>
                <span class="score-tag">${scoreLabel}</span>
              </div>
              <div class="progress"><span style="width:${safeScore}%"></span></div>
              <p class="score-text">${scoreDescription}</p>
              <div class="badges">${badgesHtml}</div>
            </div>
            <div class="hero">
              <div class="hero-content">
                <p class="label" style="color:#64748b;">Demo visual</p>
                <h3>Reusable component library mirrors live app UI</h3>
                <p>Replace this block with captured selfie preview once the production model is connected.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="metrics">${metricsHtml}</div>
          <div class="routine">${routineHtml}</div>
          <div class="tips">
            <h3>Gentle guidance & next steps</h3>
            <p>Stay consistent for 4-6 weeks, then retest for adaptive adjustments backed by Lana's inclusive model.</p>
            <ul>${tipsHtml}</ul>
          </div>
        </div>
        <div class="footer">
          <span>Mock insights for demo purposes only. Dermatologist-reviewed feedback becomes available in the full release.</span>
          <span>AI Lana Buddy · Inclusive by design · v0.3 preview</span>
        </div>
      </div>
    </body>
  </html>`;
};
