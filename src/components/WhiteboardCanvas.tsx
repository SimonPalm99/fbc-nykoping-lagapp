import React from "react";

interface WhiteboardCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isMobile: boolean;
  handlePointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerUp: () => void;
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  canvasRef,
  isMobile,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp
}) => (
  <canvas
    ref={canvasRef}
    width={isMobile ? window.innerWidth : 1100}
    height={isMobile ? window.innerWidth * 0.6 : 650}
    style={{ position: "absolute", left: 0, top: 0, zIndex: 1, touchAction: "none" }}
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={handlePointerUp}
  />
);

export default WhiteboardCanvas;
