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

//stage 2
import { useState, useEffect } from "react";

function formatClock(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
function formatDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

const PROGRAMS = [
  "BS Computer Science",
  "BS Information Technology",
  "BS Nursing",
  "BS Accountancy",
  "BS Business Administration",
];

export default function App() {
  const [now, setNow] = useState(new Date());
  const [form, setForm] = useState({ studentId: "", name: "", email: "", program: "" });

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 600, color: "#9C1C49", marginBottom: 5, marginTop: 12 };
  const inputStyle = { width: "100%", padding: "9px 11px", borderRadius: 7, border: "1px solid #E9B9CE", fontSize: 14, boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: "sans-serif", background: "#FDF3F6", minHeight: "100vh", padding: "32px 20px", color: "#3B1E2B" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid #F0C9D8", paddingBottom: 20, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 34, margin: 0 }}>Attendance Desk</h1>
            <p style={{ margin: "6px 0 0", color: "#9A7583" }}>Keep track of who's on campus, program by program.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, color: "#C2255C" }}>{formatClock(now)}</div>
            <div style={{ fontSize: 13, color: "#9A7583" }}>{formatDate(now)}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { label: "Registered", value: 0 },
            { label: "On campus", value: 0 },
            { label: "Checked out", value: 0 },
          ].map(({ label, value }) => (
            <div key={label} style={{ flex: "1 1 140px", background: "#FFFFFF", border: "1px solid #F0C9D8", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: 12.5, color: "#9A7583", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <form style={{ maxWidth: 340, background: "#FBE4EC", border: "1px solid #F0C9D8", borderRadius: 14, padding: 22 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, margin: "0 0 16px" }}>Register a student</h2>

          <label style={labelStyle}>Student ID</label>
          <input style={inputStyle} placeholder="e.g. 2026-00451" value={form.studentId} onChange={(e) => updateField("studentId", e.target.value)} />

          <label style={labelStyle}>Full name</label>
          <input style={inputStyle} placeholder="Juan Dela Cruz" value={form.name} onChange={(e) => updateField("name", e.target.value)} />

          <label style={labelStyle}>Email</label>
          <input style={inputStyle} placeholder="juan.delacruz@school.edu" value={form.email} onChange={(e) => updateField("email", e.target.value)} />

          <label style={labelStyle}>College program</label>
          <input style={inputStyle} placeholder="Type or pick a program" list="program-options" value={form.program} onChange={(e) => updateField("program", e.target.value)} />
          <datalist id="program-options">
            {PROGRAMS.map((p) => <option key={p} value={p} />)}
          </datalist>

          <button type="submit" style={{ width: "100%", marginTop: 16, background: "#C2255C", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 600, cursor: "pointer" }}>
            Add to roster
          </button>
        </form>
      </div>
    </div>
  );
}
