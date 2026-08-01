import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrandBar } from "../components/BrandBar";
import { Enter } from "../components/Enter";
import { Panel } from "../components/Panel";
import { COLORS, COPY } from "../constants";
import { INTER, MONO } from "../fonts";

export const Privacy: React.FC = () => <AbsoluteFill><Backdrop/><BrandBar section="01 · PRIVACY BOUNDARY"/><AbsoluteFill style={{ padding: "150px 90px 100px", justifyContent: "center" }}>
  <Enter><div style={{ fontFamily: INTER, fontSize: 68, fontWeight: 900, color: COLORS.ink }}>{COPY.privacyTitle}</div></Enter>
  <Enter delay={10}><div style={{ fontFamily: INTER, fontSize: 26, color: COLORS.inkSoft, marginTop: 18 }}>{COPY.privacyBody}</div></Enter>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, marginTop: 54 }}>
    {COPY.privacyCards.map((card, index) => { const tone = card.tone === "lime" ? COLORS.lime : card.tone === "amber" ? COLORS.amber : COLORS.inkSoft; return <Enter key={card.label} delay={24 + index * 14}><Panel accent={`${tone}66`} style={{ minHeight: 210, padding: 30 }}><div style={{ fontFamily: MONO, color: tone, fontSize: 15, letterSpacing: 2.5, fontWeight: 700 }}>{card.label}</div><div style={{ fontFamily: INTER, color: COLORS.ink, fontSize: 26, lineHeight: 1.35, fontWeight: 650, marginTop: 28 }}>{card.value}</div></Panel></Enter>; })}
  </div>
</AbsoluteFill></AbsoluteFill>;
