import React from "react";
import {
  ArrowRight,
  ArrowRightSquare,
  ArrowUpRightSquare,
  Barcode,
  Star,
} from "lucide-react";
import { Link } from "react-router";

export default function HeroSection() {
  return (
    <section className="hero-section" id="hero">
      <div className="container">
        {/* <!-- Large Hero Cinema Ticket Stub --> */}
        <div className="hero-ticket-wrapper">
          <div className="hero-ticket" id="heroTicket">
            {/* <!-- Main Ticket Body --> */}
            <div className="hero-ticket-main">
              <div>
                {/* <!-- Headline (No hyphens, no em dashes) --> */}
                <h1 className="hero-headline">
                  Build a movie project.{" "}
                  <span className="highlight">Watch more movies on us.</span>
                </h1>

                {/* <!-- One sentence subheading explaining the offer --> */}
                <p className="hero-subheading">
                  Pick a film you love, build a website, game, or other creative
                  project around it, share it with the world, and earn ticket
                  grants to spend at your local cinema.
                </p>
              </div>

              {/* <!-- Action Links --> */}
              <div className="hero-actions">
                {/* <!-- Primary RSVP Button linking to external form URL -->
                  <!-- [RSVP_FORM_URL] placeholder configurable via href --> */}
                <Link to="/submit" className="btn-rsvp">
                  <span>Submit your project</span>
                </Link>

                {/* <!-- Secondary text link to join the Slack channel -->
                  <!-- [SLACK_CHANNEL_URL] placeholder configurable via href --> */}
                <Link
                  to="https://hackclub.enterprise.slack.com/archives/C0C8FKNHNV9"
                  className="slack-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Join #tickets-ysws on Slack</span>
                  <ArrowUpRightSquare />
                </Link>
              </div>
            </div>

            {/* <!-- Perforation Cutout Line --> */}
            <div className="hero-perforation" aria-hidden="true">
              <span className="notch-top"></span>
              <span className="notch-bottom"></span>
            </div>

            {/* <!-- Tear Off Cinema Stub Side --> */}
            <div className="hero-ticket-stub">
              <div className="stub-brand-badge">TICKETS</div>

              <div className="stub-middle-grant">
                <div className="grant-big">$5</div>
                <div className="grant-unit">Per hour of build time</div>
              </div>

              <div className="stub-barcode" aria-hidden="true">
                <svg
                  className="barcode-svg"
                  viewBox="0 0 140 36"
                  fill="currentColor"
                >
                  <rect x="0" y="0" width="3" height="36" />
                  <rect x="5" y="0" width="2" height="36" />
                  <rect x="10" y="0" width="5" height="36" />
                  <rect x="18" y="0" width="2" height="36" />
                  <rect x="23" y="0" width="4" height="36" />
                  <rect x="30" y="0" width="2" height="36" />
                  <rect x="35" y="0" width="6" height="36" />
                  <rect x="44" y="0" width="3" height="36" />
                  <rect x="50" y="0" width="2" height="36" />
                  <rect x="55" y="0" width="5" height="36" />
                  <rect x="63" y="0" width="2" height="36" />
                  <rect x="68" y="0" width="4" height="36" />
                  <rect x="75" y="0" width="3" height="36" />
                  <rect x="81" y="0" width="6" height="36" />
                  <rect x="90" y="0" width="2" height="36" />
                  <rect x="95" y="0" width="5" height="36" />
                  <rect x="103" y="0" width="2" height="36" />
                  <rect x="108" y="0" width="4" height="36" />
                  <rect x="115" y="0" width="2" height="36" />
                  <rect x="120" y="0" width="6" height="36" />
                  <rect x="129" y="0" width="3" height="36" />
                  <rect x="135" y="0" width="5" height="36" />
                </svg>
                <span className="barcode-number">HC 2026 TKT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
