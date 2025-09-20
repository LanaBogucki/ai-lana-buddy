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

const SAMPLE_REPORT_METADATA = {
  generatedOn: "April 12, 2025",
  clientName: "Lana B.",
  email: "demo@ailanabuddy.app",
};

const SAMPLE_SCORE_DETAILS = {
  value: 82,
  label: "Radiant baseline",
  description:
    "Balanced hydration, calm barrier, and even tone overall. Keep consistent moisturizing, add targeted actives only where needed, and maintain SPF diligence for sustained glow.",
};

const SAMPLE_METRICS = [
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

const SAMPLE_ROUTINE = [
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

const SAMPLE_TIPS = [
  "Opt for soft microfiber towel pats instead of rubbing to minimize irritation.",
  "Layer humectants (mist + serum) beneath moisturizer when flying or in dry climates.",
  "Schedule a routine check-in every 6 weeks to adjust actives with seasonal shifts.",
];

const buildSampleReportHtml = () => {
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
        .hero-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 40px; color: #475569; }
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
                <p class="score-value">${SAMPLE_SCORE_DETAILS.value}</p>
                <span class="score-tag">${SAMPLE_SCORE_DETAILS.label}</span>
              </div>
              <div class="progress"><span style="width:${SAMPLE_SCORE_DETAILS.value}%"></span></div>
              <p class="score-text">${SAMPLE_SCORE_DETAILS.description}</p>
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

const SAMPLE_BADGES = ["5s mock analysis", "Dermatologist reviewed playbook", "Local product matches"];

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
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportMessage, setReportMessage] = useState<string | null>(null);

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
    if (typeof document === "undefined") {
      throw new Error("Image analysis requires a browser environment");
    }

    const img = document.createElement("img");
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

  const generateSampleReport = async () => {
    if (reportGenerating) return;

    setReportMessage(null);
    setReportGenerating(true);

    let iframe: HTMLIFrameElement | null = null;

    try {
      const html2canvasModule = await import("html2canvas");
      const { jsPDF } = await import("jspdf");

      const html2canvas = html2canvasModule.default ?? html2canvasModule;

      const tempIframe = document.createElement("iframe");
      tempIframe.setAttribute("aria-hidden", "true");
      Object.assign(tempIframe.style, {
        position: "fixed",
        left: "-9999px",
        top: "0",
        width: "816px",
        height: "10px",
        opacity: "0",
        pointerEvents: "none",
      });

      document.body.appendChild(tempIframe);
      iframe = tempIframe;

      const iframeDoc = tempIframe.contentDocument || tempIframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("Unable to access temporary report document");
      }

      await new Promise<void>((resolve) => {
        tempIframe.addEventListener("load", () => resolve(), { once: true });
        iframeDoc.open();
        iframeDoc.write(buildSampleReportHtml());
        iframeDoc.close();
      });

      const target = iframeDoc.querySelector(".card") as HTMLElement | null;
      if (!target) {
        throw new Error("Sample report template missing");
      }

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#FFFFFF",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const width = canvas.width;
      const height = canvas.height;

      const orientation = height >= width ? "portrait" : "landscape";
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [width, height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("ai-lana-buddy-sample-report.pdf");

      setReportMessage("Sample report downloaded");
    } catch (error) {
      console.error(error);
      setReportMessage("We couldn't generate the sample PDF. Please try again.");
    } finally {
      if (iframe?.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      setReportGenerating(false);
    }
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
                        ? "Analyzing..."
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
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={generateSampleReport}
                disabled={reportGenerating}
              >
                {reportGenerating ? "Generating..." : "See sample report"}
              </Button>
            </CardFooter>
            {reportMessage && (
              <p className="px-6 pb-6 text-sm text-slate-500">{reportMessage}</p>
            )}
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
