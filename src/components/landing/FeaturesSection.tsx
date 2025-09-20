import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    title: "Photo‑based scan",
    desc: "Fast, private analysis from your selfie. No filters, no judgments.",
  },
  {
    title: "0–100 Glow Score",
    desc: "Clear, comparable insight over time. Track progress with re‑scans.",
  },
  {
    title: "Minimalism Mode",
    desc: "Cut duplicates, keep essentials. Save money without sacrificing results.",
  },
  {
    title: "Budget Builder",
    desc: "Set €/$ budget. We assemble a routine that fits — with local prices.",
  },
  {
    title: "Smart Reminders",
    desc: "Restock just‑in‑time. Replace, switch to alternatives, or skip.",
  },
  {
    title: "Travel Mode",
    desc: "Moving or traveling? Get local equivalents instantly.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-12 bg-white/50 dark:bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight">Everything you need to glow smarter</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">
          Photo‑based analysis, minimalist routines, and price‑aware shopping — all in one place.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="border-slate-200/70 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-6 text-slate-600 dark:text-slate-300">
                {feature.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
