"use client";

import { motion } from "framer-motion";

export function KnowledgeBaseCard() {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/50 p-6 text-center"
    >
      <span className="mb-3 inline-block rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-400">
        Work in Progress
      </span>
      <div className="mb-3 text-4xl">📖</div>
      <p className="font-heading text-lg font-medium text-foreground">
        Catatanku
      </p>
      <p className="mt-1 font-sans text-sm font-light leading-relaxed text-muted-foreground">
        Ruang catatan dan jurnal personal.
        <br />
        Coming soon.
      </p>
    </motion.div>
  );
}