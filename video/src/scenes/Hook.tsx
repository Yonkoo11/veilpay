import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrandBar } from "../components/BrandBar";
import { Enter } from "../components/Enter";
import { COLORS, COPY, SCENE_DURATIONS } from "../constants";
import { INTER, MONO } from "../fonts";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [SCENE_DURATIONS.hook - 30, SCENE_DURATIONS.hook], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: exit }}><Backdrop /><BrandBar section={COPY.eyebrow} /><AbsoluteFill style={{ padding: "150px 64px 90px", flexDirection: "row", gap: 54, alignItems: "center" }}>
    <div style={{ flex: 0.9 }}>
      <Enter><div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 2.5, color: COLORS.lime, marginBottom: 24 }}>{COPY.eyebrow}</div></Enter>
      <Enter delay={10}><div style={{ fontFamily: INTER, fontSize: 78, lineHeight: 1.02, fontWeight: 900, color: COLORS.ink }}>{COPY.hookTitle}<br/><span style={{ color: COLORS.lime }}>{COPY.hookAccent}</span></div></Enter>
      <Enter delay={24}><div style={{ fontFamily: INTER, fontSize: 27, lineHeight: 1.45, color: COLORS.inkSoft, marginTop: 34, maxWidth: 720 }}>{COPY.hookBody}</div></Enter>
    </div>
    <Enter delay={18} style={{ flex: 1.1 }}><div style={{ border: `1px solid ${COLORS.borderStrong}`, borderRadius: 22, overflow: "hidden", boxShadow: `0 0 70px ${COLORS.lime}18` }}><Img src={staticFile("assets/payroll-ledger.png")} style={{ width: "100%", display: "block" }}/></div></Enter>
  </AbsoluteFill></AbsoluteFill>;
};
