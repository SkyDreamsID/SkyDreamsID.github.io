"use client";

import { Terminal, Cpu, Camera, Train, Wrench, Laptop, Code, Music, Heart, Box } from "lucide-react";
import useSWR from "swr";
import { fetchSkyDreamsAPI } from "@/services/api";
import { useLanguage } from "@/context/language-context";

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
  const { data, isLoading } = useSWR<HobbyCategory[]>("/hobbies", fetchSkyDreamsAPI, {
    refreshInterval: 60000,
  });

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
          {isLoading ? (
            // Skeleton Loader
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 h-32 animate-pulse"></div>
            ))
          ) : data && data.length > 0 ? (
            data.map((category, idx) => {
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
          ) : (
            <p className="col-span-2 text-center text-sm text-zinc-500">{t.interests.empty}</p>
          )}
        </div>
      </div>
    </section>
  );
}
