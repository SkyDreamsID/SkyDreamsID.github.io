"use client";

import { Disc3, Trophy, Headphones, Music2 } from "lucide-react";

interface LastfmCardProps {
  data?: {
    topArtists?: Array<{ name: string; playcount: number; url: string }>;
    topAlbums?: Array<{ name: string; artist: string; playcount: number; url: string }>;
    topTracks?: Array<{ title: string; artist: string; playcount: number; url: string }>;
  } | null;
  isLoading?: boolean;
}

export function LastfmCard({ data, isLoading }: LastfmCardProps) {
  const defaultUrl = "https://www.last.fm/user/rifkiekap07";
  
  // Pisah Top Artists jadi 2 bagian (1-5 dan 6-10) jika ada
  const topArtists = data?.topArtists || [];
  const artists1to5 = topArtists.slice(0, 5);
  const artists6to10 = topArtists.slice(5, 10);
  
  const topAlbums = data?.topAlbums || [];
  const topTracks = data?.topTracks || [];

  // Helper untuk skeleton baris
  const SkeletonRows = () => (
    <div className="space-y-3 mt-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between items-center h-5">
          <div className="h-3 w-2/3 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-3 w-1/4 bg-zinc-800 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      {/* Header Utama */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
          <Disc3 size={14} />
          Last.fm Statistics
        </div>
        <a 
          href={defaultUrl} 
          target="_blank" 
          rel="noreferrer"
          className="text-xs text-zinc-500 hover:text-emerald-500 transition-colors"
        >
          @rifkiekap07
        </a>
      </div>

      {/* Grid 4 Kolom (Balanced) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
        
        {/* Kolom 1 & 2: Top Artists (Unified) */}
        <div className="flex flex-col md:col-span-2">
          <h4 className="flex items-center justify-center gap-1.5 font-heading text-sm font-bold text-zinc-300 mb-4 border-b border-zinc-800 pb-2">
            <Trophy size={14} className="text-emerald-500" /> Top Artists
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {/* List 1-5 */}
            <div>
              {isLoading ? <SkeletonRows /> : (
                <div className="space-y-2">
                  {artists1to5.length > 0 ? artists1to5.map((artist, idx) => (
                    <a key={idx} href={artist.url || defaultUrl} target="_blank" rel="noreferrer" className="flex justify-between items-center group">
                      <span className="font-mono text-xs text-zinc-400 truncate pr-2 group-hover:text-emerald-400">{idx + 1}. {artist.name}</span>
                      <span className="font-mono text-[10px] text-zinc-600 shrink-0">{artist.playcount}x</span>
                    </a>
                  )) : (
                    <span className="text-xs text-zinc-600">Data not available</span>
                  )}
                </div>
              )}
            </div>
            
            {/* List 6-10 */}
            <div>
              {isLoading ? <SkeletonRows /> : (
                <div className="space-y-2">
                  {artists6to10.length > 0 ? artists6to10.map((artist, idx) => (
                    <a key={idx} href={artist.url || defaultUrl} target="_blank" rel="noreferrer" className="flex justify-between items-center group">
                      <span className="font-mono text-xs text-zinc-400 truncate pr-2 group-hover:text-emerald-400">{idx + 6}. {artist.name}</span>
                      <span className="font-mono text-[10px] text-zinc-600 shrink-0">{artist.playcount}x</span>
                    </a>
                  )) : (
                    <span className="text-xs text-zinc-600">Data not available</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom 3: Top Albums */}
        <div className="flex flex-col">
          <h4 className="flex items-center gap-1.5 font-heading text-sm font-bold text-zinc-300 mb-2 border-b border-zinc-800 pb-2">
            <Disc3 size={14} className="text-emerald-500" /> Top Albums (Mo)
          </h4>
          {isLoading ? <SkeletonRows /> : (
            <div className="space-y-2 mt-2">
              {topAlbums.length > 0 ? topAlbums.slice(0, 5).map((album, idx) => (
                <a key={idx} href={album.url || defaultUrl} target="_blank" rel="noreferrer" className="flex justify-between items-center group">
                  <span className="font-mono text-xs text-zinc-400 truncate pr-2 group-hover:text-emerald-400">{idx + 1}. {album.name}</span>
                  <span className="font-mono text-[10px] text-zinc-600 shrink-0">{album.playcount}x</span>
                </a>
              )) : (
                <span className="text-xs text-zinc-600">Data not available</span>
              )}
            </div>
          )}
        </div>

        {/* Kolom 4: Top Tracks */}
        <div className="flex flex-col">
          <h4 className="flex items-center gap-1.5 font-heading text-sm font-bold text-zinc-300 mb-2 border-b border-zinc-800 pb-2">
            <Music2 size={14} className="text-emerald-500" /> Top Tracks (Wk)
          </h4>
          {isLoading ? <SkeletonRows /> : (
            <div className="space-y-2 mt-2">
              {topTracks.length > 0 ? topTracks.slice(0, 5).map((track, idx) => (
                <a key={idx} href={track.url || defaultUrl} target="_blank" rel="noreferrer" className="flex justify-between items-center group">
                  <span className="font-mono text-xs text-zinc-400 truncate pr-2 group-hover:text-emerald-400">{idx + 1}. {track.title}</span>
                  <span className="font-mono text-[10px] text-zinc-600 shrink-0">{track.playcount}x</span>
                </a>
              )) : (
                <span className="text-xs text-zinc-600">Data not available</span>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}