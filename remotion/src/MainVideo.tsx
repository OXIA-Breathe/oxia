import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Breathe } from "./scenes/Scene2Breathe";
import { Scene3Features } from "./scenes/Scene3Features";
import { Scene4Closing } from "./scenes/Scene4Closing";

export const MainVideo = () => {
  const frame = useCurrentFrame();

  // Persistent gentle breathing background gradient
  const breathCycle = Math.sin(frame / 60) * 0.5 + 0.5;
  const bgLight = interpolate(breathCycle, [0, 1], [92, 97]);
  const bgSat = interpolate(breathCycle, [0, 1], [65, 75]);

  return (
    <AbsoluteFill>
      {/* Living breathing background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, hsl(217, ${bgSat}%, ${bgLight}%) 0%, hsl(217, 50%, 85%) 60%, hsl(220, 30%, 95%) 100%)`,
        }}
      />

      {/* Floating organic shapes */}
      <FloatingOrbs frame={frame} />

      {/* Scenes */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={165}>
          <Scene1Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 25 })}
        />
        <TransitionSeries.Sequence durationInFrames={165}>
          <Scene2Breathe />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 25 })}
        />
        <TransitionSeries.Sequence durationInFrames={165}>
          <Scene3Features />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 25 })}
        />
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene4Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const FloatingOrbs = ({ frame }: { frame: number }) => {
  const orbs = [
    { x: 15, y: 20, size: 300, speed: 0.008, phase: 0 },
    { x: 75, y: 70, size: 250, speed: 0.006, phase: 2 },
    { x: 50, y: 40, size: 400, speed: 0.004, phase: 4 },
    { x: 85, y: 15, size: 200, speed: 0.01, phase: 1 },
  ];

  return (
    <AbsoluteFill style={{ opacity: 0.3 }}>
      {orbs.map((orb, i) => {
        const offsetX = Math.sin(frame * orb.speed + orb.phase) * 40;
        const offsetY = Math.cos(frame * orb.speed + orb.phase * 0.7) * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(119,169,232,0.4) 0%, transparent 70%)",
              transform: `translate(${offsetX}px, ${offsetY}px)`,
              filter: "blur(40px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
