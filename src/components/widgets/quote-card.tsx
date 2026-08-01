"use client";

import { motion } from "framer-motion";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper to get Discord account creation date from Snowflake ID
function getDiscordCreationDate(id: string) {
  try {
    const timestamp = Number((BigInt(id) >> 22n) + 1420070400000n);
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    return "Unknown";
  }
}

export function QuoteCard({ data, isLoading: isExternalLoading }: { data?: any, isLoading?: boolean }) {
  const discordId = "765458490248265769";
  const { data: lanyardData, error } = useSWR(
    `https://api.lanyard.rest/v1/users/${discordId}`,
    fetcher,
    { refreshInterval: 60000 }
  );

  const isLoading = isExternalLoading || (!lanyardData && !error);
  const lanyard = lanyardData?.data;

  if (isLoading) {
    return (
      <motion.div
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4"
      >
        <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-muted/50 mb-3"></div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted/50 mb-2"></div>
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted/50"></div>
      </motion.div>
    );
  }

  const user = lanyard?.discord_user;
  const status = lanyard?.discord_status || "offline";
  // Filter out custom status (type 4), prioritize Playing (0) > Streaming (1) > Listening (2)
  const activities = lanyard?.activities || [];
  const activity = activities.find((a: any) => a.type === 0) || 
                   activities.find((a: any) => a.type === 1) || 
                   activities.find((a: any) => a.type === 2);
  
  const memberSince = getDiscordCreationDate(discordId);
  
  const statusColors: Record<string, string> = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500"
  };

  const statusText: Record<string, string> = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline"
  };

  return (
    <motion.a
      href={`https://discordapp.com/users/${discordId}`}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-[#5865F2]/10 p-4 hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 transition-colors"
    >
      {/* Decorative Discord-like Background element */}
      <span className="pointer-events-none absolute -right-6 -top-6 select-none font-heading text-[160px] font-bold leading-none text-[#5865F2] opacity-5 transition-opacity group-hover:opacity-10">
        #
      </span>

      <div className="relative z-10 flex flex-col h-full min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full bg-[#5865F2] text-white">
              {user?.avatar ? (
                <img 
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`} 
                  alt="Discord Avatar" 
                  className="h-full w-full rounded-full object-cover border border-[#5865F2]/50"
                />
              ) : (
                <span className="font-bold text-xs">?</span>
              )}
              <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-background ${statusColors[status]}`}></div>
            </div>
            <div>
              <h3 className="font-bold text-foreground leading-none text-[13px]">
                {user?.display_name || user?.username || "Discord"}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                {statusText[status]}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end text-right">
            <span className="text-[7px] uppercase tracking-wider text-muted-foreground font-semibold">Member Since</span>
            <span className="text-[10px] font-mono text-zinc-300">{memberSince}</span>
          </div>
        </div>

        {activity ? (
          <div className="flex flex-col gap-1 rounded-lg bg-zinc-900/60 p-2 border border-white/5 overflow-hidden">
            <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
              {activity.type === 2 ? "Listening to" : activity.type === 1 ? "Streaming" : "Playing"}
            </p>
            <div className="flex items-start gap-2">
              {activity.assets?.large_image && (
                <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden bg-zinc-800">
                  <img 
                    src={activity.assets.large_image.startsWith('spotify:') 
                      ? `https://i.scdn.co/image/${activity.assets.large_image.split(':')[1]}`
                      : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png?size=128`}
                    alt={activity.name}
                    className="h-full w-full object-cover"
                  />
                  {activity.assets?.small_image && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border border-zinc-900 overflow-hidden bg-zinc-800">
                      <img 
                        src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png?size=64`}
                        alt="Small Icon"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-col min-w-0 flex-1 justify-center">
                <span className="font-bold text-[11px] leading-[14px] text-zinc-100 truncate">{activity.name}</span>
                {activity.details && <span className="text-[10px] leading-[13px] text-zinc-400 truncate mt-0.5">{activity.details}</span>}
                {activity.state && <span className="text-[10px] leading-[13px] text-zinc-400 truncate">{activity.state}</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 mt-1">
            <h3 className="font-heading text-[15px] font-medium text-foreground">
              Let's Chat!
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Terhubung dengan saya di Discord
            </p>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-auto pt-2.5 flex items-center justify-between border-t border-[#5865F2]/20">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#5865F2]">
          Kirim Pesan
        </p>
        <span className="text-[#5865F2] text-xs transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </motion.a>
  );
}
