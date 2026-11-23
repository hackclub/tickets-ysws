import {
  Code,
  Film,
  Music2,
  Package,
  Palette,
  Send,
  Star,
  Video,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Pick a movie you love",
    description:
      "Any film works, it could be a movie you watched a long time ago or one that you recently watched.",
    image: "/idea.png",
  },
  {
    number: "02",
    title: "Build a project around it",
    description:
      "Make your project themed around the movie, you can chose a character from the movie or a scene from the movie, just be creative.",
    image: "/coding.png",
  },
  {
    number: "03",
    title: "Ship it live and submit",
    description:
      "Publish your site on GitHub Pages, Vercel, or another host. Then submit it for review.",
    image: "/ship.png",
  },
  {
    number: "04",
    title: "Get your tickets",
    description:
      "The most interesting part I know you have been waiting for, get rewarded for every approved hours you logged. Movie night is on us.",
    image: "/tickets_image.png",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <div className="section-title-wrap">
          <h2 className="section-title">How It Works</h2>
        </div>

        <div className="journey-wrap">
          <ol className="journey-grid">
            {steps.map(({ number, title, description, image }, index) => {
              const isLeftStep = index % 2 === 0;

              return (
                <li
                  className={`journey-step ${isLeftStep ? "journey-step--left" : "journey-step--right"}`}
                  key={number}
                >
                  <div className="journey-step-copy">
                    <img
                      className={`journey-step-art`}
                      src={image}
                      alt={
                        number === "01"
                          ? "A maker finding inspiration from an idea"
                          : "Hack Club cinema ticket grants"
                      }
                    />
                    <h3 className="journey-step-title">{title}</h3>
                    <p className="journey-step-description">{description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <>
                      <svg
                        className={`flow-arrow-desktop ${isLeftStep ? "" : "flow-arrow-desktop--reverse"}`}
                        viewBox="0 0 440 112"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M 24 10 C 48 82, 92 92, 180 92 L 414 92"
                          stroke="currentColor"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 398 78 L 418 92 L 398 106"
                          stroke="currentColor"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <svg
                        className="flow-arrow-mobile"
                        viewBox="0 0 36 44"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M 18 4 L 18 38"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 10 30 L 18 39 L 26 30"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
