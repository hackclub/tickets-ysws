import React from "react";
import { useSearchParams } from "react-router";

export function meta() {
  return [
    { title: "Error - Ticket - Hack Club" },
    {
      name: "description",
      content: "Error page",
    },
  ];
}

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  return (
    <main className="container">
      <div id="submissionView">
        {/* <!-- Hero Header --> */}
        <section className="submission-hero">
          <h1 className="sub-title">Something isn't right here.</h1>
          <p className="sub-lead">
            {error
              ? error
              : "We encountered an issue, contact @AzCodes on slack or email me@azcodes.dev if it's urgent"}
          </p>
        </section>
      </div>
    </main>
  );
}
