"use client";

import { motion } from "framer-motion";

export function QuoteCard({ data, isLoading }: { data?: { text: string; author: string } | null, isLoading?: boolean }) {
  if (isLoading) {
    return (
      <motion.div
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-7"
      >
        <span className="pointer-events-none absolute -right-4 -top-6 select-none font-heading text-[160px] font-bold leading-none text-border opacity-50">
          "
        </span>
        <div className="relative z-10 w-full">
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted/50 mb-2"></div>
          <div className="h-6 w-1/2 animate-pulse rounded bg-muted/50"></div>
        </div>
        <div className="relative z-10 mt-6 h-3 w-1/4 animate-pulse rounded bg-muted/50"></div>
      </motion.div>
    );
  }

  // If no data is available after loading, you can render an empty state or just keep the card empty
  const quote = data || { text: "...", author: "..." };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-7"
    >
      {/* Decorative quotation mark */}
      <span className="pointer-events-none absolute -right-4 -top-6 select-none font-heading text-[160px] font-bold leading-none text-border">
        "
      </span>

      <div className="relative z-10">
        <blockquote className="font-heading text-[18px] font-light italic leading-[1.65] text-foreground">
          "{quote.text}"
        </blockquote>
      </div>

      <p className="relative z-10 mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        — {quote.author}
      </p>
    </motion.div>
  );
}
