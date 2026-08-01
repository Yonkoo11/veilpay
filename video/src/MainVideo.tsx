import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { CROSSFADE, SCENE_DURATIONS } from "./constants";
import { Hook } from "./scenes/Hook";
import { Privacy } from "./scenes/Privacy";
import { Nox } from "./scenes/Nox";
import { Sepolia } from "./scenes/Sepolia";
import { PublicResult } from "./scenes/PublicResult";
import { Engineering } from "./scenes/Engineering";
import { Close } from "./scenes/Close";
import { Subtitles } from "./Subtitles";

const scenes = [
  { key: "hook", duration: SCENE_DURATIONS.hook, component: Hook },
  { key: "privacy", duration: SCENE_DURATIONS.privacy, component: Privacy },
  { key: "nox", duration: SCENE_DURATIONS.nox, component: Nox },
  { key: "sepolia", duration: SCENE_DURATIONS.sepolia, component: Sepolia },
  { key: "public", duration: SCENE_DURATIONS.publicResult, component: PublicResult },
  { key: "engineering", duration: SCENE_DURATIONS.engineering, component: Engineering },
  { key: "close", duration: SCENE_DURATIONS.close, component: Close },
] as const;

export const MainVideo: React.FC = () => <AbsoluteFill>
  <TransitionSeries>
    {scenes.flatMap((scene, index) => {
      const Scene = scene.component;
      const nodes: React.ReactNode[] = [<TransitionSeries.Sequence key={scene.key} durationInFrames={scene.duration}><Scene/></TransitionSeries.Sequence>];
      if (index < scenes.length - 1) nodes.push(<TransitionSeries.Transition key={`${scene.key}-transition`} presentation={fade()} timing={linearTiming({ durationInFrames: CROSSFADE })}/>);
      return nodes;
    })}
  </TransitionSeries>
  <Audio src={staticFile("audio/narration.mp3")} volume={1}/>
  <Subtitles/>
</AbsoluteFill>;
