export const API_BASE_URL = "https://skydreamsid-api.vercel.app/api/v1";

// --- Interfaces ---

export interface PersonalProfileResponse {
  id?: string;
  hero_name: string;
  hero_tagline: string;
  hero_tagline_en: string;
  bio_id: string;
  bio_en: string;
  avatar_url: string;
  motto: string;
  location: string;
  email: string;
  open_to_collab: boolean;
  featured_repos?: string[];
  [key: string]: any;
}

export interface GeneralStatusResponse {
  id?: string;
  activity: string;
  location: string;
  mood: string;
}

export interface GeneralQuoteResponse {
  id?: string;
  quote: string;
  author: string;
  is_active?: boolean;
}

export interface GeneralSocialResponse {
  id?: string;
  platform: string;
  url: string;
  icon: string;
}

export interface GeneralExploreLinkResponse {
  id?: string;
  name: string;
  description: string;
  url: string;
  status: string;
  icon: string;
  category: string;
}

export interface GeneralExperienceResponse {
  id?: string;
  position: string;
  status: string;
  company: string;
  start_date: string;
  end_date: string;
  description?: string;
  credential_url?: string;
}

export interface GeneralEducationResponse {
  id?: string;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  description?: string;
}

export interface GeneralCertificateResponse {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  credential_id?: string;
  credential_url?: string;
}

export interface UsesResponse {
  workstation?: Array<{ name: string; detail: string; image_url?: string }>;
  development?: Array<{ name: string; detail: string; image_url?: string }>;
  multimedia?: Array<{ name: string; detail: string; image_url?: string }>;
  [key: string]: Array<{ name: string; detail: string; image_url?: string }> | undefined;
}

export interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  stars: number;
  featured: boolean;
  image_url?: string;
  demo_url?: string;
  download_url?: string;
  live_release_version?: string;
}

export interface LastfmResponse {
  nowPlaying?: {
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
    url: string;
    isPlaying: boolean;
    dateText?: string;
  };
  recentTracks?: Array<{
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
    url: string;
    isPlaying: boolean;
    dateText: string;
  }>;
  topArtists?: Array<{ name: string; playcount: number; url: string }>;
  topAlbums?: Array<{ name: string; artist: string; playcount: number; url: string }>;
  topTracks?: Array<{ title: string; artist: string; playcount: number; url: string }>;
}

export interface SteamResponse {
  personaName: string;
  inGame: boolean;
  currentGame: string | null;
  currentGameBanner: string | null;
  avatar: string;
  profileUrl: string;
  personaState?: string;
}

export interface HomeResponse {
  profile: {
    name: string;
    bio: string;
    avatar: string;
  };
  status: {
    activity: string;
    location: string;
    mood: string;
  };
  quote: {
    text: string;
    author: string;
  };
  latestGalleryPost: {
    title: string;
    slug: string;
    location: string;
    created_at: string;
    thumbnail: string;
  } | null;
}

// --- Fetcher ---

export const fetchSkyDreamsAPI = async (url: string) => {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  const res = await fetch(fullUrl);
  if (!res.ok) throw new Error(`An error occurred: ${res.statusText}`);
  const json = await res.json();
  return json.data;
};

