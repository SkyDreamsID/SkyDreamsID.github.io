"use client";

import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.interests, href: "#interests" },
    { label: t.nav.ecosystem, href: "#ecosystem" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      window.scrollTo({
        top: elem.offsetTop - 64, // Offset for navbar height
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] h-16 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md"
          : "bg-zinc-950 border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Left: Logo */}
        <div className="flex flex-col">
          <Link
            href="#home"
            onClick={(e) => smoothScroll(e, "#home")}
            className="font-heading text-lg font-bold text-zinc-50 transition-opacity hover:opacity-80"
          >
            Rifki Eka Putra
          </Link>
          <span className="font-mono text-[10px] text-zinc-400">@SkyDreamsID</span>
        </div>

        {/* Middle: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => smoothScroll(e, link.href)}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-emerald-500"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Lang & Status */}
        <div className="hidden md:flex items-center gap-4">
          {/* Desktop Language Button */}
          <button
            onClick={() => setLanguage(language === "id" ? "en" : "id")}
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs font-bold text-emerald-400 transition-all hover:border-emerald-500/40 hover:bg-zinc-800"
          >
            <Globe size={14} />
            <span>{language.toUpperCase()}</span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] font-semibold tracking-wider text-emerald-500">
              API LIVE
            </span>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Mobile Language Button */}
          <button
            onClick={() => setLanguage(language === "id" ? "en" : "id")}
            className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-xs font-bold text-emerald-400 transition-colors hover:border-emerald-500/40"
          >
            <Globe size={13} />
            <span>{language.toUpperCase()}</span>
          </button>

          <button
            onClick={() => setMobileOpen(true)}
            className="text-zinc-100 hover:text-emerald-500"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-0 z-[200] w-full border-b border-zinc-800 bg-zinc-950 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold text-zinc-50">Rifki Eka Putra</span>
                <span className="font-mono text-[10px] text-zinc-400">@SkyDreamsID</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-zinc-100">
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => smoothScroll(e, link.href)}
                  className="text-lg font-medium text-zinc-300 hover:text-emerald-500"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-6">
              <button
                onClick={() => setLanguage(language === "id" ? "en" : "id")}
                className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-xs font-bold text-emerald-400"
              >
                <Globe size={14} />
                <span>{language.toUpperCase()}</span>
              </button>
              <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[10px] font-semibold text-emerald-500">API LIVE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
