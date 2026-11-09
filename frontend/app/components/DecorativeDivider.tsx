import React from "react";

export default function DecorativeDivider() {
  return (
    <div className="film-perforation" aria-hidden="true">
      <div className="perforation-line"></div>
      <div className="sprocket-cluster">
        <div className="sprocket-hole"></div>
        <div className="sprocket-hole"></div>
        <div className="sprocket-hole"></div>
      </div>
      <div className="perforation-line"></div>
    </div>
  );
}
