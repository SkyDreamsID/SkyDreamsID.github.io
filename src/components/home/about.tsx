"use client";

import useSWR from "swr";
import { fetchSkyDreamsAPI, ProfileResponse } from "@/services/api";
import { useLanguage } from "@/context/language-context";

export function About() {
  const { data, isLoading } = useSWR<ProfileResponse>("/profile", fetchSkyDreamsAPI, {
    refreshInterval: 60000,
  });
  const { language, t } = useLanguage();

  const bioText = language === "en" 
    ? (data?.profile?.bio_en || data?.profile?.bio_id) 
    : data?.profile?.bio_id;

  return (
    <section id="about" className="w-full border-t border-zinc-800 bg-zinc-950/50 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        
        {/* Header */}
        <div className="mb-10">
          <h2 className="font-heading text-3xl font-bold text-zinc-50 sm:text-4xl">
            {t.about.title}
          </h2>
        </div>

        {/* Storytelling Paragraphs */}
        <div className="space-y-6 text-base leading-relaxed text-zinc-400">
          {isLoading ? (
            <div className="space-y-4">
              <span className="inline-block h-4 w-full animate-pulse rounded bg-zinc-800"></span>
              <span className="inline-block h-4 w-11/12 animate-pulse rounded bg-zinc-800"></span>
              <span className="inline-block h-4 w-3/4 animate-pulse rounded bg-zinc-800"></span>
            </div>
          ) : bioText ? (
            bioText.split("\n").map((paragraph: string, idx: number) => (
              paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
            ))
          ) : (
            <p>{t.about.empty}</p>
          )}
        </div>

      </div>
    </section>
  );
}
