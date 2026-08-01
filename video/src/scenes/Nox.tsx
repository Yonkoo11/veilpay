import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrandBar } from "../components/BrandBar";
import { Enter } from "../components/Enter";
import { Panel } from "../components/Panel";
import { COLORS, COPY } from "../constants";
import { INTER, MONO } from "../fonts";

export const Nox: React.FC = () => <AbsoluteFill><Backdrop/><BrandBar section="02 · NOX INTEGRATION"/><AbsoluteFill style={{ padding: "145px 72px 90px", justifyContent: "center" }}>
  <Enter><div style={{ fontFamily: INTER, fontSize: 64, fontWeight: 900, color: COLORS.ink, textAlign: "center" }}>{COPY.noxTitle}</div></Enter>
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 64 }}>
    {COPY.noxSteps.map((step, index) => <React.Fragment key={step.label}><Enter delay={18 + index * 22} style={{ flex: 1 }}><Panel accent={index === 1 ? COLORS.borderStrong : COLORS.border} style={{ padding: "28px 22px", minHeight: 176 }}><div style={{ fontFamily: MONO, color: index === 1 ? COLORS.lime : COLORS.amber, fontSize: 14, letterSpacing: 2, fontWeight: 700 }}>{step.label}</div><div style={{ fontFamily: INTER, color: COLORS.ink, fontSize: 24, lineHeight: 1.3, fontWeight: 700, marginTop: 24 }}>{step.value}</div></Panel></Enter>{index < COPY.noxSteps.length - 1 && <Enter delay={34 + index * 22}><div style={{ fontFamily: MONO, color: COLORS.lime, fontSize: 32 }}>→</div></Enter>}</React.Fragment>)}
  </div>
  <Enter delay={110}><div style={{ marginTop: 48, fontFamily: MONO, fontSize: 21, color: COLORS.lime, textAlign: "center", letterSpacing: 1.2 }}>{COPY.noxFooter}</div></Enter>
</AbsoluteFill></AbsoluteFill>;
