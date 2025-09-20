import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, Lock, Star } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: <Star className="w-5 h-5" />,
    title: "Inclusive by design",
    desc: "Trained to recognize diverse skin tones & textures. We test across lighting, age, and regions.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Unbiased recommendations",
    desc: "We show multiple options across price points. Sponsored content is clearly labeled.",
  },
  {
    icon: <Globe2 className="w-5 h-5" />,
    title: "Local availability",
    desc: "We recommend products you can actually buy near you — with budget estimates.",
  },
];

export function TrustSection() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {TRUST_ITEMS.map((item) => (
            <Card key={item.title} className="border-slate-200/70 dark:border-slate-800">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900">{item.icon}</div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-6 text-slate-600 dark:text-slate-300">
                {item.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
