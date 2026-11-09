import { Code, Film, PlayCircle, Wallet } from "lucide-react";
import React from "react";

export default function HowItWorksSection() {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <div className="section-title-wrap">
          <h2 className="section-title">How It Works</h2>
        </div>

        <div className="steps-grid">
          {/* <!-- Step 1 --> */}
          <article className="step-ticket">
            <div className="step-ticket-top">
              <span className="notch-left" aria-hidden="true"></span>
              <span className="step-number-tag">Scene 01</span>
              <div className="step-icon-wrap" aria-hidden="true">
                <Film />
              </div>
              <span className="notch-right" aria-hidden="true"></span>
            </div>
            <div className="step-ticket-content">
              <div>
                <h3 className="step-title">Pick a movie you love</h3>
                <p className="step-desc">
                  Choose any motion picture that inspires you. It can be a
                  legendary classic, an animated masterpiece, a sci fi thriller,
                  or a summer blockbuster.
                </p>
              </div>
              <div className="step-footer-meta">
                <span>Phase: Inspiration</span>
                <span>Entry pass</span>
              </div>
            </div>
          </article>

          {/* <!-- Step 2 --> */}
          <article className="step-ticket">
            <div className="step-ticket-top">
              <span className="notch-left" aria-hidden="true"></span>
              <span className="step-number-tag">Scene 02</span>
              <div className="step-icon-wrap" aria-hidden="true">
                <Code />
              </div>
              <span className="notch-right" aria-hidden="true"></span>
            </div>
            <div className="step-ticket-content">
              <div>
                <h3 className="step-title">Build a website themed around it</h3>
                <p className="step-desc">
                  Be creative: design, interactivity, soundtrack, scenes,
                  anything goes. Bring the mood, quotes, lore, or characters to
                  life on the web canvas.
                </p>
              </div>
              <div className="step-footer-meta">
                <span>Phase: Craft</span>
                <span>Tracked time</span>
              </div>
            </div>
          </article>

          {/* <!-- Step 3 --> */}
          <article className="step-ticket">
            <div className="step-ticket-top">
              <span className="notch-left" aria-hidden="true"></span>
              <span className="step-number-tag">Scene 03</span>
              <div className="step-icon-wrap" aria-hidden="true">
                <PlayCircle />
              </div>
              <span className="notch-right" aria-hidden="true"></span>
            </div>
            <div className="step-ticket-content">
              <div>
                <h3 className="step-title">Ship it live and submit</h3>
                <p className="step-desc">
                  Publish your project to the world on GitHub Pages or Vercel.
                  Submit your public source repository and working site URL
                  through the submission portal.
                </p>
              </div>
              <div className="step-footer-meta">
                <span>Phase: Release</span>
                <span>Public link</span>
              </div>
            </div>
          </article>

          {/* <!-- Step 4 --> */}
          <article className="step-ticket">
            <div className="step-ticket-top">
              <span className="notch-left" aria-hidden="true"></span>
              <span className="step-number-tag">Scene 04</span>
              <div className="step-icon-wrap" aria-hidden="true">
                <Wallet />
              </div>
              <span className="notch-right" aria-hidden="true"></span>
            </div>
            <div className="step-ticket-content">
              <div>
                <h3 className="step-title">Get your ticket grants</h3>
                <p className="step-desc">
                  Get ticket grants of $5 per hour of build time, up to 10
                  hours, to go watch more movies. Use the grant at your
                  neighborhood cinema with friends.
                </p>
              </div>
              <div className="step-footer-meta">
                <span>Phase: Showtime</span>
                <span>$50 maximum</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
