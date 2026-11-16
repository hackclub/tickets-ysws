import React from "react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* <!-- Left: Hack Club wordmark / logo & 501(c)(3) nonprofit wording --> */}
          <div className="footer-brand">
            {/* <!-- Exact 501(c)(3) nonprofit legal wording without any hyphens --> */}
            <p className="footer-legal-copy">
              Hack Club is a registered 501(c)(3) nonprofit public charity. EIN
              813748307. Fiscal sponsorship provided by The Hack Foundation.
            </p>

            <p className="footer-credit">
              Made with {"<3"} by{" "}
              <Link
                to={"https://hackclub.enterprise.slack.com/team/U0AEXPQNM5W"}
                target="_blank"
                className="footer-nav-link"
              >
                @AzCodes
              </Link>
              , sponsored by{" "}
              <Link
                to={
                  "https://hackclub.enterprise.slack.com/archives/D0C8RJHBZQC"
                }
                target="_blank"
                className="footer-nav-link"
              >
                @Brendan
              </Link>
            </p>
          </div>

          {/* <!-- Right: Links to Hack Club, Slack, GitHub, Code of Conduct --> */}
          <div className="footer-links-group">
            <nav className="footer-nav" aria-label="Footer Navigation">
              <Link
                to="https://hackclub.com"
                className="footer-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hack Club
              </Link>
              <Link
                to="https://hackclub.com/privacy-and-terms"
                className="footer-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Privacy Policy
              </Link>
              <Link
                to="https://forms.hackclub.com/bounty"
                className="footer-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fulfillment Bounty
              </Link>
              <Link
                to="https://hackclub.com/conduct"
                className="footer-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Code of Conduct
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
