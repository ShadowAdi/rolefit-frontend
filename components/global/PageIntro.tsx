"use client";

import { useEffect, useRef, useState } from "react";

// ─── Fake PDF card ─────────────────────────────────────────────────────────────
function PdfCard({
  label,
  rotation,
  tx,
  ty,
  z,
  visible,
  delay,
}: {
  label: string;
  rotation: number;
  tx: number;
  ty: number;
  z: number;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: 150,
        height: 200,
        borderRadius: 10,
        background: "white",
        boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
        zIndex: z,
        transform: visible
          ? `rotate(${rotation}deg) translate(${tx}px, ${ty}px)`
          : `rotate(0deg) translate(0px, 30px)`,
        opacity: visible ? 1 : 0,
        transition: `transform 0.65s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms,
                     opacity 0.4s ease ${delay}ms`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* lime top bar */}
      <div style={{ height: 7, background: "#a3e635", flexShrink: 0 }} />
      <div style={{ padding: "10px 12px", flex: 1 }}>
        <p
          style={{
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#374151",
            margin: "0 0 10px",
          }}
        >
          {label}
        </p>
        {[75, 100, 55, 90, 40, 80, 65].map((w, i) => (
          <div
            key={i}
            style={{
              height: 5,
              borderRadius: 3,
              background: i % 4 === 0 ? "#d9f99d" : "#f3f4f6",
              width: `${w}%`,
              marginBottom: 7,
            }}
          />
        ))}
        {/* fake button */}
        <div
          style={{
            marginTop: 14,
            height: 20,
            borderRadius: 4,
            background: "#a3e635",
            width: "55%",
          }}
        />
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
type Phase = "start" | "expanding" | "show" | "collapsing" | "done";

export default function PageIntro() {
  const [phase, setPhase] = useState<Phase>("start");
  const [size, setSize] = useState({ w: 260, h: 110 });
  const [pdfsVisible, setPdfsVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const t = (fn: () => void, ms: number) =>
    timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    // 1. Brief pause → start expanding
    t(() => {
      setPhase("expanding");
      setSize({ w: window.innerWidth + 60, h: window.innerHeight + 60 });
    }, 350);

    // 2. Card filled screen → show content
    t(() => {
      setPhase("show");
      setPdfsVisible(true);
    }, 920);

    // 3. Hold → PDFs fly back in
    t(() => setPdfsVisible(false), 2500);

    // 4. Collapse card
    t(() => {
      setPhase("collapsing");
      setSize({ w: 260, h: 110 });
    }, 2800);

    // 5. Done — unmount
    t(() => setPhase("done"), 3500);

    return () => timers.current.forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  const expanded = phase === "expanding" || phase === "show";
  const textVisible = phase === "show";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        // subtle dark bg behind the card during start/collapse
        background:
          phase === "start" || phase === "collapsing" || phase === "done"
            ? "transparent"
            : "transparent",
        pointerEvents: "none",
      }}
    >
      {/* ── The expanding card ── */}
      <div
        style={{
          width: size.w,
          height: size.h,
          background: "#84cc16", // lime-500
          borderRadius: expanded ? 0 : 18,
          transition:
            phase === "expanding"
              ? "width 0.58s cubic-bezier(0.76,0,0.24,1), height 0.58s cubic-bezier(0.76,0,0.24,1), border-radius 0.4s ease"
              : phase === "collapsing"
              ? "width 0.52s cubic-bezier(0.76,0,0.24,1) 0.1s, height 0.52s cubic-bezier(0.76,0,0.24,1) 0.1s, border-radius 0.35s ease 0.45s"
              : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Brand name ── */}
        <div
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(14px)",
            transition:
              "opacity 0.4s ease 0.05s, transform 0.5s cubic-bezier(0.34,1.4,0.64,1) 0.05s",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#1a2e05",
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            zIndex: 2,
            position: "relative",
            lineHeight: 1,
            marginBottom: 6,
          }}
        >
          Rolefit
        </div>

        {/* ── Tagline ── */}
        <div
          style={{
            opacity: textVisible ? 0.65 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(10px)",
            transition:
              "opacity 0.4s ease 0.15s, transform 0.5s cubic-bezier(0.34,1.4,0.64,1) 0.15s",
            fontSize: 12,
            color: "#365314",
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            letterSpacing: "0.06em",
            zIndex: 2,
            position: "relative",
            marginBottom: 80,
          }}
        >
          TAILORED RESUMES · EVERY TIME
        </div>

        {/* ── PDF fan — anchored to bottom-center ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            // shift left so the fan looks centered across 3 cards
            marginLeft: -75,
          }}
        >
          {/* Left card */}
          <PdfCard
            label="Cover Letter"
            rotation={-14}
            tx={-95}
            ty={-20}
            z={1}
            visible={pdfsVisible}
            delay={80}
          />
          {/* Center card — tallest, no rotation */}
          <PdfCard
            label="Resume"
            rotation={0}
            tx={0}
            ty={-40}
            z={3}
            visible={pdfsVisible}
            delay={0}
          />
          {/* Right card */}
          <PdfCard
            label="Portfolio"
            rotation={14}
            tx={95}
            ty={-20}
            z={2}
            visible={pdfsVisible}
            delay={140}
          />
        </div>
      </div>
    </div>
  );
}