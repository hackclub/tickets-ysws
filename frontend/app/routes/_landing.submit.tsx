import { Circle, LogIn } from "lucide-react";
import React from "react";

export default function SubmitPage() {
  return (
    <main className="container">
      <div id="submissionView">
        {/* <!-- Hero Header --> */}
        <section className="submission-hero">
          <h1 className="sub-title">
            Submit Your <span className="gold-accent">Movie Website</span>
          </h1>
          <p className="sub-lead">
            Sign in with Hack Club Auth, connect your Hackatime coding hours,
            and input your project details to claim your cinema ticket grant.
          </p>
        </section>

        {/* <!-- 3 Frame Progress Filmstrip --> */}
        <div className="progress-filmstrip" aria-label="Submission Progress">
          <div className="progress-frame active" id="progressFrame1">
            <div className="frame-number">
              <span>Frame 01</span>
              <span id="frame1BadgeText">Required</span>
            </div>
            <div className="frame-title">1. Sign in with HCA</div>
          </div>

          <div className="progress-frame" id="progressFrame2">
            <div className="frame-number">
              <span>Frame 02</span>
              <span id="frame2BadgeText">Locked</span>
            </div>
            <div className="frame-title">2. Link Hackatime</div>
          </div>

          <div className="progress-frame" id="progressFrame3">
            <div className="frame-number">
              <span>Frame 03</span>
              <span id="frame3BadgeText">Locked</span>
            </div>
            <div className="frame-title">3. Project Details</div>
          </div>
        </div>

        <div className="steps-container">
          {/* First step */}
          <section className="step-card" id="stepCard1">
            <div className="step-card-header">
              <div className="step-header-left">
                <span className="step-tag">Step 01</span>
                <h2 className="step-header-title">
                  Sign in with Hack Club Auth
                </h2>
              </div>
              <span
                className="step-status-pill status-pending"
                id="step1StatusPill"
              >
                <Circle size={15} />
                <span>Awaiting Sign In</span>
              </span>
            </div>

            <div className="step-card-body">
              {/* <!-- Unauthenticated State --> */}
              <div id="hcbLoggedOut">
                <p className="step-instruction">
                  Hack Club Bank handles grants for teen makers. Sign in with
                  your HCA account so we know where to deposit your cinema
                  ticket grant.
                </p>

                <div className="hcb-box">
                  <div className="hcb-box-header">
                    <div className="hcb-brand-title">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <rect width="32" height="32" rx="6" fill="#8F1924" />
                        <path d="M8 8H24V14H8V8Z" fill="#E6B764" />
                        <rect
                          x="8"
                          y="18"
                          width="16"
                          height="6"
                          rx="2"
                          fill="#FCFBF9"
                        />
                      </svg>
                      <span>Hack Club Auth</span>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(ticket-muted)",
                      }}
                    >
                      Secure Auth
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 14,
                      textAlign: "center",
                      padding: "10px 0",
                    }}
                  >
                    <button
                      type="button"
                      className="btn-hcb-auth"
                      id="btnHcbLogin"
                    >
                      <LogIn />
                      <span>Sign in with Hack Club</span>
                    </button>
                    <p style={{ fontSize: 13, color: "var(--ticket-muted)" }}>
                      Don't have an HCA account yet? A free teen account will be
                      initiated during verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* <!-- Authenticated State (Hidden until signed in) --> */}
              <div id="hcbLoggedIn" style={{ display: "none" }}>
                <p
                  className="step-instruction"
                  style={{ color: "#2e7d32", fontWeight: 600 }}
                >
                  Step 1 Complete: Your Hack Club Bank account is connected and
                  ready to receive your grant.
                </p>

                <div className="hcb-profile-card">
                  <div className="hcb-profile-info">
                    <div className="hcb-avatar" id="hcbAvatarText">
                      O
                    </div>
                    <div>
                      <div className="hcb-name" id="hcbUserName">
                        Orpheus Dino
                      </div>
                      <div className="hcb-handle" id="hcbUserHandle">
                        @orpheus · orpheus@hackclub.com
                      </div>
                      <div className="hcb-status-badge">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Verified Active Teen Account</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-disconnect"
                    id="btnHcbDisconnect"
                  >
                    Switch Account
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* second step */}
          <section className="step-card locked" id="stepCard2">
            <div className="step-card-header">
              <div className="step-header-left">
                <span className="step-tag">Step 02</span>
                <h2 className="step-header-title">
                  Link Hackatime and Select Project
                </h2>
              </div>
              <span
                className="step-status-pill status-locked"
                id="step2StatusPill"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Locked</span>
              </span>
            </div>

            <div className="step-card-body">
              {/* <!-- Locked Notification --> */}
              <div className="locked-notice" id="step2LockNotice">
                <div className="locked-notice-icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    color: "var(--gold-light)",
                  }}
                >
                  Step 2 is currently locked
                </h3>
                <p>
                  Please sign in with Hack Club Bank in Step 1 above to load
                  your Hackatime coding activity and projects.
                </p>
              </div>

              {/* <!-- Unlocked Content --> */}
              <div id="step2Content" style={{ display: "none" }}>
                <p className="step-instruction">
                  Enter your Hackatime username to retrieve projects coded in
                  your editor. Select the project you built for your movie
                  website to calculate your ticket grant ($5 per hour, up to 10
                  hours maximum).
                </p>

                {/* <!-- Hackatime Username Search Input --> */}
                <div className="hackatime-search-box">
                  <input
                    type="text"
                    id="hackatimeUsernameInput"
                    className="ht-input"
                    placeholder="Hackatime username (e.g. orpheus)"
                    value="orpheus"
                  />
                  <button
                    type="button"
                    className="btn-fetch-projects"
                    id="btnFetchHackatime"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <polyline points="1 20 1 14 7 14"></polyline>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <span>Fetch Projects</span>
                  </button>
                </div>

                {/* <!-- Available Detected Projects Grid --> */}
                <div className="projects-list-title">
                  <span>Select your movie website project:</span>
                  <span id="projectsCountLabel">4 projects found</span>
                </div>

                <div className="project-options-grid" id="projectOptionsGrid">
                  {/* <!-- Project 1 --> */}
                  <div
                    className="project-card-option selected"
                    data-project="interstellar flight computer"
                    data-hours="8.4"
                    data-grant="42.00"
                  >
                    <div className="option-top">
                      <div>
                        <div className="option-name">
                          interstellar flight computer
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--ticket-muted)",
                            marginTop: 2,
                          }}
                        >
                          Movie: Interstellar
                        </div>
                      </div>
                      <div className="radio-circle">
                        <div className="radio-dot"></div>
                      </div>
                    </div>
                    <div className="option-meta">
                      <span className="hours-badge">8.4 hours logged</span>
                      <span className="grant-estimate-badge">$42.00 grant</span>
                    </div>
                  </div>

                  {/* <!-- Project 2 --> */}
                  <div
                    className="project-card-option"
                    data-project="spirited away bathhouse site"
                    data-hours="10.0"
                    data-grant="50.00"
                  >
                    <div className="option-top">
                      <div>
                        <div className="option-name">
                          spirited away bathhouse site
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--ticket-muted)",
                            marginTop: 2,
                          }}
                        >
                          Movie: Spirited Away
                        </div>
                      </div>
                      <div className="radio-circle">
                        <div className="radio-dot"></div>
                      </div>
                    </div>
                    <div className="option-meta">
                      <span className="hours-badge">10.0 hours logged</span>
                      <span className="grant-estimate-badge">
                        $50.00 max grant
                      </span>
                    </div>
                  </div>

                  {/* <!-- Project 3 --> */}
                  <div
                    className="project-card-option"
                    data-project="truman show live broadcast"
                    data-hours="6.2"
                    data-grant="31.00"
                  >
                    <div className="option-top">
                      <div>
                        <div className="option-name">
                          truman show live broadcast
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--ticket-muted)",
                            marginTop: 2,
                          }}
                        >
                          Movie: The Truman Show
                        </div>
                      </div>
                      <div className="radio-circle">
                        <div className="radio-dot"></div>
                      </div>
                    </div>
                    <div className="option-meta">
                      <span className="hours-badge">6.2 hours logged</span>
                      <span className="grant-estimate-badge">$31.00 grant</span>
                    </div>
                  </div>

                  {/* <!-- Project 4 --> */}
                  <div
                    className="project-card-option"
                    data-project="spider verse multi universe web"
                    data-hours="4.8"
                    data-grant="24.00"
                  >
                    <div className="option-top">
                      <div>
                        <div className="option-name">
                          spider verse multi universe web
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--ticket-muted)",
                            marginTop: 2,
                          }}
                        >
                          Movie: Spider Verse
                        </div>
                      </div>
                      <div className="radio-circle">
                        <div className="radio-dot"></div>
                      </div>
                    </div>
                    <div className="option-meta">
                      <span className="hours-badge">4.8 hours logged</span>
                      <span className="grant-estimate-badge">$24.00 grant</span>
                    </div>
                  </div>
                </div>

                {/* Manual project entry link */}
                <div style={{ textAlign: "right", marginBottom: 16 }}>
                  <button
                    type="button"
                    // onClick={handleAddCustomProject}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--velvet-bright)",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Project not listed? Add custom Hackatime project name
                  </button>
                </div>

                {/* Selected Confirmation Summary Strip */}
                <div
                  className="confirmed-project-strip"
                  id="confirmedProjectStrip"
                >
                  <div className="confirmed-details">
                    <span className="confirmed-label">
                      Selected Project For Verification
                    </span>
                    <div className="confirmed-title" id="confirmedProjectTitle">
                      interstellar flight computer
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#53454b",
                      }}
                      id="confirmedProjectHours"
                    >
                      8.4 verified coding hours recorded via Hackatime
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div className="confirmed-grant-sum" id="confirmedGrantSum">
                      $42.00
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        color: "var(--velvet-red)",
                        fontWeight: 700,
                      }}
                    >
                      Estimated Grant Total
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    className="btn-fetch-projects"
                    id="btnConfirmProject"
                    // onClick={handleConfirmProject}
                    style={{
                      background:
                        "linear-gradient(135deg, var(--velvet-bright), var(--velvet-deep))",
                      borderColor: "var(--gold-primary)",
                    }}
                  >
                    <span>Confirm Project and Proceed to Step 3</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
