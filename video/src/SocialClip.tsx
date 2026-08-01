import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { Enter } from "./components/Enter";
import { COLORS, COPY, SOCIAL_DURATION } from "./constants";
import { INTER, MONO } from "./fonts";

export const SocialClip: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [SOCIAL_DURATION - 20, SOCIAL_DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: exit }}><Backdrop/><AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "100px 70px", textAlign: "center" }}>
    <Enter><div style={{ fontFamily: INTER, fontSize: 140, fontWeight: 900, color: COLORS.lime }}>{COPY.socialStat}</div></Enter>
    <Enter delay={15}><div style={{ fontFamily: MONO, fontSize: 27, letterSpacing: 4, color: COLORS.inkSoft, marginTop: 10 }}>{COPY.socialLabel}</div></Enter>
    <Enter delay={34}><div style={{ width: 76, height: 4, borderRadius: 8, background: COLORS.lime, marginTop: 76 }}/></Enter>
    <Enter delay={48}><div style={{ fontFamily: INTER, fontSize: 58, lineHeight: 1.16, fontWeight: 850, color: COLORS.ink, marginTop: 70 }}>{COPY.socialQuestion}</div></Enter>
    <Enter delay={72}><div style={{ fontFamily: INTER, fontSize: 50, fontWeight: 900, color: COLORS.ink, marginTop: 92 }}>{COPY.brand}</div></Enter>
    <Enter delay={88}><div style={{ fontFamily: MONO, fontSize: 22, color: COLORS.amber, marginTop: 22 }}>{COPY.closeMeta}</div></Enter>
  </AbsoluteFill></AbsoluteFill>;
};
