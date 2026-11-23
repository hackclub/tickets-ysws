import { ChevronDown } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const faqs = [
  {
    question: "Who can participate?",
    answer:
      "Any teenager between 13 to 18 years old anywhere on earth can join.",
  },
  {
    question: "Do I need experience?",
    answer:
      "No. Beginners are welcome. There's are several other teens that are ready to help you on Slack, don't worry they are friendly.",
  },
  {
    question: "Does it cost anything?",
    answer: "No. It's completely free.",
  },
  {
    question: "What counts as a valid project?",
    answer:
      "A project clearly themed around a movie, built by you, with a public repo and a live, playable, or viewable link. It could be a website or game.",
  },
  {
    question: "Can I use AI tools?",
    answer:
      "AI tools are only permitted for debugging, and learning, the actual code and design must be done by you.",
  },
  {
    question: "When does it end?",
    // Previous copy, for when Tickets goes live:
    // "Tickets is active today and running through the current season. RSVP early to ensure your grant allocation, and check our Slack channel for the final curtain call announcement."
    answer:
      "January 04, 2027, but this could be reduced based on this program performance.",
  },
  {
    question: "Who runs this?",
    answer:
      "This program in run by teens in Hack Club. Hack Club provides the funds though",
  },
];

export default function FaqSection() {
  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-title-wrap">
          <h2 className="section-title">Got Questions?</h2>
        </div>

        <div className="faq-container">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary className="faq-summary">
                <div className="faq-question-wrap">
                  <span className="faq-stub-notch" aria-hidden="true"></span>
                  <span className="faq-question">{faq.question}</span>
                </div>
                <div className="faq-toggle-icon" aria-hidden="true">
                  <ChevronDown />
                </div>
              </summary>
              <div className="faq-content">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        {/* <!-- RSVP Call to Action Banner --> */}
        <div className="cta-banner">
          <h3 className="cta-title">Is your Project ready?</h3>
          <p className="cta-desc">
            All done with your awesome project, I can't wait to see it.
          </p>
          <Link to="/submit" className="btn-rsvp">
            <span>Submit Project</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
