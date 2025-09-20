import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FAQS = [
  {
    q: "Is AI Lana Buddy a medical/dermatology tool?",
    a: "No. We provide educational guidance and shopping assistance, not medical advice. For medical concerns, please consult a licensed professional.",
  },
  {
    q: "How do you keep recommendations unbiased?",
    a: "We compare ingredients, efficacy data, and verified reviews across many brands and price tiers. Sponsored items are clearly labeled, and you always see alternatives.",
  },
  {
    q: "Do you support all skin tones?",
    a: "Inclusivity is core. We test on diverse datasets, lighting conditions and ages. You can also provide feedback to improve your results over time.",
  },
  {
    q: "Is my photo private?",
    a: "Yes. Photos stay private by default. You can opt-in to share anonymized data to improve the model. You can delete your data anytime.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight">FAQ</h2>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {FAQS.map((item) => (
            <Card key={item.q} className="border-slate-200/70 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{item.q}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-slate-600 dark:text-slate-300">{item.a}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
