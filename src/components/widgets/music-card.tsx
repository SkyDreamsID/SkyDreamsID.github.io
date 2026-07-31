"use client";

import { Disc3 } from "lucide-react";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

function MarqueeText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const sw = textRef.current.scrollWidth;
        const cw = containerRef.current.clientWidth;
        if (sw > cw) {
          setOverflow(sw - cw + 24); // Tambah sedikit padding di akhir
        } else {
          setOverflow(0);
        }
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <div ref={containerRef} className={`relative flex w-full overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        ref={textRef}
        className="inline-block"
        animate={
          overflow > 0
            ? { x: [0, 0, -overflow, -overflow, 0] }
            : { x: 0 }
        }
        transition={
          overflow > 0
            ? {
                duration: 12,
                times: [0, 0.2, 0.5, 0.7, 1], // Pause 2.4s, Slide 3.6s, Pause 2.4s, Slide back 3.6s
                repeat: Infinity,
                ease: "linear",
              }
            : {}
        }
      >
        {text}
      </motion.div>
      {/* Efek gradient di pinggir agar potongan teks halus */}
      {overflow > 0 && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-900 to-transparent transition-all group-hover:from-zinc-800/50"></div>
      )}
    </div>
  );
}

interface MusicCardProps {
  data?: {
    isPlaying: boolean;
    title: string | null;
    artist: string | null;
    album: string | null;
    coverUrl?: string | null;
    url?: string | null;
    dateText?: string;
  } | null;
  isLoading?: boolean;
}

export function MusicCard({ data, isLoading }: MusicCardProps) {
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="h-4 w-1/3 rounded bg-zinc-800 animate-pulse"></div>
        <div className="flex items-center gap-5">
          <div className="h-24 w-24 rounded-lg bg-zinc-800 animate-pulse"></div>
          <div className="flex-1 space-y-3">
            <div className="h-5 w-3/4 rounded bg-zinc-800 animate-pulse"></div>
            <div className="h-4 w-1/2 rounded bg-zinc-800 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const hasData = data?.title && data?.artist;
  const targetUrl = data?.url || "#";

  return (
    <a
      href={targetUrl}
      target={targetUrl !== "#" ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex h-full w-full flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-emerald-500/50 hover:bg-zinc-800/50 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
          <Disc3 size={16} className={data?.isPlaying ? "animate-spin" : ""} />
          {data?.isPlaying ? "Now Playing" : "Last Played"}
        </div>
        {!data?.isPlaying && data?.dateText && (
          <span className="font-mono text-[10px] text-zinc-500">{data.dateText}</span>
        )}
      </div>

      <div className="flex items-center gap-5 mt-auto mb-auto">
        {hasData && data.coverUrl ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg">
            <Image
              src={data.coverUrl}
              alt={data.album || "Album cover"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="96px"
            />
          </div>
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-700 shadow-lg">
            <Disc3 size={32} />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1">
          <MarqueeText 
            text={hasData ? data.title! : "Not Playing"} 
            className="font-heading text-lg font-bold text-zinc-100 group-hover:text-emerald-500 transition-colors"
          />
          <MarqueeText 
            text={hasData ? data.artist! : "Spotify / Apple Music"} 
            className="text-base text-zinc-400"
          />
          <MarqueeText 
            text={hasData ? data.album! : ""} 
            className="text-sm text-zinc-500"
          />
        </div>
      </div>
    </a>
  );
}