import { AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Nunito";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const Scene3Features = () => {
  const frame = useCurrentFrame();

  const features = [
    { label: "Track your progress", delay: 10 },
    { label: "Understand your emotions", delay: 35 },
    { label: "AI wellness insights", delay: 60 },
  ];

  // Phone slides
  const phone1Opacity = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const phone1Y = interpolate(frame, [5, 30], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const phone2Opacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const phone2Y = interpolate(frame, [30, 55], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 80 }}>
      {/* Two phone mockups */}
      <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
        <div style={{
          opacity: phone1Opacity,
          transform: `translateY(${phone1Y}px)`,
          filter: "drop-shadow(0 15px 30px rgba(42,74,127,0.15))",
        }}>
          <div style={{
            width: 260,
            height: 520,
            borderRadius: 30,
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.6)",
          }}>
            <Img
              src={staticFile("images/screenshot-progress.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
        <div style={{
          opacity: phone2Opacity,
          transform: `translateY(${phone2Y}px)`,
          filter: "drop-shadow(0 15px 30px rgba(42,74,127,0.15))",
        }}>
          <div style={{
            width: 260,
            height: 520,
            borderRadius: 30,
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.6)",
          }}>
            <Img
              src={staticFile("images/screenshot-mood.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {/* Feature labels */}
      <div style={{ fontFamily, maxWidth: 420 }}>
        {features.map((feat, i) => {
          const opacity = interpolate(frame, [feat.delay, feat.delay + 25], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const x = interpolate(frame, [feat.delay, feat.delay + 25], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <div
              key={i}
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: "#2a4a7f",
                opacity,
                transform: `translateX(${x}px)`,
                marginBottom: 28,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#77A9E8",
                flexShrink: 0,
              }} />
              {feat.label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
