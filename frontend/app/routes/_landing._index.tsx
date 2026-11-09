import HeroSection from "~/components/HeroSection";
import type { Route } from "./+types/_landing._index";
import HowItWorksSection from "~/components/HowItWorksSection";
import DecorativeDivider from "~/components/DecorativeDivider";
import FaqSection from "~/components/FaqSection";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <DecorativeDivider />
      <HowItWorksSection />
      <DecorativeDivider />
      <FaqSection />
    </main>
  );
}
