import { ImageResponse } from "next/og";

export const alt = "Ullalu — visual travel planning built around time";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f7fb",
          color: "#152238",
          padding: "64px 72px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: 18,
              background: "#ffffff",
              border: "1px solid #d9e1ec",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 40,
                height: 44,
                borderLeft: "7px solid #152238",
                borderRight: "7px solid #152238",
                borderBottom: "7px solid #152238",
                borderRadius: "0 0 22px 22px",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", width: 12, height: 12, borderRadius: 999, background: "#2563eb", left: -10, top: -4 }} />
              <div style={{ position: "absolute", width: 12, height: 12, borderRadius: 999, background: "#be185d", right: -10, top: -4 }} />
            </div>
          </div>
          <div style={{ fontSize: 48, fontWeight: 750, letterSpacing: "-2px" }}>ullalu</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 930 }}>
          <div style={{ fontSize: 74, lineHeight: 1.04, fontWeight: 760, letterSpacing: "-3.6px" }}>
            Plan travel in time,
            <br />
            not just places.
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#667085", maxWidth: 920 }}>
            See travel, activities, reservations, free time, buffers and rest as one realistic day.
          </div>
        </div>

        <div style={{ display: "flex", height: 20, width: "100%", gap: 8 }}>
          <div style={{ flex: 1.4, borderRadius: 999, background: "#93c5fd" }} />
          <div style={{ flex: 1.0, borderRadius: 999, background: "#86efac" }} />
          <div style={{ flex: 0.65, borderRadius: 999, background: "#fde68a" }} />
          <div style={{ flex: 0.38, borderRadius: 999, background: "#93c5fd" }} />
          <div style={{ flex: 0.7, borderRadius: 999, background: "#f9a8d4" }} />
          <div style={{ flex: 1.05, borderRadius: 999, background: "#c4b5fd" }} />
        </div>
      </div>
    ),
    size,
  );
}
