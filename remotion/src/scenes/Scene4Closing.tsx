import { AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Nunito";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const Scene4Closing = () => {
  const frame = useCurrentFrame();

  // Logo fade in
  const logoOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const logoScale = interpolate(frame, [10, 40], [0.9, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Tagline
  const tagOpacity = interpolate(frame, [45, 70], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const tagY = interpolate(frame, [45, 70], [15, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Subtitle
  const subOpacity = interpolate(frame, [70, 95], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Breathing circle behind logo
  const breathScale = interpolate(
    Math.sin(frame / 40 * Math.PI),
    [-1, 1],
    [0.9, 1.1]
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Breathing glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(119,169,232,0.25) 0%, transparent 70%)",
          transform: `scale(${breathScale})`,
        }}
      />

      {/* Logo */}
      <div style={{
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
        marginBottom: 30,
      }}>
        <Img
          src={staticFile("images/oxia-logo-dark.png")}
          style={{ height: 80, objectFit: "contain" }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily,
          fontSize: 36,
          fontWeight: 700,
          color: "#2a4a7f",
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          textAlign: "center",
        }}
      >
        Breathe with awareness
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontFamily,
          fontSize: 22,
          fontWeight: 400,
          color: "#5b7ba8",
          opacity: subOpacity,
          marginTop: 16,
          textAlign: "center",
        }}
      >
        Your calm companion for better breathing
      </div>
    </AbsoluteFill>
  );
};
