import HeroSection from "~/components/HeroSection";
import type { Route } from "./+types/_landing._index";
import HowItWorksSection from "~/components/HowItWorksSection";
import DecorativeDivider from "~/components/DecorativeDivider";
import FaqSection from "~/components/FaqSection";
import Header from "~/components/Header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tickets - Hack club" },
    {
      name: "description",
      content:
        "Build a website, game, or other project themed around a movie and earn ticket grants to go watch more movies with Tickets.",
    },
  ];
}

export default function Home() {
  return (
    <main>
      <div className="home-hero-backdrop">
        <Header />
        <HeroSection />
        {/* <DecorativeDivider /> */}
      </div>
      <HowItWorksSection />
      <DecorativeDivider />

      <FaqSection />
    </main>
  );
}
