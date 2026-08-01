import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrandBar } from "../components/BrandBar";
import { Enter } from "../components/Enter";
import { Panel } from "../components/Panel";
import { COLORS, COPY } from "../constants";
import { INTER, MONO } from "../fonts";

export const Sepolia: React.FC = () => <AbsoluteFill><Backdrop/><BrandBar section="03 · ETHEREUM SEPOLIA"/><AbsoluteFill style={{ padding: "140px 82px 90px", justifyContent: "center" }}>
  <Enter><div style={{ fontFamily: INTER, fontSize: 61, fontWeight: 900, color: COLORS.ink }}>{COPY.sepoliaTitle}</div></Enter>
  <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 24, marginTop: 42 }}>
    <Enter delay={16}><Panel accent={COLORS.borderStrong} style={{ padding: 30, height: 178 }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: COLORS.lime }}>{COPY.contractLabel}</div><div style={{ fontFamily: MONO, fontSize: 23, color: COLORS.ink, marginTop: 30, wordBreak: "break-all" }}>{COPY.contract}</div></Panel></Enter>
    <Enter delay={30}><Panel style={{ padding: 30, height: 178 }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: COLORS.amber }}>{COPY.privateProof}</div><div style={{ fontFamily: INTER, fontSize: 36, color: COLORS.ink, fontWeight: 850, marginTop: 25 }}>{COPY.privateValues}</div></Panel></Enter>
    <Enter delay={46}><Panel style={{ padding: 28 }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: COLORS.inkSoft }}>{COPY.batchLabel}</div><div style={{ fontFamily: MONO, fontSize: 24, color: COLORS.lime, marginTop: 18 }}>{COPY.batchTx}</div></Panel></Enter>
    <Enter delay={62}><Panel style={{ padding: 28 }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: COLORS.inkSoft }}>{COPY.publishLabel}</div><div style={{ fontFamily: MONO, fontSize: 24, color: COLORS.lime, marginTop: 18 }}>{COPY.publishTx}</div></Panel></Enter>
  </div>
</AbsoluteFill></AbsoluteFill>;
