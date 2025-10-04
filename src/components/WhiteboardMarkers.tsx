import React from "react";
import { Marker } from "../types/whiteboardTypes";
import styles from "./WhiteboardMarkers.module.css";

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
        let label = "";
        let size = 36;
        let markerClass = styles.marker;
        if (m.type === "player") {
          label = "S";
          markerClass += ` ${styles["marker-player"]}`;
        } else if (m.type === "opponent") {
          label = "M";
          markerClass += ` ${styles["marker-opponent"]}`;
        } else if (m.type === "ball") {
          label = "B";
          size = 24;
          markerClass += ` ${styles["marker-ball"]}`;
        }
        markerClass += ` ${tool === "hand" ? styles["marker-grab"] : styles["marker-default"]}`;
        return (
          <div
            key={i}
            className={markerClass}
            data-left={m.x - size / 2}
            data-top={m.y - size / 2}
            data-size={size}
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
