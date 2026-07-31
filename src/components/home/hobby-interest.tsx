"use client";

import { Terminal, Cpu, Camera, Train } from "lucide-react";

const categories = [
  {
    title: "OS & Environment",
    icon: <Terminal size={22} />,
    items: ["ThinkPad T420", "Linux Mint / ParrotOS", "VirtualBox"],
  },
  {
    title: "Engineering & Code",
    icon: <Cpu size={22} />,
    items: ["Python", "C / C++", "PLC & Automation", "Next.js"],
  },
  {
    title: "Creative & Audio",
    icon: <Camera size={22} />,
    items: ["FL Studio 21 (EDM)", "Nikon D3300", "Premiere Pro CC"],
  },
  {
    title: "Passions & Interests",
    icon: <Train size={22} />,
    items: ["Railfan / Train Ops", "Open Source", "OSINT"],
  },
];

export function HobbyInterest() {
  return (
    <section id="interests" className="w-full border-t border-zinc-800 bg-zinc-950/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-zinc-50 sm:text-4xl">
            Hobby & Arsenal
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Alat dan ketertarikan di luar dunia akademik.
          </p>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {categories.map((category, idx) => (
            <div 
              key={idx} 
              className="flex flex-col justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700"
            >
              <div className="mb-5 flex items-center gap-3 text-emerald-500">
                {category.icon}
                <h3 className="font-heading text-xl font-bold text-zinc-100">
                  {category.title}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2.5">
                {category.items.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-zinc-800/60 px-2.5 py-1 font-mono text-xs text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-emerald-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
