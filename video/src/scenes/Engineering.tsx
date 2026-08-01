import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrandBar } from "../components/BrandBar";
import { Enter } from "../components/Enter";
import { Panel } from "../components/Panel";
import { COLORS, COPY } from "../constants";
import { INTER, MONO } from "../fonts";

export const Engineering: React.FC = () => <AbsoluteFill><Backdrop/><BrandBar section="05 · ENGINEERING EVIDENCE"/><AbsoluteFill style={{ padding: "150px 82px 90px", justifyContent: "center" }}>
  <Enter><div style={{ fontFamily: INTER, fontSize: 70, fontWeight: 900, color: COLORS.ink, textAlign: "center" }}>{COPY.engineeringTitle}</div></Enter>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 52 }}>
    {COPY.engineeringStats.map((stat, index) => <Enter key={stat.label} delay={18 + index * 18}><Panel accent={index < 2 ? COLORS.borderStrong : COLORS.border} style={{ minHeight: 250, padding: 30, textAlign: "center" }}><div style={{ fontFamily: INTER, fontSize: 54, fontWeight: 900, color: index < 2 ? COLORS.lime : COLORS.ink }}>{stat.value}</div><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: COLORS.amber, marginTop: 16 }}>{stat.label}</div><div style={{ fontFamily: INTER, fontSize: 20, lineHeight: 1.4, color: COLORS.inkSoft, marginTop: 24 }}>{stat.detail}</div></Panel></Enter>)}
  </div>
  <Enter delay={84}><div style={{ textAlign: "center", marginTop: 38, fontFamily: MONO, fontSize: 18, color: COLORS.inkSoft }}>{COPY.repo}</div></Enter>
</AbsoluteFill></AbsoluteFill>;
