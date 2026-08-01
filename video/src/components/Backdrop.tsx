import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.008) * 50;
  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: 0.18 }} />
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%", left: -260 + drift, top: -300, background: COLORS.lime, filter: "blur(180px)", opacity: 0.08 }} />
      <div style={{ position: "absolute", width: 620, height: 620, borderRadius: "50%", right: -180 - drift, bottom: -260, background: COLORS.amber, filter: "blur(170px)", opacity: 0.07 }} />
    </AbsoluteFill>
  );
};
