import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  LogIn,
  LogOut,
  Trash2,
  GraduationCap,
  Mail,
  X,
  Users,
  Clock3,
} from "lucide-react";

const PROGRAMS = [
  "BS Computer Science",
  "BS Information Technology",
  "BS Nursing",
  "BS Accountancy",
  "BS Business Administration",
  "BS Computer Engineering",
  "BS Electronics Engineering",
  "BS Civil Engineering",
  "BS Architecture",
  "BS Music",
  "BS Medical Technology",
];

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}
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

let nextRowId = 1;

export default function App() {
  const [students, setStudents] = useState([]);
  const [now, setNow] = useState(new Date());
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: "",
    program: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.program.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [students, query]);

  const onCampusCount = students.filter((s) => s.status === "in").length;
  const checkedOutCount = students.filter((s) => s.status === "out").length;

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (error) setError("");
  }

  function handleAdd(e) {
    e.preventDefault();
    const studentId = form.studentId.trim();
    const name = form.name.trim();
    const email = form.email.trim();
    const program = form.program.trim();

    if (!studentId || !name || !email || !program) {
      setError("Fill in every field before adding a student.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("That email address doesn't look right.");
      return;
    }
    if (
      students.some(
        (s) => s.studentId.toLowerCase() === studentId.toLowerCase(),
      )
    ) {
      setError(`Student ID ${studentId} is already on the roster.`);
      return;
    }

    setStudents((prev) => [
      ...prev,
      {
        rowId: nextRowId++,
        studentId,
        name,
        email,
        program,
        timeIn: null,
        timeOut: null,
        status: "none",
      },
    ]);
    setForm({ studentId: "", name: "", email: "", program: "" });
  }

  function handleTimeIn(rowId) {
    setStudents((prev) =>
      prev.map((s) =>
        s.rowId === rowId
          ? {
              ...s,
              timeIn: formatTime(new Date()),
              timeOut: null,
              status: "in",
            }
          : s,
      ),
    );
  }
  function handleTimeOut(rowId) {
    setStudents((prev) =>
      prev.map((s) =>
        s.rowId === rowId
          ? { ...s, timeOut: formatTime(new Date()), status: "out" }
          : s,
      ),
    );
  }
  function handleRemove(rowId) {
    setStudents((prev) => prev.filter((s) => s.rowId !== rowId));
  }

  const statusMeta = {
    none: { label: "Not checked in", color: "#9A7583", bar: "#E9D2DC" },
    in: { label: "On campus", color: "#2F8F5B", bar: "#2F8F5B" },
    out: { label: "Checked out", color: "#C2255C", bar: "#C2255C" },
  };

  const labelStyle = {
    display: "block",
    fontSize: 12.5,
    fontWeight: 600,
    color: "#9C1C49",
    marginBottom: 5,
    marginTop: 12,
  };
  const inputStyle = {
    width: "100%",
    padding: "9px 11px",
    borderRadius: 7,
    border: "1px solid #E9B9CE",
    fontSize: 14,
    boxSizing: "border-box",
  };
  const pillButtonStyle = (disabled, color) => ({
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12.5,
    fontWeight: 600,
    padding: "7px 10px",
    borderRadius: 7,
    border: `1px solid ${disabled ? "#EAD8DF" : color}`,
    background: disabled ? "#F7EEF2" : "#fff",
    color: disabled ? "#C7AEB8" : color,
    cursor: disabled ? "not-allowed" : "pointer",
    whiteSpace: "nowrap",
  });

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
            marginBottom: 28,
          }}
        >
          <div>
            <h1 style={{ fontSize: 34, margin: 0 }}>Attendance Desk</h1>
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

        <div
          style={{
            display: "flex",
            gap: 14,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Registered", value: students.length, Icon: Users },
            { label: "On campus", value: onCampusCount, Icon: LogIn },
            { label: "Checked out", value: checkedOutCount, Icon: LogOut },
          ].map(({ label, value, Icon }) => (
            <div
              key={label}
              style={{
                flex: "1 1 140px",
                background: "#FFFFFF",
                border: "1px solid #F0C9D8",
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Icon size={18} color="#C2255C" />
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontSize: 12.5, color: "#9A7583", marginTop: 2 }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <form
            onSubmit={handleAdd}
            style={{
              flex: "1 1 300px",
              maxWidth: 340,
              background: "#FBE4EC",
              border: "1px solid #F0C9D8",
              borderRadius: 14,
              padding: 22,
            }}
          >
            <h2 style={{ fontSize: 19, fontWeight: 600, margin: "0 0 16px" }}>
              Register a student
            </h2>

            <label style={labelStyle}>Student ID</label>
            <input
              style={inputStyle}
              placeholder="e.g. 2026-00451"
              value={form.studentId}
              onChange={(e) => updateField("studentId", e.target.value)}
            />

            <label style={labelStyle}>Full name</label>
            <input
              style={inputStyle}
              placeholder="Juan Dela Cruz"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />

            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              placeholder="juan.delacruz@school.edu"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />

            <label style={labelStyle}>College program</label>
            <input
              style={inputStyle}
              placeholder="Type or pick a program"
              list="program-options"
              value={form.program}
              onChange={(e) => updateField("program", e.target.value)}
            />
            <datalist id="program-options">
              {PROGRAMS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>

            {error && (
              <div style={{ color: "#C2255C", fontSize: 13, marginTop: 10 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: 16,
                background: "#C2255C",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "11px 0",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Plus size={16} /> Add to roster
            </button>
          </form>

          <div style={{ flex: "2 1 480px", minWidth: 300 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#FFFFFF",
                border: "1px solid #F0C9D8",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 16,
              }}
            >
              <Search size={16} color="#9A7583" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, ID, email, or program"
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: 14.5,
                  flex: 1,
                  background: "transparent",
                }}
              />
              {query && (
                <X
                  size={15}
                  color="#9A7583"
                  style={{ cursor: "pointer" }}
                  onClick={() => setQuery("")}
                />
              )}
            </div>

            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 20px",
                  color: "#9A7583",
                  background: "#FFFFFF",
                  border: "1px dashed #F0C9D8",
                  borderRadius: 12,
                }}
              >
                {students.length === 0
                  ? "No students registered yet. Add one from the panel on the left."
                  : "No student matches that search."}
              </div>
            ) : (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #F0C9D8",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {filtered.map((s, idx) => {
                  const meta = statusMeta[s.status];
                  return (
                    <div
                      key={s.rowId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "16px 18px",
                        borderTop: idx === 0 ? "none" : "1px solid #F6DEE7",
                        borderLeft: `4px solid ${meta.bar}`,
                      }}
                    >
                      <div style={{ minWidth: 0, flex: "1 1 200px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <span style={{ fontSize: 16.5, fontWeight: 600 }}>
                            {s.name}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#9C1C49",
                              background: "#FBE4EC",
                              padding: "2px 8px",
                              borderRadius: 20,
                              fontWeight: 600,
                            }}
                          >
                            #{s.studentId}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 14,
                            marginTop: 5,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              color: "#9A7583",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <GraduationCap size={13} /> {s.program}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#9A7583",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <Mail size={13} /> {s.email}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          textAlign: "right",
                          minWidth: 128,
                          flex: "0 0 auto",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: meta.color,
                            marginBottom: 4,
                          }}
                        >
                          {meta.label}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#9A7583",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Clock3 size={12} />
                          {s.timeIn ? `In ${s.timeIn}` : "—"}
                          {s.timeOut ? ` · Out ${s.timeOut}` : ""}
                        </div>
                      </div>

                      <div
                        style={{ display: "flex", gap: 8, flex: "0 0 auto" }}
                      >
                        <button
                          onClick={() => handleTimeIn(s.rowId)}
                          disabled={s.status === "in"}
                          style={pillButtonStyle(s.status === "in", "#2F8F5B")}
                        >
                          <LogIn size={13} /> Time In
                        </button>
                        <button
                          onClick={() => handleTimeOut(s.rowId)}
                          disabled={!s.timeIn || s.status === "out"}
                          style={pillButtonStyle(
                            !s.timeIn || s.status === "out",
                            "#C2255C",
                          )}
                        >
                          <LogOut size={13} /> Time Out
                        </button>
                        <button
                          onClick={() => handleRemove(s.rowId)}
                          title="Remove student"
                          style={{
                            border: "1px solid #F0C9D8",
                            background: "#fff",
                            borderRadius: 7,
                            width: 30,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#9A7583",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
