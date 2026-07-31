"use client";

import { Briefcase, GraduationCap, FileText } from "lucide-react";
import useSWR from "swr";
import { fetchSkyDreamsAPI, ProfileResponse } from "@/services/api";

export function About() {
  const { data, isLoading } = useSWR<ProfileResponse>("/profile", fetchSkyDreamsAPI, {
    refreshInterval: 60000,
  });

  const educations = data?.education || [];
  const experiences = data?.experiences || [];

  return (
    <section id="about" className="w-full border-t border-zinc-800 bg-zinc-950/50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mb-12">
          <h2 className="font-heading text-3xl font-bold text-zinc-50 sm:text-4xl">
            Tentang Saya
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
            {isLoading ? (
              <span className="inline-block h-4 w-full max-w-md animate-pulse rounded bg-zinc-800"></span>
            ) : (
              data?.profile?.bio_id || 
              "Seorang mahasiswa dengan ketertarikan mendalam pada rekayasa perangkat keras dan perangkat lunak. Membangun otomatisasi sistem industri hingga menciptakan ekosistem digital yang terintegrasi."
            )}
          </p>
        </div>

        {/* 2-Column Grid for Pendidikan & Pengalaman */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Pendidikan Box */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-zinc-700">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-emerald-500">
                <GraduationCap size={22} />
              </div>
              <h3 className="font-heading text-xl font-semibold text-zinc-50">Pendidikan</h3>
            </div>
            
            <div className="space-y-6">
              {isLoading ? (
                <div className="h-16 w-full animate-pulse rounded bg-zinc-800/50"></div>
              ) : educations.length > 0 ? (
                educations.map((edu) => (
                  <div key={edu.id} className="relative pl-4 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-zinc-700">
                    <h4 className="text-base font-medium text-zinc-200">{edu.school}</h4>
                    <p className="mt-1 text-sm text-zinc-400">{edu.degree} di {edu.field_of_study}</p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">{edu.start_date} - {edu.end_date}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">Belum ada data pendidikan.</p>
              )}
            </div>
          </div>

          {/* Pengalaman Box */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-zinc-700">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-emerald-500">
                <Briefcase size={22} />
              </div>
              <h3 className="font-heading text-xl font-semibold text-zinc-50">Pengalaman</h3>
            </div>
            
            <div className="space-y-6">
              {isLoading ? (
                <div className="h-16 w-full animate-pulse rounded bg-zinc-800/50"></div>
              ) : experiences.length > 0 ? (
                experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-zinc-700">
                    <h4 className="text-base font-medium text-zinc-200">
                      {exp.position}{exp.status ? ` - ${exp.status}` : ""}
                    </h4>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-zinc-400">{exp.company}</span>
                      {exp.credential_url && (
                        <a href={exp.credential_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 transition-colors hover:text-emerald-500">
                          <FileText size={10} /> Credential
                        </a>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-xs text-zinc-500">{exp.start_date} - {exp.end_date}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">Belum ada data pengalaman.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
