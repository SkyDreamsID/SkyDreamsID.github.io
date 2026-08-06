"use client";

import { SocialIcons } from "@/components/ui/social-icons";

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
          {/* Social Icons — dari API /general/socials */}
          <SocialIcons iconClass="h-[18px] w-[18px]" />

          <div className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-500">
            v1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}
