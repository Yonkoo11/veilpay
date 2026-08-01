import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Enter } from "../components/Enter";
import { COLORS, COPY, SCENE_DURATIONS } from "../constants";
import { INTER, MONO } from "../fonts";

export const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [SCENE_DURATIONS.close - 60, SCENE_DURATIONS.close], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: fade }}><Backdrop/><AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: 90 }}>
    <Enter><div style={{ fontFamily: INTER, fontSize: 100, lineHeight: 1.02, fontWeight: 900, color: COLORS.ink }}>{COPY.closeTitle}<br/><span style={{ color: COLORS.lime }}>{COPY.closeAccent}</span></div></Enter>
    <Enter delay={22}><div style={{ fontFamily: MONO, fontSize: 25, color: COLORS.ink, marginTop: 48 }}>{COPY.liveUrl}</div></Enter>
    <Enter delay={36}><div style={{ fontFamily: MONO, fontSize: 19, color: COLORS.inkSoft, marginTop: 18 }}>{COPY.repo}</div></Enter>
    <Enter delay={52}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 2.5, color: COLORS.amber, marginTop: 48 }}>{COPY.closeMeta}</div></Enter>
  </AbsoluteFill></AbsoluteFill>;
};
