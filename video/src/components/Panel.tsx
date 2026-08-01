import React from "react";
import { COLORS } from "../constants";

export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; accent?: string }> = ({ children, style, accent }) => (
  <div style={{ background: COLORS.panel, border: `1px solid ${accent ?? COLORS.border}`, borderRadius: 20, boxShadow: "0 30px 80px rgba(0,0,0,.28)", ...style }}>
    {children}
  </div>
);
