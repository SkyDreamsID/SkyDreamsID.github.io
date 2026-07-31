"use client";

import { ArrowUpRight, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import useSWR from "swr";
import { fetchSkyDreamsAPI, ProjectResponse } from "@/services/api";
import Link from "next/link";

export function FeaturedProjects() {
  const { data, isLoading } = useSWR<ProjectResponse[]>("/projects", fetchSkyDreamsAPI, {
    refreshInterval: 60000,
  });

  // Limit to max 3 projects
  const projects = data ? data.slice(0, 3) : [];

  return (
    <section id="projects" className="w-full bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold text-zinc-50 sm:text-4xl">
              Highlight Proyek
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              Karya terpilih dari ekosistem digital.
            </p>
          </div>
          <Link
            href="https://github.com/skydreamsid?tab=repositories"
            target="_blank"
            className="hidden items-center gap-2 font-mono text-sm font-medium text-emerald-500 hover:underline sm:flex"
          >
            Lihat Semua <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* 3-Column Horizontal Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {isLoading ? (
            // Skeletons
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex h-56 flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div>
                  <div className="mb-4 h-6 w-6 rounded-full bg-zinc-800 animate-pulse"></div>
                  <div className="mb-2 h-6 w-3/4 rounded bg-zinc-800 animate-pulse"></div>
                  <div className="h-4 w-full rounded bg-zinc-800 animate-pulse"></div>
                  <div className="mt-2 h-4 w-2/3 rounded bg-zinc-800 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-emerald-500/50 hover:bg-zinc-800/50"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between text-zinc-500 transition-colors group-hover:text-emerald-500">
                    <GithubIcon className="h-6 w-6" />
                    <ArrowUpRight size={20} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <h3 className="mb-2 font-heading text-xl font-bold text-zinc-50 group-hover:text-emerald-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-4 border-t border-zinc-800 pt-4">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    {project.category}
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs text-zinc-400">
                    <Star size={14} className="text-zinc-500" />
                    {project.stars || 0}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p className="col-span-3 text-center text-sm text-zinc-500">Belum ada proyek yang ditampilkan.</p>
          )}
        </div>

        {/* Mobile View All Link */}
        <Link
          href="https://github.com/skydreamsid?tab=repositories"
          target="_blank"
          className="mt-8 flex items-center justify-center gap-2 font-mono text-sm font-medium text-emerald-500 hover:underline sm:hidden"
        >
          Lihat Semua Repositori <ArrowUpRight size={16} />
        </Link>

      </div>
    </section>
  );
}
