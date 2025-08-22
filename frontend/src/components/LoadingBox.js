import React from "react";

export default function LoadingBox() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "50vh",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="fw-semibold text-muted">Loading...</span>
    </div>
  );
}
