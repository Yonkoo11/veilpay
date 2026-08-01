import React from "react";
import { COPY, COLORS } from "../constants";
import { INTER, MONO } from "../fonts";

export const BrandBar: React.FC<{ section: string }> = ({ section }) => (
  <div style={{ position: "absolute", top: 44, left: 64, right: 64, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 13, height: 13, borderRadius: "50%", background: COLORS.lime, boxShadow: `0 0 22px ${COLORS.lime}` }} />
      <span style={{ color: COLORS.ink, fontFamily: INTER, fontSize: 22, fontWeight: 900, letterSpacing: 1.5 }}>{COPY.brand}</span>
    </div>
    <span style={{ color: COLORS.muted, fontFamily: MONO, fontSize: 14, letterSpacing: 2 }}>{section}</span>
  </div>
);
