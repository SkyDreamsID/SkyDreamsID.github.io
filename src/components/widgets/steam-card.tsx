"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function SteamCard({ data, isLoading }: { data: any; isLoading: boolean }) {
  const isOnline = data?.inGame || data?.status === "Online";
  const isInGame = data?.inGame || data?.status === "In-Game";
  const profileUrl = data?.profileUrl || "https://steamcommunity.com/id/skydreamsid/";

  return (
    <Link href={profileUrl} target="_blank" className="group block h-full no-underline">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
      >
        {/* Wide game banner — takes most of the height */}
        <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-[#171a21] to-[#1b2838]">
          {isLoading ? (
            <div className="absolute inset-0 animate-pulse bg-muted/20" />
          ) : data?.currentGameBanner ? (
            <img
              src={data.currentGameBanner}
              alt={data.currentGame || "Game"}
              className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="mb-2 block text-5xl">🎮</span>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          )}

          {/* Top overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Status badge top-left */}
          <div className="absolute left-4 top-4">
            <div className="flex items-center gap-1.5 rounded-md bg-black/50 px-2.5 py-1 backdrop-blur-md">
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  isInGame ? "bg-[#90cdf4]" : isOnline ? "bg-[#4ade80]" : "bg-muted-foreground"
                }`}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/80">
                {isLoading ? "..." : isInGame ? "In Game" : isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* External link top-right */}
          <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
              <ArrowUpRight size={14} className="text-white" />
            </div>
          </div>

          {/* Game name bottom */}
          {(isInGame || data?.currentGame) && !isLoading && (
            <div className="absolute inset-x-0 bottom-0 px-4 py-3">
              <p className="truncate font-sans text-[13px] font-medium text-white drop-shadow-md">
                {data.currentGame}
              </p>
            </div>
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center gap-3 px-5 py-3.5">
          {data?.avatar && (
            <img
              src={data.avatar}
              alt="Steam avatar"
              className="h-7 w-7 rounded-full border border-white/10 object-cover"
            />
          )}
          <p className="flex-1 truncate font-sans text-[13px] font-medium text-foreground">
            {isLoading ? "..." : data?.personaName || "skydreamsid"}
          </p>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/50">
            Steam
          </span>
        </div>
      </motion.div>
    </Link>
  );
}