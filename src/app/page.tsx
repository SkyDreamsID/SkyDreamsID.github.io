import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { HobbyInterest } from "@/components/home/hobby-interest";
import { BentoGrid } from "@/components/home/bento-grid";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <About />
      <FeaturedProjects />
      <HobbyInterest />
      <BentoGrid />
    </main>
  );
}
