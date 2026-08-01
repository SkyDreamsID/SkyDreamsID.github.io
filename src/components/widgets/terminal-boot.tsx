"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DISCORD_ID = "765458490248265769";

function randomChar() {
  const chars = "!@#$%^&*()_+[]{}:;<>,.?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

function MatrixText({ text, delayMs, speedMs = 30 }: { text: string, delayMs: number, speedMs?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStarted(true);
      setDisplayedText(text.split('').map(c => c === ' ' ? ' ' : randomChar()).join(''));
    }, delayMs);
    return () => clearTimeout(timeout);
  }, [delayMs, text]);

  useEffect(() => {
    if (!started) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= text.length) {
        clearInterval(interval);
        setDisplayedText(text);
        return;
      }
      
      setDisplayedText((prev) => {
        const chars = prev.split('');
        chars[currentIndex] = text[currentIndex];
        
        // Randomize the remaining characters for the matrix effect
        for (let i = currentIndex + 1; i < chars.length; i++) {
          if (text[i] !== ' ') {
            chars[i] = randomChar();
          } else {
            chars[i] = ' ';
          }
        }
        return chars.join('');
      });
      currentIndex++;
    }, speedMs);
    
    return () => clearInterval(interval);
  }, [started, text, speedMs]);

  if (!started) return null;
  return <div className="min-h-[1.5em]">{displayedText}</div>;
}

export function TerminalBoot() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasBooted, setHasBooted] = useState(true); // default true for SSR safety
  const [lanyardData, setLanyardData] = useState<any>(null);
  const [lines, setLines] = useState<{ text: string, delay: number, speed: number }[]>([]);

  useEffect(() => {
    const booted = sessionStorage.getItem("hasBooted");
    if (!booted) {
      setHasBooted(false);
      
      // Fetch Lanyard
      fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLanyardData(data.data);
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (hasBooted) return;

    const location = lanyardData?.kv?.location || "Madiun, Indonesia";
    const status = lanyardData?.discord_status || "offline";
    const spotify = lanyardData?.spotify ? `${lanyardData.spotify.artist} - ${lanyardData.spotify.song}` : "NONE";

    // Set up the boot sequence
    setLines([
      { text: "> INITIALIZING VAULT-TEC OS v4.2... [OK]", delay: 100, speed: 20 },
      { text: "> LOADING CORE MODULES: NEXT.JS & LANYARD... [OK]", delay: 700, speed: 15 },
      { text: "> PIP-BOY CONFIG: R@ND0M T#XT -> RifkiEkaPutra.config", delay: 1200, speed: 10 },
      { text: "> USER: SKYDREAMSID // status_code:200", delay: 1600, speed: 15 },
      { text: "> FETCHING LIVE DATA...", delay: 2000, speed: 20 },
      { text: `> LOCATION: ${location} (live)`, delay: 2500, speed: 15 },
      { text: `> STATUS: ${status.toUpperCase()}`, delay: 2900, speed: 20 },
      { text: `> LISTENING ACTIVITY: ${spotify.toUpperCase()}`, delay: 3300, speed: 15 },
      { text: "> SYSTEM STATE: OPTIMAL / 100 HP", delay: 3800, speed: 25 },
      { text: "> SYSTEM READY.", delay: 4400, speed: 20 }
    ]);

    const finishTimeout = setTimeout(() => {
      closeTerminal();
    }, 5500);

    return () => clearTimeout(finishTimeout);
  }, [hasBooted, lanyardData]);

  const closeTerminal = () => {
    setIsVisible(false);
    sessionStorage.setItem("hasBooted", "true");
  };

  if (hasBooted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          onClick={closeTerminal}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scaleY: 0.01, 
            scaleX: 1.5,
            filter: "brightness(2) contrast(1.5)",
            transition: { duration: 0.3, ease: "anticipate" } 
          }}
          className="fixed inset-0 z-[100] flex flex-col justify-end bg-[#050505] p-6 sm:p-12 font-vt323 text-[#00FF66] text-xl sm:text-2xl cursor-pointer overflow-hidden"
        >
          {/* Scanlines overlay */}
          <div 
            className="animate-scanlines pointer-events-none absolute inset-0 z-10 opacity-60 mix-blend-overlay"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)" }}
          ></div>
          
          <div className="relative z-20 flex flex-col gap-1 [text-shadow:0_0_8px_rgba(0,255,102,0.8)]">
            {lines.map((line, idx) => (
              <MatrixText key={idx} text={line.text} delayMs={line.delay} speedMs={line.speed} />
            ))}
          </div>
          
          <div className="absolute right-6 top-6 text-sm opacity-50 z-20">
            [CLICK TO SKIP]
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
