import { ImageResponse } from "next/og";

type OgImageInput = Readonly<{
  title: string;
  subtitle?: string;
  badge?: string;
}>;

export const ogSize = { width: 1200, height: 630 };

export function renderOgImage({ title, subtitle, badge }: OgImageInput) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(145deg, #0f1419 0%, #1a2332 55%, #0d3d38 100%)",
          color: "#f4f7fb",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "999px",
              background: "#5eead4",
            }}
          />
          <span
            style={{ fontSize: 28, color: "#94a3b8", letterSpacing: "0.08em" }}
          >
            COUNTRIES TIME
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {badge ? (
            <span
              style={{
                fontSize: 24,
                color: "#5eead4",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {badge}
            </span>
          ) : null}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: "980px",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 32,
                color: "#cbd5e1",
                maxWidth: "900px",
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    ),
    ogSize,
  );
}
