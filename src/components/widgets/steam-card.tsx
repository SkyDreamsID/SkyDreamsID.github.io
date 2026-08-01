"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function SteamCard({ data, isLoading }: { data: any; isLoading: boolean }) {
  const isOnline = data?.inGame || data?.status === "Online";
  const isInGame = data?.inGame || data?.status === "In-Game";
  const profileUrl = data?.profileUrl || "https://steamcommunity.com/id/SkyDreamsID/";
  
  // Karena keterbatasan API Steam publik tanpa key, kita belum bisa fetch frame otomatis.
  // Lu bisa masukin URL avatar frame lu di sini!
  // Cara dapet URL frame lu: Buka profil Steam lu di browser -> Klik kanan di frame avatar lu -> Inspect -> Copy link gambarnya yang berakhiran .png
  const avatarFrameUrl = "https://shared.fastly.steamstatic.com/community_assets/images/items/3099240/b3646c59c6a05ce8cdd1b879c691e1b95fd79bf0.png";

  return (
    <Link href={profileUrl} target="_blank" className="group block h-full no-underline">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-[#18181b]"
      >
        {/* Banner Section */}
        <div className="relative h-[70%] w-full overflow-hidden bg-zinc-800">
          {isLoading ? (
            <div className="absolute inset-0 animate-pulse bg-muted/20" />
          ) : data?.currentGameBanner ? (
            <img
              src={data.currentGameBanner}
              alt={data.currentGame || "Game"}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#171a21] to-[#1b2838]">
              <div className="text-center">
                <span className="mb-2 block text-4xl">🎮</span>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          )}

          {/* Bottom text gradient overlay (only at the bottom of the image for text readability) */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#18181b] via-[#18181b]/50 to-transparent" />

          {/* Status badge top-left */}
          <div className="absolute left-3 top-3">
            <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
              <div
                className={`h-2 w-2 rounded-full ${
                  isInGame ? "bg-[#3b82f6]" : isOnline ? "bg-[#4ade80]" : "bg-muted-foreground"
                }`}
              />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/90">
                {isLoading ? "..." : isInGame ? "In Game" : isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* External link top-right */}
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-md">
              <ArrowUpRight size={14} className="text-white" />
            </div>
          </div>

          {/* Game name bottom */}
          {(isInGame || data?.currentGame) && !isLoading && (
            <div className="absolute inset-x-0 bottom-0 px-4 py-2">
              <p className="truncate font-sans text-[15px] font-bold text-white drop-shadow-md">
                {data.currentGame}
              </p>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="relative flex h-[30%] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Avatar with Frame */}
            <div className="relative h-9 w-9 flex-shrink-0">
              {data?.avatar && (
                <img
                  src={data.avatar}
                  alt="Steam avatar"
                  className="absolute inset-0 h-full w-full rounded-sm object-cover"
                />
              )}
              {/* Avatar Frame (Scaled correctly to match Steam's 1.22x ratio) */}
              {avatarFrameUrl && (
                <img 
                  src={avatarFrameUrl}
                  alt="Avatar Frame"
                  className="absolute inset-0 h-full w-full scale-[1.22] max-w-none object-cover z-10 drop-shadow-md pointer-events-none"
                />
              )}
            </div>
            
            <p className="truncate font-sans text-[14px] font-bold text-zinc-100 z-10">
              {isLoading ? "..." : data?.personaName || "SkyDreamsID"}
            </p>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 z-10">
            Steam
          </span>
        </div>
      </motion.div>
    </Link>
  );
}