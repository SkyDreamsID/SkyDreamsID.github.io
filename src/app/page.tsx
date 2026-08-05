import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { HobbyInterest } from "@/components/home/hobby-interest";
import { BentoGrid } from "@/components/home/bento-grid";
import { fetchSkyDreamsAPI } from "@/services/api";
import { SWRProvider } from "@/components/swr-provider";

export const revalidate = 60; // ISR revalidation time in seconds

export default async function Home() {
  // Fetch initial data concurrently
  const [homeData, lastfmData, personalProfile, statusData, quotesData, projectsData, arsenalData, socialsData] = await Promise.all([
    fetchSkyDreamsAPI("/home").catch(() => null),
    fetchSkyDreamsAPI("/lastfm").catch(() => null),
    fetchSkyDreamsAPI("/personal-hub/profile").catch(() => null),
    fetchSkyDreamsAPI("/general/status").catch(() => null),
    fetchSkyDreamsAPI("/general/quotes").catch(() => null),
    fetchSkyDreamsAPI("/personal-hub/projects").catch(() => null),
    fetchSkyDreamsAPI("/personal-hub/arsenal").catch(() => null),
    fetchSkyDreamsAPI("/general/socials").catch(() => null),
  ]);

  // Construct fallback data mapping SWR keys to fetched data
  const fallback = {
    "/home": homeData,
    "/lastfm": lastfmData,
    "/personal-hub/profile": personalProfile,
    "/general/status": statusData,
    "/general/quotes": quotesData,
    "/personal-hub/projects": projectsData,
    "/personal-hub/arsenal": arsenalData,
    "/general/socials": socialsData,
  };

  return (
    <SWRProvider fallback={fallback}>
      <main className="flex flex-col">
        <Hero />
        <About />
        <FeaturedProjects />
        <HobbyInterest />
        <BentoGrid />
      </main>
    </SWRProvider>
  );
}
