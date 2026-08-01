import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrandBar } from "../components/BrandBar";
import { Enter } from "../components/Enter";
import { COLORS, COPY } from "../constants";
import { INTER, MONO } from "../fonts";

export const PublicResult: React.FC = () => <AbsoluteFill><Backdrop/><BrandBar section="04 · PUBLIC ACCOUNTABILITY"/><AbsoluteFill style={{ padding: "130px 72px 70px", flexDirection: "row", alignItems: "center", gap: 54 }}>
  <div style={{ flex: 0.72 }}><Enter><div style={{ fontFamily: MONO, fontSize: 15, color: COLORS.lime, letterSpacing: 2.5 }}>{COPY.publicKicker}</div></Enter><Enter delay={10}><div style={{ fontFamily: INTER, fontSize: 59, lineHeight: 1.08, fontWeight: 900, color: COLORS.ink, marginTop: 24 }}>{COPY.publicTitle}</div></Enter><Enter delay={24}><div style={{ fontFamily: INTER, fontSize: 25, lineHeight: 1.45, color: COLORS.inkSoft, marginTop: 28 }}>{COPY.publicBody}</div></Enter></div>
  <Enter delay={18} style={{ flex: 1.28 }}><div style={{ border: `1px solid ${COLORS.borderStrong}`, borderRadius: 22, overflow: "hidden", boxShadow: `0 0 80px ${COLORS.lime}18` }}><Img src={staticFile("assets/public-aggregate.png")} style={{ width: "100%", display: "block" }}/></div></Enter>
</AbsoluteFill></AbsoluteFill>;
