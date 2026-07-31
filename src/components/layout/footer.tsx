"use client";

import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-zinc-800 bg-zinc-950 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        {/* Copyright */}
        <p className="text-sm text-zinc-500">
          © 2026 Rifki Eka Putra (SkyDreamsID). All rights reserved.
        </p>

        {/* Social & Version */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-zinc-400">
            <a href="https://github.com/skydreamsid" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
            <a href="https://linkedin.com/in/rifkiekaputra" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
              <LinkedinIcon className="h-[18px] w-[18px]" />
            </a>
            <a href="https://instagram.com/skydreamsid" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
              <InstagramIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
          
          <div className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-500">
            v1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}
