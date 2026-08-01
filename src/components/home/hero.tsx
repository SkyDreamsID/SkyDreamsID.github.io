"use client";

import useSWR from "swr";
import { fetchSkyDreamsAPI, HomeResponse, LastfmResponse } from "@/services/api";
import { ArrowRight, MapPin, Target, Radio, Clock, Zap } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TypewriterText({ text, delay = 0, className }: { text: string, delay?: number, className?: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [text, started]);

  return <span className={className}>{displayedText}</span>;
}

function RotatingText({ items, className }: { items: string[], className?: string }) {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    const currentText = items[index];
    
    let timeout: NodeJS.Timeout;
    
    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length - 1));
        if (displayedText.length <= 1) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % items.length);
        }
      }, 30);
    } else {
      timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
        if (displayedText.length === currentText.length) {
          timeout = setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 50);
    }
    
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, index, items]);

  if (items.length === 0) return null;

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse opacity-70">|</span>
    </span>
  );
}

function MarqueeText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const sw = textRef.current.scrollWidth;
        const cw = containerRef.current.clientWidth;
        if (sw > cw + 2) {
          setOverflow(sw - cw + 16);
        } else {
          setOverflow(0);
        }
      }
    };
    
    // Check initially
    checkOverflow();
    
    // Check when fonts are loaded (critical for custom fonts)
    document.fonts.ready.then(checkOverflow);
    
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
                times: [0, 0.2, 0.5, 0.7, 1],
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {}
        }
      >
        {text}
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { data: homeData, isLoading: isHomeLoading, error: homeError } = useSWR<HomeResponse>("/home", fetchSkyDreamsAPI, { refreshInterval: 60000 });
  const { data: lastfmData, isLoading: isLastfmLoading, error: lastfmError } = useSWR<LastfmResponse>("/lastfm", fetchSkyDreamsAPI, { refreshInterval: 60000 });
  const { data: profileData, isLoading: isProfileLoading } = useSWR<any>("/profile", fetchSkyDreamsAPI, { refreshInterval: 60000 });

  const systemState = (isHomeLoading || isLastfmLoading) 
    ? "ESTABLISHING CONNECTION..." 
    : (homeError || lastfmError) 
      ? "CRITICAL / CONNECTION LOST" 
      : "OPTIMAL / 100 HP";

  // Live Clock for SYS-TIME
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTrack = lastfmData?.nowPlaying || lastfmData?.recentTracks?.[0];

  return (
    <section id="home" className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center pt-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:gap-8 py-12">
        
        {/* Left Column (7) */}
        <div className="flex flex-col justify-start lg:col-span-7 lg:pt-2">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-zinc-50 sm:text-6xl md:text-7xl">
            <TypewriterText text="Halo, saya " delay={100} />
            <br className="hidden sm:block" />
            <span className="text-emerald-500">
              <TypewriterText text={isProfileLoading ? "..." : (profileData?.profile?.hero_name || "Rifki Eka Putra")} delay={800} />
            </span>
          </h1>
          
          <div className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 sm:text-xl h-[1.5em]">
            {isProfileLoading ? "..." : (
              <RotatingText 
                items={(profileData?.profile?.hero_tagline || "Mahasiswa D4 Teknologi Rekayasa Elektronika @ Politeknik Negeri Madiun").split("|").map((t: string) => t.trim())} 
              />
            )}
          </div>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-lg bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200"
            >
              Lihat Proyek
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-zinc-50"
            >
              Kontak
            </a>
          </motion.div>

          {/* Social Icons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex items-center gap-5 text-zinc-400"
          >
            <a href="https://github.com/SkyDreamsID" target="_blank" rel="noreferrer" className="transition-colors hover:text-emerald-500">
              <GithubIcon className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-emerald-500">
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-emerald-500">
              <InstagramIcon className="h-5 w-5" />
            </a>
          </motion.div>
        </div>

        {/* Right Column (5) - Pip-Boy 3000 HUD */}
        <div className="flex items-center justify-center lg:col-span-5 lg:items-start lg:justify-end lg:pt-0">
          <div className="animate-pipboy relative w-full max-w-[420px] rounded-2xl border-2 border-[#00FF66]/80 bg-zinc-950/90 p-5 shadow-[0_0_25px_rgba(0,255,102,0.2)] backdrop-blur-md transition-all">
            
            {/* Scanline overlay */}
            <div 
              className="animate-scanlines pointer-events-none absolute inset-0 z-10 opacity-60 mix-blend-overlay rounded-2xl"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)" }}
            ></div>
            
            <div className="animate-crt-text relative z-20 flex flex-col font-['Monofonto'] text-[13px] leading-relaxed text-[#00FF66] [text-shadow:0_0_5px_rgba(0,255,102,0.7)] sm:text-[14px]">
              
              {/* Header */}
              <div className="mb-4 flex items-center gap-2 border-b-2 border-[#00FF66]/40 pb-2">
                <Zap size={15} className="text-[#00FF66]" />
                <span className="font-bold tracking-widest text-[16px]">LIVE STATUS</span>
                <span className="animate-pulse text-[16px]">█</span>
              </div>

              {/* Data Rows */}
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 w-full">
                  <MapPin size={15} className="shrink-0 mt-0.5 opacity-80" />
                  <span className="w-24 shrink-0 opacity-80 tracking-wider">LOCATION</span>
                  <span className="uppercase">: {(isProfileLoading || isHomeLoading) ? "..." : (profileData?.profile?.location || homeData?.status?.location || "Madiun, Indonesia")}</span>
                </div>
                  
                  <div className="flex items-start gap-2.5 w-full">
                    <Target size={15} className="shrink-0 mt-0.5 opacity-80" />
                    <span className="w-24 shrink-0 opacity-80 tracking-wider">FOCUSING</span>
                    <span className="uppercase line-clamp-1">: {isHomeLoading ? "..." : (homeData?.status?.activity || "PLC & System Automation")}</span>
                  </div>
                  
                  <div className="flex items-start gap-2.5 w-full">
                    <Radio size={15} className="shrink-0 mt-0.5 opacity-80" />
                    <span className="w-24 shrink-0 opacity-80 tracking-wider">RAD-WAVE</span>
                    <div className="flex flex-1 min-w-0">
                      <span className="whitespace-pre">: </span>
                      <MarqueeText 
                        text={isLastfmLoading ? "..." : (lastfmData?.nowPlaying ? `${lastfmData.nowPlaying.artist} - ${lastfmData.nowPlaying.title}` : "OFFLINE")} 
                        className="uppercase" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2.5 w-full">
                    <Clock size={15} className="shrink-0 mt-0.5 opacity-80" />
                    <span className="w-24 shrink-0 opacity-80 tracking-wider">SYS-TIME</span>
                    <span className="uppercase">: {time || "00:00:00 WIB"}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 border-t-2 border-[#00FF66]/40 pt-3 text-center">
                  <span className={`tracking-widest ${systemState.includes("CRITICAL") ? "text-red-500 animate-pulse" : ""}`}>
                    SYSTEM STATE: {systemState}
                  </span>
                </div>
                
              </div>
            </div>
          </div>

        </div>
      </section>
  );
}
