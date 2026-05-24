import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1419",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "999px",
            background: "#5eead4",
            boxShadow: "0 0 0 6px rgba(94, 234, 212, 0.18)",
          }}
        />
      </div>
    ),
    size,
  );
}
