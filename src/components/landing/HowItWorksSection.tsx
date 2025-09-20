const STEPS = [
  {
    number: 1,
    title: "Scan & share context",
    desc: "Upload a selfie and share your goals, allergies, and budget.",
  },
  {
    number: 2,
    title: "Get unbiased picks",
    desc: "We match products by ingredients, efficacy and availability — across price tiers.",
  },
  {
    number: 3,
    title: "Glow with less",
    desc: "Use Minimalism Mode and smart reminders to keep routines simple — and effective.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight">How it works</h2>
        <ol className="mt-8 grid md:grid-cols-3 gap-6 list-decimal list-inside">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-amber-400 text-white flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <p className="font-semibold">{step.title}</p>
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
