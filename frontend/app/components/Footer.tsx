import React from "react";

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
              Made with care by teenagers in the Hack Club community
            </p>
          </div>

          {/* <!-- Right: Links to Hack Club, Slack, GitHub, Code of Conduct --> */}
          <div className="footer-links-group">
            <nav className="footer-nav" aria-label="Footer Navigation">
              <a
                href="https://hackclub.com"
                className="footer-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hack Club
              </a>
              <a
                href="https://hackclub.com/slack"
                className="footer-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Slack
              </a>
              <a
                href="https://github.com/hackclub"
                className="footer-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://hackclub.com/conduct"
                className="footer-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Code of Conduct
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
