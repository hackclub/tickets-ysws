import React from "react";

export default function Header() {
  return (
    <header className="site-header">
      <a
        href="https://hackclub.com"
        target="_blank"
        rel="noopener noreferrer"
        className="site-header-brand"
      >
        <img src="/logo.png" className="hackclub-logo" alt="Hack Club" />
      </a>
    </header>
  );
}
