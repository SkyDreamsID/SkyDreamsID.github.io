"use client";

import { useEffect, useState } from "react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { API_BASE_URL } from "@/services/api";

// Tipe satu item social link dari API
export interface SocialLink {
  id: string;
  name: string;
  username: string;
  url: string;
  icon: string; // "github" | "linkedin" | "instagram" | "twitter" | "x" | "youtube"
}



function SocialIcon({ iconName, className }: { iconName: string; className?: string }) {
  const lower = iconName.toLowerCase();
  if (lower === "linkedin") return <LinkedinIcon className={className} />;
  if (lower === "instagram") return <InstagramIcon className={className} />;
  if (lower === "twitter" || lower === "x") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.742l7.732-8.835L2.252 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (lower === "youtube") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    );
  }
  // default: github
  return <GithubIcon className={className} />;
}

interface SocialIconsProps {
  iconClass?: string;
  linkClass?: string;
  className?: string;
}

export function SocialIcons({
  iconClass = "h-5 w-5",
  linkClass = "transition-colors hover:text-emerald-500",
  className = "flex items-center gap-5 text-zinc-400",
}: SocialIconsProps) {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/general/socials`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          setSocials(res.data);
        }
      })
      .catch(() => {
        // Biarkan kosong kalau error
      });
  }, []);

  return (
    <div className={className}>
      {socials.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noreferrer"
          aria-label={s.name}
          className={linkClass}
        >
          <SocialIcon iconName={s.icon} className={iconClass} />
        </a>
      ))}
    </div>
  );
}
