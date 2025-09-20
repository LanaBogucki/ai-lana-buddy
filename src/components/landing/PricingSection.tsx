import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

type Plan = {
  name: string;
  price: string;
  bullets: string[];
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "Free",
    bullets: ["3 routines", "Ingredient library", "AI glow scoring", "Weekly recaps"],
  },
  {
    name: "Plus",
    price: "€7/mo",
    bullets: ["Smart reminders", "Minimalism Mode", "Unlimited routines", "Travel Mode"],
    highlight: true,
  },
  {
    name: "Pro",
    price: "€15/mo",
    bullets: ["AI review summaries", "Ingredient alerts", "Advanced progress charts", "Priority support"],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Flexible plans for every routine</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">
              Start free, upgrade when you&apos;re ready for advanced tracking, reminders, and dermatologist-vetted insights.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PriceCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PriceCard({ name, price, bullets, highlight }: Plan) {
  return (
    <Card className={`relative border-slate-200/70 dark:border-slate-800 ${highlight ? "ring-2 ring-fuchsia-400" : ""}`}>
      {highlight && (
        <Badge className="absolute -top-3 left-4 rounded-xl" variant="secondary">
          Most popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-xl flex items-end gap-2">
          {name}
          <span className="text-3xl font-extrabold ml-auto">{price}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-0">
        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
          {bullets.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5" /> <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-6">
        <Button className="w-full rounded-2xl">Choose {name}</Button>
      </CardFooter>
    </Card>
  );
}
