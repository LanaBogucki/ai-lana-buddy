import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-slate-200/70 dark:border-slate-800">
          <CardContent className="p-8 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-extrabold">Ready to glow with less?</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Join thousands simplifying skincare with inclusive, unbiased AI. Start free — upgrade anytime.
              </p>
              <div className="mt-6 flex gap-3">
                <Button className="rounded-2xl">Get started</Button>
                <Button variant="outline" className="rounded-2xl">
                  View a sample report
                </Button>
              </div>
            </div>
            <div className="relative w-full h-64 overflow-hidden rounded-2xl shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1600803907087-f56d462fd26b?q=80&w=1200&auto=format&fit=crop"
                alt="Inclusive beauty"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
