import React, { useState, useEffect } from "react";

function formatClock(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function App() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: "#FDF3F6",
        minHeight: "100vh",
        padding: "32px 20px",
        color: "#3B1E2B",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "2px solid #F0C9D8",
            paddingBottom: 20,
          }}
        >
          <div>
            <h1 style={{ fontSize: 34, margin: 0, color: "#3B1E2B" }}>
              Attendance Desk
            </h1>
            <p style={{ margin: "6px 0 0", color: "#9A7583" }}>
              Keep track of who's on campus, program by program.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, color: "#C2255C" }}>
              {formatClock(now)}
            </div>
            <div style={{ fontSize: 13, color: "#9A7583" }}>
              {formatDate(now)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
