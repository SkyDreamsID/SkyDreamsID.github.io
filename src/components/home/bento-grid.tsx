"use client";

import useSWR from "swr";
import { fetchSkyDreamsAPI, HomeResponse, LastfmResponse, SteamResponse } from "@/services/api";
import { MusicCard } from "@/components/widgets/music-card";
import { SteamCard } from "@/components/widgets/steam-card";
import { VisualJournalCard } from "@/components/widgets/visual-journal-card";
import { LastfmCard } from "@/components/widgets/lastfm-card";
import { KnowledgeBaseCard } from "@/components/widgets/knowledge-base-card";
import { QuoteCard } from "@/components/widgets/quote-card";

export function BentoGrid() {
  const { data: homeData, isLoading: isHomeLoading } = useSWR<HomeResponse>("/home", fetchSkyDreamsAPI, { refreshInterval: 60000 });
  const { data: lastfmData, isLoading: isLastfmLoading } = useSWR<LastfmResponse>("/lastfm", fetchSkyDreamsAPI, { refreshInterval: 60000 });
  const { data: steamData, isLoading: isSteamLoading } = useSWR<SteamResponse>("/steam", fetchSkyDreamsAPI, { refreshInterval: 60000 });

  const currentTrack = lastfmData?.nowPlaying || lastfmData?.recentTracks?.[0];

  return (
    <section id="ecosystem" className="w-full bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-14">
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-500">
            Digital Life
          </span>
          <h2 className="font-heading text-3xl font-bold text-zinc-50 sm:text-4xl">
            Ecosystem
          </h2>
        </div>

        {/* Mosaic Grid - Blueprint Match */}
        <div className="grid auto-rows-[240px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Jurnal Visual (Span 2 vertikal) */}
          <div className="lg:row-span-2">
            <VisualJournalCard data={homeData?.latestGalleryPost ? {
              latestPostTitle: homeData.latestGalleryPost.title,
              thumbnailUrl: homeData.latestGalleryPost.thumbnail,
              url: `https://jurnalvisual.vercel.app/post/${homeData.latestGalleryPost.slug}`,
              location: homeData.latestGalleryPost.location,
              createdAt: homeData.latestGalleryPost.created_at,
            } : null} isLoading={isHomeLoading} />
          </div>

          {/* Now/Last Play */}
          <div>
            <MusicCard data={currentTrack} isLoading={isLastfmLoading} />
          </div>

          {/* Quote */}
          <div>
            <QuoteCard data={homeData?.quote} isLoading={isHomeLoading} />
          </div>

          {/* Steam */}
          <div>
            <SteamCard data={steamData ? {
              personaName: steamData.personaName,
              status: steamData.personaState || (steamData.inGame ? "In-Game" : "Offline"),
              inGame: steamData.inGame,
              currentGame: steamData.currentGame,
              currentGameBanner: steamData.currentGameBanner,
              avatar: steamData.avatar,
              profileUrl: steamData.profileUrl
            } : null} isLoading={isSteamLoading} />
          </div>

          {/* Catatanku (WIP) */}
          <div>
            <KnowledgeBaseCard />
          </div>

          {/* Last.fm Statistik (Full width bottom) */}
          <div className="sm:col-span-2 lg:col-span-3">
            <LastfmCard data={lastfmData} isLoading={isLastfmLoading} />
          </div>

        </div>
      </div>
    </section>
  );
}
