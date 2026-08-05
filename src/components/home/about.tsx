"use client";

import useSWR from "swr";
import { fetchSkyDreamsAPI } from "@/services/api";
import { useLanguage } from "@/context/language-context";
import { MatrixBlock } from "@/components/ui/matrix-text";

export function About() {
  const { data, isLoading } = useSWR<any>("/personal-hub/profile", fetchSkyDreamsAPI, {
    refreshInterval: 60000,
  });
  const { language, t } = useLanguage();

  const bioText = language === "en" 
    ? (data?.bio_en || data?.bio_id || data?.profile?.bio_en || data?.profile?.bio_id) 
    : (data?.bio_id || data?.profile?.bio_id);

  return (
    <section id="about" className="w-full border-t border-zinc-800 bg-zinc-950/50 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        
        {/* Header */}
        <div className="mb-10">
          <h2 className="font-heading text-3xl font-bold text-zinc-50 sm:text-4xl">
            {t.about.title}
          </h2>
        </div>

        {/* Bio — Matrix scramble saat loading/kosong, decode saat data ada */}
        <div className="space-y-6 text-base leading-relaxed text-zinc-400">
          <MatrixBlock
            text={bioText}
            isLoading={isLoading}
            placeholderLines={3}
            paragraphClassName="text-zinc-400"
          />
        </div>

      </div>
    </section>
  );
}
