import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#demo", label: "Demo" },
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-amber-400" />
          <span className="font-extrabold tracking-tight text-lg">AI Lana Buddy</span>
          <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            AI • Inclusive • Unbiased
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:opacity-80">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button className="rounded-2xl">Get the app</Button>
        </div>
      </div>
    </header>
  );
}
