import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Enter: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  const opacity = interpolate(progress, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(progress, [0, 1], [24, 0]);
  const scale = interpolate(progress, [0, 1], [0.96, 1]);
  return <div style={{ opacity, transform: `translateY(${y}px) scale(${scale})`, ...style }}>{children}</div>;
};
