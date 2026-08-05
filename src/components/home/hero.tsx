"use client";

import useSWR from "swr";
import { fetchSkyDreamsAPI, HomeResponse, LastfmResponse } from "@/services/api";
import { ArrowRight, MapPin, Target, Radio, Clock, Zap } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MatrixText } from "@/components/ui/matrix-text";


import { useLanguage } from "@/context/language-context";

function RotatingText({ items, className }: { items: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    const currentText = items[index];

    let timer: NodeJS.Timeout;

    if (isWaiting) {
      // Teks selesai ketik penuh -> jeda & berkedip (1200ms)
      timer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, 1200);
    } else if (isDeleting) {
      // Hapus karakter satu per satu (45ms per karakter)
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length - 1));
        }, 45);
      } else {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % items.length);
      }
    } else {
      // Ketik karakter satu per satu (90ms per karakter)
      if (displayedText.length < currentText.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, 90);
      } else {
        // Seluruh teks sudah keload -> masuk mode WAITING (kursor mulai berkedip)
        setIsWaiting(true);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, isWaiting, index, items]);

  if (items.length === 0) return null;

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        key={isWaiting ? "waiting" : "typing"}
        animate={isWaiting ? { opacity: [1, 0, 1] } : { opacity: 1 }}
        transition={
          isWaiting
            ? { repeat: Infinity, duration: 0.5, ease: "easeInOut" }
            : { duration: 0 }
        }
        className="inline-block text-emerald-500 font-bold ml-0.5"
      >
        |
      </motion.span>
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
    
    checkOverflow();
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
  const { language, t } = useLanguage();
  const { data: homeData, isLoading: isHomeLoading, error: homeError } = useSWR<HomeResponse>("/home", fetchSkyDreamsAPI, { refreshInterval: 60000 });
  const { data: lastfmData, isLoading: isLastfmLoading, error: lastfmError } = useSWR<LastfmResponse>("/lastfm", fetchSkyDreamsAPI, { refreshInterval: 60000 });
  const { data: profileData, isLoading: isProfileLoading } = useSWR<any>("/personal-hub/profile", fetchSkyDreamsAPI, { refreshInterval: 60000 });
  const { data: statusData } = useSWR<any>("/general/status", fetchSkyDreamsAPI, { refreshInterval: 30000 });



  // Pip-Boy Card 5-Phase Animation State
  const [pipboyPhase, setPipboyPhase] = useState(1);

  useEffect(() => {
    // Phase 1 (0-300ms): Card Fade In & blank screen
    const t2 = setTimeout(() => setPipboyPhase(2), 300);   // Phase 2: INITIALIZING PIP-BOY...
    const t3 = setTimeout(() => setPipboyPhase(3), 800);   // Phase 3: Matrix Decryption
    const t4 = setTimeout(() => setPipboyPhase(4), 1800);  // Phase 4: Connected ke skydreamsid-api-core... [OK]
    const t5 = setTimeout(() => setPipboyPhase(5), 2600);  // Phase 5: Success & Live Status UI

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleSkipPipboy = () => {
    if (pipboyPhase < 5) {
      setPipboyPhase(5);
    }
  };

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

  const heroName = isProfileLoading ? "..." : (profileData?.hero_name || profileData?.profile?.hero_name || "Rifki Eka Putra");

  return (
    <section id="home" className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center pt-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:gap-8 py-12">
        
        {/* Left Column (7) */}
        <div className="flex flex-col justify-start lg:col-span-7 lg:pt-2">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-4xl font-bold tracking-tight text-zinc-50 sm:text-6xl md:text-7xl"
          >
            <span className="block">{t.hero.greeting}</span>
            <span className="block text-emerald-500 whitespace-nowrap">
              <MatrixText
                text={profileData?.hero_name || profileData?.profile?.hero_name || (isProfileLoading ? null : "Rifki Eka Putra")}
                scrambleSpeed={30}
                decodeDelay={300}
                placeholderLength={15}
                className="text-emerald-500 whitespace-nowrap"
                once
              />
            </span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 sm:text-xl h-[1.5em]"
          >
            <span className="text-zinc-400 font-bold">{"> "}</span>
            <RotatingText 
              items={(
                (language === "en" 
                  ? (profileData?.hero_tagline_en || profileData?.hero_tagline || profileData?.profile?.hero_tagline_en || profileData?.profile?.hero_tagline)
                  : (profileData?.hero_tagline || profileData?.profile?.hero_tagline)) || 
                "Mahasiswa Rekayasa Elektronika | Fotografer & Railfan Enthusiast"
              )
                .split("|")
                .map((t: string) => t.trim())
                .filter(Boolean)
                .map((t: string) => t.replace(/^>\s*/, ""))} 
            />
          </motion.div>

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
              {t.hero.seeProjects}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-zinc-50"
            >
              {t.hero.contact}
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
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleSkipPipboy}
            className="animate-pipboy relative w-full max-w-[420px] rounded-2xl border-2 border-[#00FF66]/80 bg-zinc-950/90 p-5 shadow-[0_0_25px_rgba(0,255,102,0.2)] backdrop-blur-md transition-all min-h-[300px] cursor-pointer overflow-hidden"
          >
            {/* Scanline overlay */}
            <div 
              className="animate-scanlines pointer-events-none absolute inset-0 z-10 opacity-60 mix-blend-overlay rounded-2xl"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)" }}
            />
            
            <div className="animate-crt-text relative z-20 flex flex-col font-['Monofonto'] text-[13px] leading-relaxed text-[#00FF66] [text-shadow:0_0_5px_rgba(0,255,102,0.7)] sm:text-[14px] h-full justify-between">
              
              {/* Phase 1: Card Fade In / Blank */}
              {pipboyPhase === 1 && (
                <div className="flex h-full min-h-[260px] items-start pt-2">
                  <span className="animate-pulse opacity-50 block">_</span>
                </div>
              )}

              {/* Phase 2, 3, 4: Booting & Matrix Decryption */}
              {(pipboyPhase >= 2 && pipboyPhase <= 4) && (
                <div className="space-y-1.5 min-h-[260px] flex flex-col pt-2 uppercase font-mono">
                  {/* Phase 2 */}
                  <div>&gt; INITIALIZING PIP-BOY...</div>

                  {/* Phase 3 */}
                  {pipboyPhase >= 3 && (
                    <>
                      <MatrixText text="> MOUNTING CORE MODULES... [OK]" decodeDelay={0} scrambleSpeed={12} once />
                      <MatrixText text="> CHECKING PIP-BOY STATUS... 100 HP" decodeDelay={300} scrambleSpeed={10} once />
                    </>
                  )}

                  {/* Phase 4 */}
                  {pipboyPhase >= 4 && (
                    <div className="text-emerald-400 font-bold pt-1">
                      &gt; Connected ke skydreamsid-api-core... [OK]
                    </div>
                  )}

                  <span className="animate-pulse opacity-50 block mt-2">_</span>
                </div>
              )}

              {/* Phase 5: Success - Live Status UI */}
              {pipboyPhase === 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
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
                </motion.div>
              )}
                
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
