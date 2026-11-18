import {
  ArrowLeft,
  Check,
  Circle,
  Clock,
  FileImage,
  Lock,
  LogIn,
  RefreshCcw,
  Shield,
} from "lucide-react";
import React, { useState } from "react";
import type { Route } from "./+types/_landing.submit";
import axios, { isAxiosError } from "axios";
import { Link, useNavigate, useRevalidator } from "react-router";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "WEBP"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface HackatimeProject {
  name: string;
  total_seconds: number;
  most_recent_heartbeat: string; // ISO 8601, e.g. "2026-11-09T00:03:09Z"
  languages: string[];
  archived: boolean;
}

function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    // No response means the request never reached the server
    if (!err.response) {
      return err.code === "ECONNABORTED"
        ? "The request timed out. Please try again."
        : "Could not reach the server. Check your connection and try again.";
    }

    const message = err.response.data?.message;

    // Nest validation errors come back as an array of strings
    if (Array.isArray(message) && message.length > 0) return message.join(". ");
    if (typeof message === "string" && message) return message;

    if (err.response.status === 413) return "That file is too large.";
    if (err.response.status >= 500) {
      return "Something went wrong on our end. Please try again shortly.";
    }
  }
  return "Something went wrong. Please try again.";
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Submit - Tickets - Hack club" },
    {
      name: "description",
      content:
        "Build a website, game, or other project themed around a movie and earn ticket grants to go watch more movies with Tickets.",
    },
  ];
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

  const [formInputData, setFormInputData] = useState<{
    movieName: string;
    projectName: string;
    playableUrl: string;
    codeUrl: string;
    description: string;
    plannedMovie: string;
    screenshotFile: File | null;
  }>({
    description: "",
    codeUrl: "",
    movieName: "",
    plannedMovie: "",
    projectName: "",
    playableUrl: "",
    screenshotFile: null,
  });

  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const nav = useNavigate();
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

  const handleHCA = () => {
    window.location.replace("/api/auth/hca");
  };
  const handleHackatime = () => {
    window.location.replace("/api/auth/hackatime");
  };

  function formatHours(seconds: number): string {
    return `${(seconds / 3600).toFixed(1)}h`;
  }

  const handleFileUpload = (file: File) => {
    if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);

    setFormInputData((prev) => ({ ...prev, screenshotFile: file }));
    setScreenshotUrl(URL.createObjectURL(file));
  };

  const handleRemoveScreenshot = () => {
    if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);

    setFormInputData((prev) => ({ ...prev, screenshotFile: null }));
    setScreenshotUrl("");
  };

  const handleProjectSubmission = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (submitting) return;

    setFormError(null);

    const { screenshotFile } = formInputData;

    if (!screenshotFile) {
      setFormError("Please upload a screenshot of your project.");
      return;
    }
    if (screenshotFile.size > MAX_FILE_SIZE) {
      setFormError("Your screenshot must be 5MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("projectName", formInputData.projectName);
    formData.append("codeUrl", formInputData.codeUrl);
    formData.append("playableUrl", formInputData.playableUrl);
    formData.append("description", formInputData.description);
    formData.append("plannedMovieToWatch", formInputData.plannedMovie);
    formData.append("movieName", formInputData.movieName);
    formData.append("screenshotFile", screenshotFile);
    selectedHackatimeProjects.forEach((p) =>
      formData.append("hackatimeProjectNames", p.name),
    );

    setSubmitting(true);
    try {
      await axios.post("/api/submit", formData);
      setSubmitted(true);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setFormError("Your session has expired. Please sign in again.");
        revalidator.revalidate(); // reloads user data so the steps reflect it
      } else {
        setFormError(getErrorMessage(err));
      }
      document
        .getElementById("formErrorBanner")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container">
      <div id="submissionView">
        {/* <!-- Hero Header --> */}
        <section className="submission-hero">
          <h1 className="sub-title">
            Submit Your <span className="gold-accent">Movie Project</span>
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
            className={`progress-frame ${submitted ? "completed" : !step3Locked ? "active" : ""}`}
            id="progressFrame3"
          >
            <div className="frame-number">
              <span>Frame 03</span>
              <span id="frame3BadgeText">
                {submitted ? "Submitted" : !step3Locked ? "Required" : "Locked"}
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
                        <Shield />
                        <span>Hack Club Auth</span>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--ticket-muted)",
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
                /* <!-- Authenticated State --> */
                <div id="hcaLoggedIn">
                  <p
                    className="step-instruction"
                    style={{ color: "#000", fontWeight: 600 }}
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
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-disconnect"
                      id="btnhcaDisconnect"
                      onClick={() =>
                        window.location.replace("/api/auth/logout")
                      }
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
                      color: "#000",
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
                            color: "var(--ticket-muted)",
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
                      Select the project you built around your movie to
                      calculate your ticket grant ($5 for every hour of tracked
                      build time).
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
                      <span>Select your movie project:</span>
                      <span id="projectsCountLabel">
                        {hackatimeProjects.length} projects found
                      </span>
                    </div>

                    <div
                      className="project-options-grid"
                      id="projectOptionsGrid"
                    >
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
                            color: "#333",
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
                            color: "#000",
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
                  id="step3StatusPill"
                >
                  <Lock size={16} />
                  <span>Locked</span>
                </span>
              ) : submitted ? (
                <span
                  className="step-status-pill status-completed"
                  id="step3StatusPill"
                >
                  <Check size={16} />
                  <span>Submitted</span>
                </span>
              ) : (
                <span
                  className="step-status-pill status-active"
                  id="step3StatusPill"
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
                      color: "#000",
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

              {/* <!-- Success State --> */}
              {!step3Locked && submitted && (
                <div className="locked-notice" role="status">
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                    }}
                  >
                    Project submitted
                  </h3>
                  <p>
                    Thanks for shipping. The Hack Club team will review your
                    project and verify your tracked hours before grant payout.
                  </p>
                </div>
              )}

              {/* <!-- Unlocked Submission Form --> */}
              {!step3Locked && !submitted && (
                <form
                  id="projectSubmissionForm"
                  className="project-form"
                  onSubmit={handleProjectSubmission}
                >
                  <p className="step-instruction">
                    Fill in the details for your movie-themed project. Make sure
                    your project link is accessible and your code repository is
                    public so the review crew can examine your project.
                  </p>

                  {/* <!-- Error Alert Banner --> */}

                  <div
                    className="error-banner"
                    id="formErrorBanner"
                    role="alert"
                    style={{ display: formError ? "block" : "none" }}
                  >
                    {formError}
                  </div>

                  {/* <!-- Row 1: Movie Title & Project Name --> */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="movieTitle" className="form-label">
                        <span>Movie Title</span>
                        <span style={{ color: "#000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="movieTitle"
                        className="form-input"
                        placeholder="e.g. Interstellar, Spirited Away, The Matrix"
                        value={formInputData.movieName}
                        onChange={(e) =>
                          setFormInputData((prev) => ({
                            ...prev,
                            movieName: e.target.value,
                          }))
                        }
                        required
                      />
                      <span className="form-hint">
                        The motion picture your project celebrates.
                      </span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="projectName" className="form-label">
                        <span>Project Name</span>
                        <span style={{ color: "#000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        className="form-input"
                        placeholder="e.g. Endurance Flight Computer"
                        value={formInputData.projectName}
                        onChange={(e) =>
                          setFormInputData((prev) => ({
                            ...prev,
                            projectName: e.target.value,
                          }))
                        }
                        required
                      />
                      <span className="form-hint">
                        The public title of your project.
                      </span>
                    </div>
                  </div>

                  {/* <!-- Row 2: Live Link & Public Repo Link --> */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="liveUrl" className="form-label">
                        <span>Live Project URL</span>
                        <span style={{ color: "#000" }}>*</span>
                      </label>
                      <input
                        type="url"
                        id="liveUrl"
                        className="form-input"
                        placeholder="https://yourproject.vercel.app"
                        value={formInputData.playableUrl}
                        onChange={(e) =>
                          setFormInputData((prev) => ({
                            ...prev,
                            playableUrl: e.target.value,
                          }))
                        }
                        required
                      />
                      <span className="form-hint">
                        Public link to try or view your project, hosted on any
                        platform.
                      </span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="repoUrl" className="form-label">
                        <span>Public GitHub Repository</span>
                        <span style={{ color: "#000" }}>*</span>
                      </label>
                      <input
                        type="url"
                        id="repoUrl"
                        className="form-input"
                        placeholder="https://github.com/username/repository"
                        value={formInputData.codeUrl}
                        onChange={(e) =>
                          setFormInputData((prev) => ({
                            ...prev,
                            codeUrl: e.target.value,
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
                      <span>How does your project celebrate the movie?</span>
                      <span style={{ color: "#000" }}>*</span>
                    </label>
                    <textarea
                      id="projectDescription"
                      className="form-textarea"
                      placeholder="Describe your creative choices: custom interactive scenes, original audio soundtracks, cinematic visuals, easter eggs, or storyline reenactments."
                      value={formInputData.description}
                      onChange={(e) =>
                        setFormInputData((prev) => ({
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

                  {/* File upload */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="screenshotFileInput">
                      <span>Project Screenshot</span>
                      <span style={{ color: "#000" }}>*</span>
                    </label>

                    <FileUploader
                      name="screenshotFileInput"
                      fileOrFiles={formInputData.screenshotFile}
                      handleChange={(file: File | File[]) => {
                        const single = Array.isArray(file) ? file[0] : file;
                        if (single) handleFileUpload(single);
                      }}
                      multiple={false}
                      types={fileTypes}
                      required
                    >
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
                          <FileImage />
                        </div>
                        <div className="screenshot-dropzone-prompt">
                          Select screenshots or drag and drop image files here
                        </div>
                        <div className="screenshot-dropzone-note">
                          PNG, JPG, or WebP up to 5MB
                        </div>
                      </div>
                    </FileUploader>

                    <span className="form-hint">
                      Upload a screenshot of your website, game, or other
                      project.
                    </span>

                    {/* <!-- Preview container for uploaded screenshots --> */}
                    <div
                      className="screenshot-previews-grid"
                      id="screenshotPreviewsGrid"
                      style={{ display: !screenshotUrl ? "none" : "grid" }}
                    >
                      <div className="screenshot-preview-card">
                        <img
                          className="screenshot-preview-img"
                          src={screenshotUrl}
                          alt="Project Screenshot"
                        />
                        <button
                          type="button"
                          className="screenshot-remove-btn"
                          aria-label="Remove screenshot"
                          onClick={handleRemoveScreenshot}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Row 4: Cinema Choice & Watchlist --> */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nextMovie" className="form-label">
                        <span>What movie do you plan to watch next?</span>
                        <span style={{ color: "#000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="nextMovie"
                        className="form-input"
                        placeholder="e.g. Dune Part Two, Tron Ares"
                        value={formInputData.plannedMovie}
                        onChange={(e) =>
                          setFormInputData((prev) => ({
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
                        I authored this project myself, it is live, and my
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
                      disabled={submitting}
                    >
                      <span>
                        {submitting
                          ? "Submitting..."
                          : "Submit Project For Review"}
                      </span>
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
