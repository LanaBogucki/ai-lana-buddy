const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const COMPANY_LINKS = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Disclosures", href: "#" },
];

export function FooterSection() {
  return (
    <footer className="py-10 border-t border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-amber-400" />
            <span className="font-extrabold">AI Lana Buddy</span>
          </div>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Inclusive, unbiased beauty guidance. Photo‑based, privacy‑first.
          </p>
        </div>
        <FooterColumn title="Product" links={PRODUCT_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Legal" links={LEGAL_LINKS} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-xs text-slate-500">
        © {new Date().getFullYear()} AI Lana Buddy. Educational guidance only; not medical advice.
      </div>
    </footer>
  );
}

type FooterLink = { label: string; href: string };

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <ul className="mt-2 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a className="hover:opacity-80" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
