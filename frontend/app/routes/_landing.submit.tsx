import { Check, Circle, Clock, Lock, LogIn, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { Route } from "./+types/_landing.submit";
import axios from "axios";
import { useRevalidator } from "react-router";

export interface HackatimeProject {
  name: string;
  total_seconds: number;
  most_recent_heartbeat: string; // ISO 8601, e.g. "2026-11-09T00:03:09Z"
  languages: string[];
  archived: boolean;
}

export async function clientLoader() {
  let userData = null;
  try {
    const userRes = await axios.get("/api/user/me");
    if (
      userRes.status !== 200 ||
      (userRes.data?.status && userRes.data.status !== 200)
    ) {
      return { userData: null, hackatimeProjects: null };
    }
    userData = userRes.data;
  } catch {
    return { userData: null, hackatimeProjects: null };
  }

  let hackatimeProjects: HackatimeProject[] | null = null;
  try {
    const hackatimeRes = await axios.get("/api/hackatime/projects");
    if (
      hackatimeRes.status === 200 &&
      !(hackatimeRes.data?.status && hackatimeRes.data.status !== 200)
    ) {
      hackatimeProjects = hackatimeRes.data as HackatimeProject[];
    }
  } catch {
    hackatimeProjects = null;
  }

  return { userData, hackatimeProjects };
}

export default function SubmitPage({ loaderData }: Route.ComponentProps) {
  const [selectedHackatimeProjects, setSelectedHackatimeProjects] = useState<
    HackatimeProject[]
  >([]);

  const [formData, setFormData] = useState<{
    movieName: string;
    projectName: string;
    siteUrl: string;
    githubUrl: string;
    description: string;
    plannedMovie: string;
  }>({
    description: "",
    githubUrl: "",
    movieName: "",
    plannedMovie: "",
    projectName: "",
    siteUrl: "",
  });

  const [search, setSearch] = useState("");
  const revalidator = useRevalidator();
  const user = loaderData.userData;
  const hackatimeProjects = loaderData.hackatimeProjects;
  const step = !user
    ? 1
    : user && selectedHackatimeProjects.length === 0
      ? 2
      : user && selectedHackatimeProjects.length > 0
        ? 3
        : 1;
  const step2Locked = step < 2;
  const step3Locked = step < 3;

  useEffect(() => {
    console.log(loaderData?.userData);
    console.log(loaderData?.hackatimeProjects);
  }, []);

  const handleHCA = () => {
    window.location.replace("/api/auth/hca");
  };
  const handleHackatime = () => {
    window.location.replace("/api/auth/hackatime");
  };

  function formatHours(seconds: number): string {
    return `${(seconds / 3600).toFixed(1)}h`;
  }

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
          <div
            className={`progress-frame ${!step2Locked ? "completed" : "active"}`}
            id="progressFrame1"
          >
            <div className="frame-number">
              <span>Frame 01</span>
              <span id="frame1BadgeText">Required</span>
            </div>
            <div className="frame-title">1. Sign in with HCA</div>
          </div>

          <div
            className={`progress-frame ${!step3Locked ? "completed" : !step2Locked ? "active" : ""}`}
            id="progressFrame2"
          >
            <div className="frame-number">
              <span>Frame 02</span>
              <span id="frame2BadgeText">
                {step2Locked
                  ? "Locked"
                  : !step3Locked
                    ? "Completed"
                    : "Required"}
              </span>
            </div>
            <div className="frame-title">2. Link Hackatime</div>
          </div>

          <div
            className={`progress-frame ${!step3Locked && "active"}`}
            id="progressFrame3"
          >
            <div className="frame-number">
              <span>Frame 03</span>
              <span id="frame3BadgeText">
                {!step3Locked ? "Required" : "Locked"}
              </span>
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
              {!user ? (
                <span
                  className="step-status-pill status-pending"
                  id="step1StatusPill"
                >
                  <Circle size={15} />
                  <span>Awaiting Sign In</span>
                </span>
              ) : (
                <span
                  className="step-status-pill status-completed"
                  id="step1StatusPill"
                >
                  <Check size={15} />
                  <span>Completed</span>
                </span>
              )}
            </div>

            <div className="step-card-body">
              {/* <!-- Unauthenticated State --> */}
              {loaderData == null || !loaderData.userData ? (
                <div id="hcaLoggedOut">
                  <p className="step-instruction">
                    Hack Club Bank handles grants for teen makers. Sign in with
                    your HCA account so we know where to deposit your cinema
                    ticket grant.
                  </p>

                  <div className="hca-box">
                    <div className="hca-box-header">
                      <div className="hca-brand-title">
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
                        className="btn-hca-auth"
                        id="btnhcaLogin"
                        onClick={handleHCA}
                      >
                        <LogIn />
                        <span>Sign in with Hack Club</span>
                      </button>
                      <p style={{ fontSize: 13, color: "var(--ticket-muted)" }}>
                        Don't have an HCA account yet? A free teen account will
                        be initiated during verification.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* <!-- Unauthenticated State --> */
                <div id="hcaLoggedIn">
                  <p
                    className="step-instruction"
                    style={{ color: "#2e7d32", fontWeight: 600 }}
                  >
                    Step 1 Complete: Your Hack Club account is connected and
                    ready to ship your project
                  </p>

                  <div className="hca-profile-card">
                    <div className="hca-profile-info">
                      <img
                        className="hca-avatar"
                        id="hcaAvatarText"
                        src={loaderData.userData.imageUrl}
                        alt=""
                      />

                      <div>
                        <div className="hca-name" id="hcaUserName">
                          {loaderData.userData.first_name}
                        </div>
                        <div className="hca-handle" id="hcaUserHandle">
                          @{loaderData.userData.displayName} ·{" "}
                          {loaderData.userData.primary_email}
                        </div>
                        <div className="hca-status-badge">
                          <Check color="green" size={18} />
                          <span>Verified Active Teen Account</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-disconnect"
                      id="btnhcaDisconnect"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* second step */}
          <section
            className={`step-card ${step2Locked && "locked"}`}
            id="stepCard2"
          >
            <div className="step-card-header">
              <div className="step-header-left">
                <span className="step-tag">Step 02</span>
                <h2 className="step-header-title">
                  Link Hackatime and Select Project
                </h2>
              </div>
              {step2Locked ? (
                <span
                  className="step-status-pill status-locked"
                  id="step2StatusPill"
                >
                  <Lock size={16} />
                  <span>Locked</span>
                </span>
              ) : !step3Locked ? (
                <span
                  className="step-status-pill status-completed"
                  id="step2StatusPill"
                >
                  <Check size={16} />
                  <span>Completed</span>
                </span>
              ) : (
                <span
                  className="step-status-pill status-active"
                  id="step2StatusPill"
                >
                  <Circle size={16} />
                  <span>Select Project</span>
                </span>
              )}
            </div>

            <div className="step-card-body">
              {/* <!-- Locked Notification --> */}
              {step2Locked && (
                <div className="locked-notice" id="step2LockNotice">
                  <div className="locked-notice-icon">
                    <Lock size={32} />
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
                    Please sign in with Hack Club Auth in Step 1 above to load
                    your Hackatime coding activity and projects.
                  </p>
                </div>
              )}

              {/* <!-- Unlocked Content --> */}
              {!step2Locked &&
                (!hackatimeProjects ? (
                  <div id="hcaLoggedOut">
                    <p className="step-instruction">
                      Hackatime is the official hackclub time tracking software
                      that allows you to track exactly how long it took you to
                      work on a project.
                    </p>

                    <div className="hca-box">
                      <div className="hca-box-header">
                        <div className="hca-brand-title">
                          <Clock />
                          <span>Hackatime</span>
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "var(ticket-muted)",
                          }}
                        >
                          Track hours
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
                          className="btn-hca-auth"
                          id="btnhcaLogin"
                          onClick={handleHackatime}
                        >
                          <LogIn />
                          <span>Link Hackatime</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div id="step2Content">
                    <p className="step-instruction">
                      Select the project you built for your movie website to
                      calculate your ticket grant ($5 per hour, up to 10 hours
                      maximum).
                    </p>

                    {/* <!-- Hackatime Username Search Input --> */}
                    <div className="hackatime-search-box">
                      <input
                        type="text"
                        id="hackatimeProjectSearchInput"
                        className="ht-input"
                        placeholder="super cool project"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn-fetch-projects"
                        id="btnFetchHackatime"
                        onClick={() => revalidator.revalidate()}
                        disabled={revalidator.state === "loading"}
                      >
                        <RefreshCcw
                          className={`${revalidator.state === "loading" && "animate-spin"}`}
                        />
                        <span>Fetch Projects</span>
                      </button>
                    </div>

                    {/* <!-- Available Detected Projects Grid --> */}
                    <div className="projects-list-title">
                      <span>Select your movie website/game project:</span>
                      <span id="projectsCountLabel">
                        {hackatimeProjects.length} projects found
                      </span>
                    </div>

                    <div
                      className="project-options-grid"
                      id="projectOptionsGrid"
                    >
                      {/* <!-- Project 1 --> */}
                      {hackatimeProjects
                        .filter((p) =>
                          p.name
                            .toLocaleLowerCase()
                            .includes(search.toLocaleLowerCase()),
                        )
                        .map((project: HackatimeProject) => (
                          <div
                            key={project.name}
                            className={`project-card-option ${selectedHackatimeProjects.find((p) => p.name === project.name) && "selected"}`}
                            data-project="interstellar flight computer"
                            data-hours={formatHours(project.total_seconds)}
                            data-grant="42.00"
                            onClick={() =>
                              setSelectedHackatimeProjects((prev) =>
                                prev.find((p) => p.name === project.name)
                                  ? prev.filter((p) => p.name !== project.name)
                                  : [...prev, project],
                              )
                            }
                          >
                            <div className="option-top">
                              <div>
                                <div className="option-name">
                                  {project.name}
                                </div>
                              </div>
                              <div className="radio-circle">
                                <div className="radio-dot"></div>
                              </div>
                            </div>
                            <div className="option-meta">
                              <span className="hours-badge">
                                {formatHours(project.total_seconds)} logged
                              </span>
                              <span className="grant-estimate-badge">
                                $
                                {((project.total_seconds / 3600) * 5).toFixed(
                                  2,
                                )}{" "}
                                grant
                              </span>
                            </div>
                          </div>
                        ))}
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
                        <div
                          className="confirmed-title"
                          id="confirmedProjectTitle"
                        >
                          {selectedHackatimeProjects.length} projects selected
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#53454b",
                          }}
                          id="confirmedProjectHours"
                        >
                          {(
                            selectedHackatimeProjects.reduce(
                              (sum, p) => sum + p.total_seconds,
                              0,
                            ) / 3600
                          ).toFixed(1)}{" "}
                          verified coding hours recorded via Hackatime
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div
                          className="confirmed-grant-sum"
                          id="confirmedGrantSum"
                        >
                          $
                          {(
                            (selectedHackatimeProjects.reduce(
                              (sum, p) => sum + p.total_seconds,
                              0,
                            ) /
                              3600) *
                            5
                          ).toFixed(2)}
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
                  </div>
                ))}
            </div>
          </section>

          {/* third step */}
          <section
            className={`step-card ${step3Locked && "locked"}`}
            id="stepCard3"
          >
            <div className="step-card-header">
              <div className="step-header-left">
                <span className="step-tag">Step 03</span>
                <h2 className="step-header-title">Input Project Details</h2>
              </div>
              {step3Locked ? (
                <span
                  className="step-status-pill status-locked"
                  id="step2StatusPill"
                >
                  <Lock size={16} />
                  <span>Locked</span>
                </span>
              ) : (
                <span
                  className="step-status-pill status-active"
                  id="step2StatusPill"
                >
                  <Circle size={16} />
                  <span>Enter details</span>
                </span>
              )}
            </div>

            <div className="step-card-body">
              {/* <!-- Locked Notification --> */}
              {step3Locked && (
                <div className="locked-notice" id="step3LockNotice">
                  <div className="locked-notice-icon">
                    <Lock size={32} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      color: "var(--gold-light)",
                    }}
                  >
                    Step 3 is currently locked
                  </h3>
                  <p>
                    Please complete Step 1 (Sign in with HCA) and Step 2 (Select
                    Hackatime Project) above to unlock this submission form.
                  </p>
                </div>
              )}

              {/* <!-- Unlocked Submission Form --> */}
              {!step3Locked && (
                <form
                  id="projectSubmissionForm"
                  className="project-form"
                  // onsubmit="window.TicketsSubmit.handleFormSubmit(event)"
                >
                  <p className="step-instruction">
                    Fill in the details for your film web experience. Make sure
                    your live link is accessible and your code repository is
                    public so the review crew can examine your project.
                  </p>

                  {/* <!-- Error Alert Banner --> */}
                  <div
                    className="error-banner"
                    id="formErrorBanner"
                    role="alert"
                  ></div>

                  {/* <!-- Row 1: Movie Title & Project Name --> */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="movieTitle" className="form-label">
                        <span>Movie Title</span>
                        <span style={{ color: "var(--velvet-bright)" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="movieTitle"
                        className="form-input"
                        placeholder="e.g. Interstellar, Spirited Away, The Matrix"
                        value={formData.movieName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            movieName: e.target.value,
                          }))
                        }
                        required
                      />
                      <span className="form-hint">
                        The motion picture your website celebrates.
                      </span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="projectName" className="form-label">
                        <span>Project Name</span>
                        <span style={{ color: "var(--velvet-bright)" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        className="form-input"
                        placeholder="e.g. Endurance Flight Computer"
                        value={formData.projectName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            projectName: e.target.value,
                          }))
                        }
                        required
                      />
                      <span className="form-hint">
                        The public title of your web application.
                      </span>
                    </div>
                  </div>

                  {/* <!-- Row 2: Live Link & Public Repo Link --> */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="liveUrl" className="form-label">
                        <span>Live Website Address</span>
                        <span style={{ color: "var(--velvet-bright)" }}>*</span>
                      </label>
                      <input
                        type="url"
                        id="liveUrl"
                        className="form-input"
                        placeholder="https://yourmoviesite.vercel.app"
                        value={formData.siteUrl}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            siteUrl: e.target.value,
                          }))
                        }
                        required
                      />
                      <span className="form-hint">
                        Public URL hosted on Vercel, GitHub Pages, or any host.
                      </span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="repoUrl" className="form-label">
                        <span>Public GitHub Repository</span>
                        <span style={{ color: "var(--velvet-bright)" }}>*</span>
                      </label>
                      <input
                        type="url"
                        id="repoUrl"
                        className="form-input"
                        placeholder="https://github.com/username/repository"
                        value={formData.githubUrl}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            githubUrl: e.target.value,
                          }))
                        }
                        required
                      />
                      <span className="form-hint">
                        Source repository with code authored by you.
                      </span>
                    </div>
                  </div>

                  {/* <!-- Row 3: Description of creative elements --> */}
                  <div className="form-group">
                    <label htmlFor="projectDescription" className="form-label">
                      <span>How does your website celebrate the movie?</span>
                      <span style={{ color: "var(--velvet-bright)" }}>*</span>
                    </label>
                    <textarea
                      id="projectDescription"
                      className="form-textarea"
                      placeholder="Describe your creative choices: custom interactive scenes, original audio soundtracks, cinematic visuals, easter eggs, or storyline reenactments."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      required
                    ></textarea>
                    <span className="form-hint">
                      Be specific about what you created and what makes it
                      special.
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="screenshotFileInput">
                      <span>Website Screenshots</span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--ticket-muted)",
                          fontWeight: 500,
                        }}
                      >
                        (Optional)
                      </span>
                    </label>

                    <input
                      type="file"
                      id="screenshotFileInput"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                    />

                    <div
                      className="screenshot-dropzone"
                      id="screenshotDropzone"
                      role="button"
                      tabIndex={0}
                      aria-label="Upload screenshots"
                    >
                      <div
                        className="screenshot-dropzone-icon"
                        aria-hidden="true"
                      >
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
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </div>
                      <div className="screenshot-dropzone-prompt">
                        Select screenshots or drag and drop image files here
                      </div>
                      <div className="screenshot-dropzone-note">
                        PNG, JPG, or WebP up to 10MB each
                      </div>
                    </div>

                    <span className="form-hint">
                      Upload visual captures of your website design, interactive
                      scenes, or animations.
                    </span>

                    {/* <!-- Preview container for uploaded screenshots --> */}
                    <div
                      className="screenshot-previews-grid"
                      id="screenshotPreviewsGrid"
                      style={{ display: "none" }}
                    ></div>
                  </div>

                  {/* <!-- Row 4: Cinema Choice & Watchlist --> */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nextMovie" className="form-label">
                        <span>What movie do you plan to watch next?</span>
                        <span style={{ color: "var(--velvet-bright)" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="nextMovie"
                        className="form-input"
                        placeholder="e.g. Dune Part Two, Tron Ares"
                        value={formData.plannedMovie}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            plannedMovie: e.target.value,
                          }))
                        }
                        required
                      />
                      <span className="form-hint">
                        Tell us what you are excited to see on the big screen.
                      </span>
                    </div>
                  </div>

                  {/* <!-- Eligibility Checkboxes --> */}
                  <div className="checkbox-group">
                    <label className="checkbox-item">
                      <input type="checkbox" id="checkAge" required />
                      <span className="checkbox-text">
                        I confirm that I am a teenager 18 years old or younger.
                      </span>
                    </label>

                    <label className="checkbox-item">
                      <input type="checkbox" id="checkAuthor" required />
                      <span className="checkbox-text">
                        I authored this project myself, my site is live, and my
                        repository is public.
                      </span>
                    </label>

                    <label className="checkbox-item">
                      <input type="checkbox" id="checkTime" required />
                      <span className="checkbox-text">
                        My hours were authentically recorded with Hackatime
                        during development.
                      </span>
                    </label>
                  </div>

                  {/* <!-- Submit Button --> */}
                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn-submit-project"
                      id="btnSubmitForm"
                    >
                      <span>Submit Project For Review</span>
                    </button>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--ticket-muted)",
                        textAlign: "center",
                      }}
                    >
                      Once submitted, the Hack Club team reviews your project
                      and verifies tracked hours before grant payout.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
