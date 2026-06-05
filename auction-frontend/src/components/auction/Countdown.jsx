import { useState, useEffect } from "react";

function parseMs(ms) {
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { d, h, m, s };
}

export default function Countdown({ endTime, compact = false }) {
  const [ms, setMs] = useState(Math.max(0, new Date(endTime) - new Date()));

  useEffect(() => {
    if (ms <= 0) return;
    const interval = setInterval(() => {
      setMs((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (ms <= 0) {
    return compact
      ? <span style={{ color: "#e55", fontSize: "0.75rem" }}>Ended</span>
      : <span style={{ color: "#e55", fontWeight: 600 }}>Auction Ended</span>;
  }

  const { d, h, m, s } = parseMs(ms);
  const urgent = ms < 3600000; // < 1 hour

  if (compact) {
    return (
      <span style={{ color: urgent ? "#e55555" : "#e8c547", fontSize: "0.8rem", fontWeight: 600, fontFamily: "monospace" }}>
        ⏱ {d > 0 ? `${d}d ${h}h` : `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}
      </span>
    );
  }

  const unit = { display: "flex", flexDirection: "column", alignItems: "center", minWidth: "50px" };
  const num = { fontSize: "1.6rem", fontWeight: 700, fontFamily: "'Syne', sans-serif", color: urgent ? "#e55555" : "#f0ede6", lineHeight: 1 };
  const lbl = { fontSize: "0.65rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.25rem" };

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {d > 0 && <div style={unit}><span style={num}>{d}</span><span style={lbl}>days</span></div>}
      <div style={unit}><span style={num}>{String(h).padStart(2, "0")}</span><span style={lbl}>hrs</span></div>
      <div style={{ color: "#333", fontSize: "1.2rem", alignSelf: "flex-start", paddingTop: "2px" }}>:</div>
      <div style={unit}><span style={num}>{String(m).padStart(2, "0")}</span><span style={lbl}>min</span></div>
      <div style={{ color: "#333", fontSize: "1.2rem", alignSelf: "flex-start", paddingTop: "2px" }}>:</div>
      <div style={unit}><span style={num}>{String(s).padStart(2, "0")}</span><span style={lbl}>sec</span></div>
    </div>
  );
}
