import HeroSection from "~/components/HeroSection";
import type { Route } from "./+types/_landing._index";
import HowItWorksSection from "~/components/HowItWorksSection";
import DecorativeDivider from "~/components/DecorativeDivider";
import FaqSection from "~/components/FaqSection";
import Header from "~/components/Header";
import SiteDecorations from "~/components/SiteDecorations";
import { useEffect } from "react";

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
  useEffect(() => {
    (function () {
      // Respect prefers-reduced-motion
      let prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Hero ticket subtle 3D tilt tracking on mouse move
      let ticket = document.getElementById("heroTicket")!;

      if (ticket && !prefersReducedMotion) {
        let boundingBox: {
          left: number;
          top: number;
          width: number;
          height: number;
        } | null = null;

        let updateBox = function () {
          boundingBox = ticket.getBoundingClientRect();
        };

        window.addEventListener("resize", updateBox, { passive: true });
        window.addEventListener("scroll", updateBox, { passive: true });

        ticket.addEventListener("mouseenter", function () {
          updateBox();
        });

        ticket.addEventListener("mousemove", function (e) {
          if (!boundingBox) updateBox();
          var x = e.clientX - boundingBox!.left;
          var y = e.clientY - boundingBox!.top;
          var centerX = boundingBox!.width / 2;
          var centerY = boundingBox!.height / 2;

          var rotateX = ((y - centerY) / centerY) * -4;
          var rotateY = ((x - centerX) / centerX) * 4;

          ticket.style.transform =
            "perspective(1000px) rotateX(" +
            rotateX.toFixed(2) +
            "deg) rotateY(" +
            rotateY.toFixed(2) +
            "deg) translateY(-4px)";
        });

        ticket.addEventListener("mouseleave", function () {
          ticket.style.transform = "";
        });
      }
    })();
  }, []);
  return (
    <main>
      <div className="home-hero-backdrop">
        <Header />
        <HeroSection />
        {/* <DecorativeDivider /> */}
      </div>
      <div className="site-decoration-field">
        <SiteDecorations />
        <div className="site-decoration-content">
          <HowItWorksSection />
          <DecorativeDivider />

          <FaqSection />
        </div>
      </div>
    </main>
  );
}
