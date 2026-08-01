"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-7"
      >
        <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-muted/50 mb-4"></div>
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted/50 mb-2"></div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted/50"></div>
      </motion.div>
    );
  }

  const user = lanyard?.discord_user;
  const status = lanyard?.discord_status || "offline";
  
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
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-[#5865F2]/10 p-7 hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 transition-colors"
    >
      {/* Decorative Discord-like Background element */}
      <span className="pointer-events-none absolute -right-6 -top-6 select-none font-heading text-[160px] font-bold leading-none text-[#5865F2] opacity-5 transition-opacity group-hover:opacity-10">
        #
      </span>

      <div className="relative z-10">
        <div className="mb-4 relative h-12 w-12 flex items-center justify-center rounded-full bg-[#5865F2] text-white overflow-visible">
          {user?.avatar ? (
            <img 
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`} 
              alt="Discord Avatar" 
              className="h-full w-full rounded-full object-cover border border-[#5865F2]/50"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
          )}
          {/* Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${statusColors[status]}`}></div>
        </div>
        <h3 className="font-heading text-lg font-medium text-foreground">
          {user?.username ? `@${user.username}` : "Let's Chat!"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
          <span className={`inline-block h-2 w-2 rounded-full ${statusColors[status]}`}></span>
          {statusText[status]}
        </p>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-[#5865F2]/20 pt-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5865F2]">
          Kirim Pesan
        </p>
        <span className="text-[#5865F2] transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </motion.a>
  );
}
