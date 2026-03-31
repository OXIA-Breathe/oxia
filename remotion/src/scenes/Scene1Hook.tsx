import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Nunito";

const { fontFamily } = loadFont("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const Scene1Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Breathing circle animation
  const breathScale = interpolate(
    Math.sin(frame / 30 * Math.PI),
    [-1, 1],
    [0.85, 1.15]
  );

  // Text reveals
  const line1Opacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const line1Y = interpolate(frame, [20, 50], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const line2Opacity = interpolate(frame, [55, 85], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const line2Y = interpolate(frame, [55, 85], [25, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Circle fade in
  const circleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Breathing circle behind text */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "linear-gradient(145deg, rgba(224,237,245,0.6) 0%, rgba(119,169,232,0.4) 100%)",
          boxShadow: "0 0 80px rgba(119,169,232,0.3), inset 0 0 40px rgba(255,255,255,0.2)",
          transform: `scale(${breathScale})`,
          opacity: circleOpacity,
        }}
      />

      {/* Text */}
      <div style={{ textAlign: "center", zIndex: 1, fontFamily }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#2a4a7f",
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
            letterSpacing: "-0.5px",
          }}
        >
          Your breath is your
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#2a4a7f",
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
            letterSpacing: "-0.5px",
            marginTop: 8,
          }}
        >
          most powerful tool
        </div>
      </div>
    </AbsoluteFill>
  );
};
