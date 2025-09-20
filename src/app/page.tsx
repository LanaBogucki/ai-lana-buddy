"use client";

import React, { useRef, useState } from "react";
import { buildSampleReportHtml } from "@/lib/sample-report";
import { LandingHeader } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { FooterSection } from "@/components/landing/FooterSection";

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
        iframeDoc.write(buildSampleReportHtml({ score, analysis }));
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
      <LandingHeader />
      <HeroSection
        preview={preview}
        score={score}
        analysis={analysis}
        loading={loading}
        fileInputRef={fileRef}
        onFileSelected={handleFile}
        onGenerateSampleReport={generateSampleReport}
        reportGenerating={reportGenerating}
        reportMessage={reportMessage}
      />
      <TrustSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
