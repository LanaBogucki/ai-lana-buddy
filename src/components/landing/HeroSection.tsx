import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, type ChangeEventHandler, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Globe2, Heart, Lock, Sparkles, Timer, Wand2 } from "lucide-react";

type HeroSectionProps = {
  preview: string;
  score: number | null;
  analysis: string | null;
  loading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelected: (file: File | null) => void;
  onGenerateSampleReport: () => void;
  reportGenerating: boolean;
  reportMessage: string | null;
};

export function HeroSection({
  preview,
  score,
  analysis,
  loading,
  fileInputRef,
  onFileSelected,
  onGenerateSampleReport,
  reportGenerating,
  reportMessage,
}: HeroSectionProps) {
  const scoreDisplay = useMemo(() => (score === null ? "—" : `${score}/100`), [score]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onFileSelected(event.target.files?.[0] ?? null);
  };

  return (
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
                      <Button className="mt-4 rounded-2xl" onClick={() => fileInputRef.current?.click()}>
                        Choose photo
                      </Button>
                    </div>
                  )}
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </div>

              <div className="md:w-1/2 flex flex-col justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wider text-slate-500">AI Glow Score</p>
                  <div className="mt-2">
                    <Progress value={score ?? 0} className="h-3 rounded-full" />
                    <div className="mt-2 text-2xl font-bold">{scoreDisplay}</div>
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
            <Button className="rounded-2xl" onClick={() => fileInputRef.current?.click()}>
              Upload another
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={onGenerateSampleReport}
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
  );
}
