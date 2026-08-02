"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";

function formatDate(dateStr: string | null, lang: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function VisualJournalCard({ data, isLoading }: { data: any; isLoading: boolean }) {
  const { language } = useLanguage();
  const href = data?.url || "https://jurnalvisual.vercel.app";
  const title = data?.latestPostTitle;
  const thumbnail = data?.thumbnailUrl;
  const date = data?.createdAt;
  const location = data?.location;

  return (
    <Link href={href} target="_blank" className="group block h-full no-underline">
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative h-full overflow-hidden rounded-2xl border border-border bg-card"
      >
        {/* Full bleed background image */}
        {isLoading ? (
          <div className="absolute inset-0 animate-pulse bg-muted/40" />
        ) : (
          <img
            src={thumbnail || FALLBACK_IMG}
            alt={title || "Visual Journal"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Top badge */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-md bg-black/60 border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/80 backdrop-blur-md">
            Visual Journal
          </span>
          <span className="rounded-md bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-400 backdrop-blur-md">
            {language === "en" ? "Latest Post" : "Postingan Terbaru"}
          </span>
        </div>

        {/* Top right link icon */}
        <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
            <ArrowUpRight size={14} className="text-white" />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="mb-1 truncate font-heading text-[18px] font-semibold leading-tight text-white drop-shadow-md">
            {isLoading ? "Loading..." : title || "Jurnal Visual"}
          </p>
          <p className="font-mono text-[11px] tracking-wide text-white/60">
            {location ? `${location} · ` : ""}
            {formatDate(date, language)}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}