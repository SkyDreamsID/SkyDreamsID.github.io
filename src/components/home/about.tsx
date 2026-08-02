"use client";

import { Briefcase, GraduationCap, FileText } from "lucide-react";
import useSWR from "swr";
import { fetchSkyDreamsAPI, ProfileResponse } from "@/services/api";

export function About() {
  const { data, isLoading } = useSWR<ProfileResponse>("/profile", fetchSkyDreamsAPI, {
    refreshInterval: 60000,
  });

  return (
    <section id="about" className="w-full border-t border-zinc-800 bg-zinc-950/50 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        
        {/* Header */}
        <div className="mb-10">
          <h2 className="font-heading text-3xl font-bold text-zinc-50 sm:text-4xl">
            Tentang Saya
          </h2>
        </div>

        {/* Storytelling Paragraphs (Opsi B) */}
        <div className="space-y-6 text-base leading-relaxed text-zinc-400">
          {isLoading ? (
            <div className="space-y-4">
              <span className="inline-block h-4 w-full animate-pulse rounded bg-zinc-800"></span>
              <span className="inline-block h-4 w-11/12 animate-pulse rounded bg-zinc-800"></span>
              <span className="inline-block h-4 w-3/4 animate-pulse rounded bg-zinc-800"></span>
            </div>
          ) : data?.profile?.bio_id ? (
            data.profile.bio_id.split("\n").map((paragraph: string, idx: number) => (
              paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
            ))
          ) : (
            <p>Belum ada bio yang ditulis.</p>
          )}
        </div>

      </div>
    </section>
  );
}
