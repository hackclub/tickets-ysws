import React from "react";
import { Link } from "react-router";

export default function Header() {
  return (
    <header className="site-header">
      <Link
        to="/"
        className="site-header-brand"
      >
        <img src="/logo.png" className="hackclub-logo" alt="Hack Club" />
      </Link>
    </header>
  );
}
