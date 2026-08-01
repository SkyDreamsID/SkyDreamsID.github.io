"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "> INITIALIZING VAULT-TEC OS v4.2... [OK]",
  "> MOUNTING CORE MODULES...",
  "> CHECKING PIP-BOY STATUS... 100 HP / OPTIMAL",
  "> CONNECTING TO SKYDREAMSID HUB...",
  "> SYSTEM READY.",
];

export function TerminalBoot() {
  const [isVisible, setIsVisible] = useState(true);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Keyboard / Click skip handler
  useEffect(() => {
    const handleKeyDown = () => {
      if (isVisible) {
        setCompletedLines(BOOT_LINES);
        setIsFinished(true);
        setTimeout(handleFinish, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleFinish]);

  // Lock body scroll while booting
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // Typewriter effect logic
  useEffect(() => {
    if (!isVisible || isFinished) return;

    if (currentLineIndex >= BOOT_LINES.length) {
      setIsFinished(true);
      const timer = setTimeout(() => {
        handleFinish();
      }, 800);
      return () => clearTimeout(timer);
    }

    const targetLine = BOOT_LINES[currentLineIndex];

    if (currentCharIndex < targetLine.length) {
      const charTimer = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(charTimer);
    } else {
      // Line completed, pause before next line
      const lineTimer = setTimeout(() => {
        setCompletedLines((prev) => [...prev, targetLine]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 200);
      return () => clearTimeout(lineTimer);
    }
  }, [isVisible, currentLineIndex, currentCharIndex, isFinished, handleFinish]);

  const handleContainerClick = () => {
    if (!isFinished) {
      setCompletedLines(BOOT_LINES);
      setIsFinished(true);
      setTimeout(handleFinish, 300);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={handleContainerClick}
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black p-6 sm:p-12 font-mono text-green-500 select-none cursor-pointer overflow-hidden"
        >
          {/* CRT Scanline Overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)",
            }}
          />

          {/* Terminal Content */}
          <div className="relative z-20 flex flex-col space-y-2 [text-shadow:0_0_8px_rgba(34,197,94,0.7)] text-sm sm:text-base md:text-lg leading-relaxed">
            {/* Header */}
            <div className="mb-4 pb-2 border-b border-green-500/40 text-xs sm:text-sm tracking-widest text-green-500/70">
              VAULT-TEC CORPORATION (R) PIP-OS V4.2 — SYSTEM BOOT
            </div>

            {/* Completed Lines */}
            {completedLines.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}

            {/* Currently Typing Line */}
            {!isFinished && currentLineIndex < BOOT_LINES.length && (
              <div className="whitespace-pre-wrap">
                {BOOT_LINES[currentLineIndex].slice(0, currentCharIndex)}
                <span className="animate-pulse bg-green-500 text-black px-0.5 ml-0.5">█</span>
              </div>
            )}

            {/* Final Cursor when done */}
            {isFinished && (
              <div className="pt-2">
                <span className="animate-pulse bg-green-500 text-black px-0.5">█</span>
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="relative z-20 pt-4 text-center text-xs tracking-widest text-green-500/50 animate-pulse">
            [ KLIK ATAU TEKAN TOMBOL APAPUN UNTUK MELANGKAHI ]
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
