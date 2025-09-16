import React from "react";
import { Marker } from "../types/whiteboardTypes";

interface WhiteboardMarkersProps {
  markers: Marker[];
  tool: string;
  setMovingMarker: (i: number) => void;
  setIsDraggingMarker: (v: boolean) => void;
}

const WhiteboardMarkers: React.FC<WhiteboardMarkersProps> = ({ markers, tool, setMovingMarker, setIsDraggingMarker }) => {
  return (
    <>
      {markers.map((m, i) => {
        let bg = "#222";
        let label = "";
        let color = "#fff";
        let size = 36;
        if (m.type === "player") {
          bg = "#2E7D32"; label = "S"; color = "#fff";
        } else if (m.type === "opponent") {
          bg = "#e53935"; label = "M"; color = "#fff";
        } else if (m.type === "ball") {
          bg = "#111"; label = "B"; color = "#fff"; size = 24;
        }
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.x-size/2,
              top: m.y-size/2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
              fontWeight: 900,
              fontSize: m.type === "ball" ? "0.95rem" : "1.15rem",
              zIndex: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              cursor: tool === "hand" ? "grab" : "default",
              border: m.type === "ball" ? "2px solid #fff" : "none",
              userSelect: "none"
            }}
            onPointerDown={e => {
              if (tool === "hand") {
                setMovingMarker(i);
                setIsDraggingMarker(true);
                e.stopPropagation();
              }
            }}
          >
            {label}
          </div>
        );
      })}
    </>
  );
};

export default WhiteboardMarkers;
