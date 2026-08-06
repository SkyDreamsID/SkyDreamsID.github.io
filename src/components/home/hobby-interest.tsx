"use client";

import React from "react";
import { Terminal, Cpu, Camera, Train, Wrench, Laptop, Code, Music, Heart, Box } from "lucide-react";
import useSWR from "swr";
import { fetchSkyDreamsAPI } from "@/services/api";
import { useLanguage } from "@/context/language-context";
import { MatrixText } from "@/components/ui/matrix-text";

const iconMap: Record<string, React.ReactNode> = {
  laptop: <Laptop size={22} />,
  code: <Code size={22} />,
  music: <Music size={22} />,
  heart: <Heart size={22} />,
  box: <Box size={22} />,
  terminal: <Terminal size={22} />,
  cpu: <Cpu size={22} />,
  camera: <Camera size={22} />,
  train: <Train size={22} />,
  default: <Wrench size={22} />,
};

interface HobbyCategory {
  title: string;
  icon: string;
  items: string[];
}

export function HobbyInterest() {
  const { t } = useLanguage();
  const { data: arsenalRes, isLoading: isArsenalLoading } = useSWR<any>("/personal-hub/arsenal", fetchSkyDreamsAPI, { refreshInterval: 60000 });
  const { data: generalArsenalRes, isLoading: isGeneralLoading } = useSWR<any>("/general/arsenal", fetchSkyDreamsAPI, { refreshInterval: 60000 });
  const { data: legacyHobbies, isLoading: isLegacyLoading } = useSWR<any>("/hobbies", fetchSkyDreamsAPI, { refreshInterval: 60000 });

  const isLoading = (isArsenalLoading && isGeneralLoading && isLegacyLoading) || (!arsenalRes && !generalArsenalRes && !legacyHobbies);

  // Ekstrak array dari response
  const rawArsenal: any[] = Array.isArray(arsenalRes)
    ? arsenalRes
    : Array.isArray(arsenalRes?.data)
    ? arsenalRes.data
    : Array.isArray(generalArsenalRes)
    ? generalArsenalRes
    : Array.isArray(generalArsenalRes?.data)
    ? generalArsenalRes.data
    : [];

  const legacyList: HobbyCategory[] = Array.isArray(legacyHobbies)
    ? legacyHobbies
    : Array.isArray(legacyHobbies?.data)
    ? legacyHobbies.data
    : [];

  let categories: HobbyCategory[] = [];
  if (rawArsenal.length > 0) {
    const map = new Map<string, { title: string; icon: string; items: string[] }>();
    rawArsenal.forEach((item) => {
      const cat = item.category || "General";
      if (!map.has(cat)) {
        map.set(cat, { title: cat, icon: item.icon || "default", items: [] });
      }
      if (item.name) map.get(cat)!.items.push(item.name);
    });
    categories = Array.from(map.values());
  } else if (legacyList.length > 0) {
    categories = legacyList;
  }

  const showMatrix = isLoading || categories.length === 0;

  return (
    <section id="interests" className="w-full border-t border-zinc-800 bg-zinc-950/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-zinc-50 sm:text-4xl">
            {t.interests.title}
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            {t.interests.subtitle}
          </p>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {showMatrix ? (
            // Matrix loading cards
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col justify-center rounded-xl border border-emerald-900/30 bg-zinc-900/50 p-6 min-h-[130px]">
                <div className="mb-4 flex items-center gap-3">
                  <Cpu size={22} className="text-emerald-700/40" />
                  <span className="font-mono text-sm font-bold">
                    <MatrixText infinite placeholderLength={12} scrambleSpeed={35 + idx * 12} className="text-emerald-500/50" />
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((__, i) => (
                    <span key={i} className="inline-flex items-center rounded-md bg-zinc-800/40 px-2.5 py-1 font-mono text-xs">
                      <MatrixText infinite placeholderLength={6 + i} scrambleSpeed={50 + i * 8} className="text-emerald-500/30" />
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            categories.map((category, idx) => {
              const icon = iconMap[category.icon] || iconMap.default;

              return (
                <div 
                  key={idx} 
                  className="flex flex-col justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700"
                >
                  <div className="mb-5 flex items-center gap-3 text-emerald-500">
                    {icon}
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
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
