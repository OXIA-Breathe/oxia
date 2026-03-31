import { AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Nunito";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const Scene2Breathe = () => {
  const frame = useCurrentFrame();

  // Phone mockup slide in
  const phoneX = interpolate(frame, [0, 40], [200, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const phoneOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Text elements
  const titleOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const titleY = interpolate(frame, [20, 45], [20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const subtitleOpacity = interpolate(frame, [45, 70], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subtitleY = interpolate(frame, [45, 70], [20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Subtle breathing pulse on the phone
  const phonePulse = interpolate(
    Math.sin(frame / 35 * Math.PI),
    [-1, 1],
    [0.98, 1.02]
  );

  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 120 }}>
      {/* Left: Text */}
      <div style={{ maxWidth: 550, fontFamily }}>
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: "#2a4a7f",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            lineHeight: 1.2,
          }}
        >
          Guided breathing,
          <br />
          made simple
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#5b7ba8",
            marginTop: 24,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            lineHeight: 1.6,
          }}
        >
          10+ techniques with voice guidance.
          <br />
          Just press play and breathe.
        </div>
      </div>

      {/* Right: Phone mockup */}
      <div
        style={{
          opacity: phoneOpacity,
          transform: `translateX(${phoneX}px) scale(${phonePulse})`,
          filter: "drop-shadow(0 20px 40px rgba(42,74,127,0.2))",
        }}
      >
        <div style={{
          width: 320,
          height: 640,
          borderRadius: 36,
          overflow: "hidden",
          border: "4px solid rgba(255,255,255,0.6)",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
        }}>
          <Img
            src={staticFile("images/screenshot-home.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
