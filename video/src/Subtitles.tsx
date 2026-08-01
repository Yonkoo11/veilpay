import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, SUBTITLES } from "./constants";
import { INTER } from "./fonts";

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const active = SUBTITLES.find((entry) => frame >= entry.start && frame < entry.end);
  if (!active) return null;
  return <div style={{ position: "absolute", left: "50%", bottom: 42, transform: "translateX(-50%)", zIndex: 100, width: "min(1540px, 84%)", padding: "11px 24px", borderRadius: 10, background: "rgba(5, 6, 6, 0.82)", border: `1px solid ${COLORS.border}`, backdropFilter: "blur(10px)", color: COLORS.ink, fontFamily: INTER, fontSize: 32, fontWeight: 650, lineHeight: 1.35, textAlign: "center" }}>{active.text}</div>;
};
