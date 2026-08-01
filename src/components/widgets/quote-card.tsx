"use client";

import { motion } from "framer-motion";

export function QuoteCard({ data, isLoading }: { data?: any, isLoading?: boolean }) {
  if (isLoading) {
    return (
      <motion.div
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-7"
      >
        <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-muted/50 mb-4"></div>
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted/50 mb-2"></div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted/50"></div>
      </motion.div>
    );
  }

  return (
    <motion.a
      href="https://github.com/SkyDreamsID"
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-zinc-500/5 p-7 hover:bg-zinc-500/10 hover:border-zinc-500/30 transition-colors"
    >
      {/* Decorative GitHub Background element */}
      <span className="pointer-events-none absolute -right-6 -top-6 select-none font-heading text-[160px] font-bold leading-none text-zinc-500 opacity-5 transition-opacity group-hover:opacity-10">
        /
      </span>

      <div className="relative z-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-100 border border-zinc-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </div>
        <h3 className="font-heading text-lg font-medium text-foreground">
          GitHub Profile
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Lihat repositori dan kontribusi open source saya
        </p>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-zinc-500/20 pt-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
          Kunjungi GitHub
        </p>
        <span className="text-zinc-400 transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </motion.a>
  );
}
