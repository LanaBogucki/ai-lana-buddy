"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Globe2, Heart, Lock, Sparkles, Star, Timer, Wand2 } from "lucide-react";

// Single-file React landing page for AI Lana Buddy
// TailwindCSS required. Uses shadcn/ui components.
// Notes:
// - "Demo" uploader is a front-end only mock to showcase the inclusive, unbiased, 0–100 score concept.
// - Replace mock scoring with real API when your model is ready.

export default function AILanaBuddyLanding() {
  const [preview, setPreview] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const currentToken = useRef<string | null>(null);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const analyzeImageMetrics = async (dataUrl: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = dataUrl;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Could not analyze image"));
    });

    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Canvas unavailable");
    }

    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    let total = 0;
    let meanBrightness = 0;
    let meanSaturation = 0;
    let highlightCount = 0;
    let shadowCount = 0;
    let sumSquares = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;

      // HSL lightness proxy using perceptual luminance weights
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;

      meanBrightness += brightness;
      meanSaturation += saturation;
      sumSquares += brightness * brightness;
      highlightCount += brightness > 0.75 ? 1 : 0;
      shadowCount += brightness < 0.25 ? 1 : 0;
      total += 1;
    }

    if (!total) {
      throw new Error("Empty image data");
    }

    meanBrightness /= total;
    meanSaturation /= total;
    const variance = clamp(sumSquares / total - meanBrightness * meanBrightness, 0, 1);
    const stdDeviation = Math.sqrt(variance);

    return {
      brightness: meanBrightness,
      saturation: meanSaturation,
      highlightRatio: highlightCount / total,
      shadowRatio: shadowCount / total,
      stdDeviation,
    };
  };

  const computeGlowScore = (metrics: Awaited<ReturnType<typeof analyzeImageMetrics>>) => {
    const { brightness, stdDeviation, highlightRatio, shadowRatio, saturation } = metrics;

    const targetBrightness = 0.62;
    const brightnessScore = 1 - clamp(Math.abs(brightness - targetBrightness) / targetBrightness, 0, 1);

    const targetTexture = 0.18;
    const textureScore = 1 - clamp(Math.abs(stdDeviation - targetTexture) / targetTexture, 0, 1);

    const desiredHighlights = 0.08;
    const highlightScore = 1 - clamp(Math.abs(highlightRatio - desiredHighlights) / desiredHighlights, 0, 1);

    const shadowPenalty = clamp(shadowRatio / 0.2, 0, 1);

    const saturationTarget = 0.28;
    const saturationScore = 1 - clamp(Math.abs(saturation - saturationTarget) / saturationTarget, 0, 1);

    const combined =
      brightnessScore * 0.4 +
      textureScore * 0.25 +
      highlightScore * 0.15 +
      saturationScore * 0.15 -
      shadowPenalty * 0.1;

    return Math.round(clamp(combined * 100, 5, 98));
  };

  const deriveAnalysis = (
    scoreValue: number,
    metrics: Awaited<ReturnType<typeof analyzeImageMetrics>>
  ) => {
    if (scoreValue >= 80) {
      return "Balanced hydration and even tone detected. Consider light moisturizer + daily SPF.";
    }

    if (scoreValue >= 55) {
      return "Minor texture or uneven tone detected. Try gentle exfoliant twice weekly + barrier-friendly moisturizer.";
    }

    if (metrics.shadowRatio > 0.25) {
      return "Low-light image detected. Retake in brighter, natural light for a clearer preview.";
    }

    return "Dryness/signs of sensitivity detected. Start simple: cleanser + rich moisturizer + SPF.";
  };

  const handleFile = async (f: File | null) => {
    if (!f) return;
    const token = `${Date.now()}-${f.name}-${f.size}`;
    currentToken.current = token;

    setLoading(true);
    setScore(null);
    setAnalysis(null);

    try {
      const dataUrl = await readFileAsDataURL(f);
      if (currentToken.current !== token) return;

      setPreview(dataUrl);

      const metrics = await analyzeImageMetrics(dataUrl);
      if (currentToken.current !== token) return;

      const mockScore = computeGlowScore(metrics);
      setScore(mockScore);
      setAnalysis(deriveAnalysis(mockScore, metrics));
    } catch (error) {
      console.error(error);
      if (currentToken.current === token) {
        setAnalysis("We couldn't read that photo. Try a clearer image with good lighting.");
      }
    } finally {
      if (currentToken.current === token) {
        setLoading(false);
      }
    }
  };

  const heroGradient = "bg-gradient-to-b from-rose-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900";

  return (
    <div className={`min-h-screen ${heroGradient} text-slate-900 dark:text-slate-100`}>
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-amber-400" />
            <span className="font-extrabold tracking-tight text-lg">AI Lana Buddy</span>
            <Badge className="ml-2" variant="secondary">
              AI • Inclusive • Unbiased
            </Badge>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#demo" className="hover:opacity-80">
              Demo
            </a>
            <a href="#features" className="hover:opacity-80">
              Features
            </a>
            <a href="#how" className="hover:opacity-80">
              How it works
            </a>
            <a href="#pricing" className="hover:opacity-80">
              Pricing
            </a>
            <a href="#faq" className="hover:opacity-80">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Sign in
            </Button>
            <Button className="rounded-2xl">Get the app</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight"
            >
              Inclusive, unbiased skincare recommendations —
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-amber-500">
                {" "}
                powered by AI.
              </span>
            </motion.h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              Upload a selfie and get <strong>0–100 skin insights</strong> with clear, local product picks that fit your budget.
              No fluff, no bias — just what works for your skin.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="outline" className="rounded-xl">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Photo‑based
              </Badge>
              <Badge variant="outline" className="rounded-xl">
                <Globe2 className="w-3.5 h-3.5 mr-1" /> Local products
              </Badge>
              <Badge variant="outline" className="rounded-xl">
                <Lock className="w-3.5 h-3.5 mr-1" /> Private by design
              </Badge>
            </div>
            <div className="mt-8 flex gap-3">
              <Button
                size="lg"
                className="rounded-2xl"
                onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              >
                Try the demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore features
              </Button>
            </div>
          </div>

          {/* Demo card */}
          <Card id="demo" className="md:ml-auto shadow-xl border-slate-200/70 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" /> Live demo (mock)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <div className="relative aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    {preview ? (
                      <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                    ) : (
                      <div className="text-center p-8">
                        <p className="font-semibold">Upload your selfie</p>
                        <p className="text-sm text-slate-500 mt-1">Well‑lit, no filters. Front‑facing.</p>
                        <Button className="mt-4 rounded-2xl" onClick={() => fileRef.current?.click()}>
                          Choose photo
                        </Button>
                      </div>
                    )}
                  </div>
                  <Input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="md:w-1/2 flex flex-col justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wider text-slate-500">AI Glow Score</p>
                    <div className="mt-2">
                      <Progress value={score ?? 0} className="h-3 rounded-full" />
                      <div className="mt-2 text-2xl font-bold">{score === null ? "—" : `${score}/100`}</div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 min-h-[3rem]">
                      {loading
                        ? "Analyzing…"
                        : analysis ??
                          "Your private, on-device preview. Real app provides dermatologist-reviewed guidance without medical claims."}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <Badge variant="secondary" className="justify-center">
                      <Timer className="w-3.5 h-3.5 mr-1" /> <span>Under 5s</span>
                    </Badge>
                    <Badge variant="secondary" className="justify-center">
                      <Heart className="w-3.5 h-3.5 mr-1" /> Gentle advice
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
              <Button className="rounded-2xl" onClick={() => fileRef.current?.click()}>
                Upload another
              </Button>
              <Button variant="outline" className="rounded-2xl">
                See sample report
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* TRUST & INCLUSIVITY */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <TrustTile
              icon={<Star className="w-5 h-5" />}
              title="Inclusive by design"
              desc="Trained to recognize diverse skin tones & textures. We test across lighting, age, and regions."
            />
            <TrustTile
              icon={<Lock className="w-5 h-5" />}
              title="Unbiased recommendations"
              desc="We show multiple options across price points. Sponsored content is clearly labeled."
            />
            <TrustTile
              icon={<Globe2 className="w-5 h-5" />}
              title="Local availability"
              desc="We recommend products you can actually buy near you — with budget estimates."
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-12 bg-white/50 dark:bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Everything you need to glow smarter</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">
            Photo‑based analysis, minimalist routines, and price‑aware shopping — all in one place.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard title="Photo‑based scan" desc="Fast, private analysis from your selfie. No filters, no judgments." />
            <FeatureCard title="0–100 Glow Score" desc="Clear, comparable insight over time. Track progress with re‑scans." />
            <FeatureCard title="Minimalism Mode" desc="Cut duplicates, keep essentials. Save money without sacrificing results." />
            <FeatureCard title="Budget Builder" desc="Set €/$ budget. We assemble a routine that fits — with local prices." />
            <FeatureCard title="Smart Reminders" desc="Restock just‑in‑time. Replace, switch to alternatives, or skip." />
            <FeatureCard title="Travel Mode" desc="Moving or traveling? Get local equivalents instantly." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight">How it works</h2>
          <ol className="mt-8 grid md:grid-cols-3 gap-6 list-decimal list-inside">
            <Step
              n={1}
              title="Scan & share context"
              desc="Upload a selfie and share your goals, allergies, and budget."
            />
            <Step
              n={2}
              title="Get unbiased picks"
              desc="We match products by ingredients, efficacy and availability — across price tiers."
            />
            <Step
              n={3}
              title="Glow with less"
              desc="Use Minimalism Mode and smart reminders to keep routines simple — and effective."
            />
          </ol>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 bg-white/60 dark:bg-slate-950/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Simple pricing</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">
            Start free. Go premium when you want reminders, travel mode, and deeper tracking.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <PriceCard
              name="Free"
              price="€0"
              bullets={["Photo scan (basic)", "3 recommendations", "Save 1 routine", "Starter guides"]}
            />
            <PriceCard
              name="Plus"
              highlight
              price="€7/mo"
              bullets={["Smart reminders", "Minimalism Mode", "Unlimited routines", "Travel Mode"]}
            />
            <PriceCard
              name="Pro"
              price="€15/mo"
              bullets={["AI review summaries", "Ingredient alerts", "Advanced progress charts", "Priority support"]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight">FAQ</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Faq
              q="Is AI Lana Buddy a medical/dermatology tool?"
              a="No. We provide educational guidance and shopping assistance, not medical advice. For medical concerns, please consult a licensed professional."
            />
            <Faq
              q="How do you keep recommendations unbiased?"
              a="We compare ingredients, efficacy data, and verified reviews across many brands and price tiers. Sponsored items are clearly labeled, and you always see alternatives."
            />
            <Faq q="Do you support all skin tones?" a="Inclusivity is core. We test on diverse datasets, lighting conditions and ages. You can also provide feedback to improve your results over time." />
            <Faq q="Is my photo private?" a="Yes. Photos stay private by default. You can opt-in to share anonymized data to improve the model. You can delete your data anytime." />
          </div>
        </div>
      </section>

      {/* CTA */}
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

      {/* FOOTER */}
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
          <div>
            <p className="font-semibold">Product</p>
            <ul className="mt-2 space-y-2">
              <li>
                <a className="hover:opacity-80" href="#features">
                  Features
                </a>
              </li>
              <li>
                <a className="hover:opacity-80" href="#pricing">
                  Pricing
                </a>
              </li>
              <li>
                <a className="hover:opacity-80" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Company</p>
            <ul className="mt-2 space-y-2">
              <li>
                <a className="hover:opacity-80" href="#">
                  About
                </a>
              </li>
              <li>
                <a className="hover:opacity-80" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a className="hover:opacity-80" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Legal</p>
            <ul className="mt-2 space-y-2">
              <li>
                <a className="hover:opacity-80" href="#">
                  Privacy
                </a>
              </li>
              <li>
                <a className="hover:opacity-80" href="#">
                  Terms
                </a>
              </li>
              <li>
                <a className="hover:opacity-80" href="#">
                  Disclosures
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} AI Lana Buddy. Educational guidance only; not medical advice.
        </div>
      </footer>
    </div>
  );
}

function TrustTile({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border-slate-200/70 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-6 text-slate-600 dark:text-slate-300">{desc}</CardContent>
    </Card>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="border-slate-200/70 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-6 text-slate-600 dark:text-slate-300">{desc}</CardContent>
    </Card>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-amber-400 text-white flex items-center justify-center font-bold">
          {n}
        </div>
        <p className="font-semibold">{title}</p>
      </div>
      <p className="mt-2 text-slate-600 dark:text-slate-300">{desc}</p>
    </li>
  );
}

function PriceCard({ name, price, bullets, highlight }: { name: string; price: string; bullets: string[]; highlight?: boolean }) {
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
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5" /> <span>{b}</span>
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

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <Card className="border-slate-200/70 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg">{q}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-slate-600 dark:text-slate-300">{a}</CardContent>
    </Card>
  );
}
