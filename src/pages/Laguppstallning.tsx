import { useState, useEffect, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";
import innebandyplan from "../assets/innebandyplan-liggande.svg";
import { usersAPI } from "../services/apiService";
import { lineupAPI } from "../services/lineupAPI";
// Spara senaste drag-koordinater (mus/touch)
const latestDragCoords = { x: 0, y: 0 };

interface Position {
  x: number;
  y: number;
  playerId: string | null;
}

const initialLineups: Record<string, Position[]> = {
  "1a": [
    { x: 150, y: 100, playerId: null },
    { x: 450, y: 100, playerId: null },
    { x: 300, y: 250, playerId: null },
    { x: 150, y: 400, playerId: null },
    { x: 450, y: 400, playerId: null }
  ],
  "2a": [
    { x: 150, y: 100, playerId: null },
    { x: 450, y: 100, playerId: null },
    { x: 300, y: 250, playerId: null },
    { x: 150, y: 400, playerId: null },
    { x: 450, y: 400, playerId: null }
  ],
  "3e": [
    { x: 150, y: 100, playerId: null },
    { x: 450, y: 100, playerId: null },
    { x: 300, y: 250, playerId: null },
    { x: 150, y: 400, playerId: null },
    { x: 450, y: 400, playerId: null }
  ],
  "boxplay": [
    { x: 300, y: 60, playerId: null },
    { x: 150, y: 180, playerId: null },
    { x: 450, y: 180, playerId: null },
    { x: 200, y: 350, playerId: null },
    { x: 400, y: 350, playerId: null }
  ],
  "powerplay": [
    { x: 300, y: 60, playerId: null },
    { x: 150, y: 180, playerId: null },
    { x: 450, y: 180, playerId: null },
    { x: 200, y: 350, playerId: null },
    { x: 400, y: 350, playerId: null }
  ]
};

const lineupTypes = [
  { key: "1a", label: "1:a femman" },
  { key: "2a", label: "2:a femman" },
  { key: "3e", label: "3:e femman" },
];
const specialTypes = [
  { key: "boxplay", label: "Boxplay" },
  { key: "powerplay", label: "Powerplay" },
];

export default function Laguppstallning() {
  const planRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [lineups, setLineups] = useState<Record<string, Position[]>>(initialLineups);
  const [lineupComments, setLineupComments] = useState<Record<string, string>>({ "1a": "", "2a": "", "3e": "", "boxplay": "", "powerplay": "" });
  const [allPlayers, setAllPlayers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await usersAPI.getAllUsers();
        setAllPlayers(res.data || []);
      } catch (err) {
        setAllPlayers([]);
      }
    }
    fetchPlayers();
  }, []);

  function handleRemove(lineupKey: string, idx: number) {
    const positions = lineups[lineupKey] ?? [];
    const newPositions = positions.map((pos, i) =>
      i === idx ? { ...pos, playerId: null } : pos
    );
    setLineups({ ...lineups, [lineupKey]: newPositions });
  }

  async function handleSave() {
    try {
      await lineupAPI.create({ lineups, comments: lineupComments });
      setSaveStatus("Laguppställning sparad!");
    } catch (err) {
      setSaveStatus("Fel vid sparande av laguppställning");
    }
  }

  function onDragUpdate(update: any) {
    // Spara mus/touch-koordinater
    if (update?.clientOffset) {
      latestDragCoords.x = update.clientOffset.x;
      latestDragCoords.y = update.clientOffset.y;
    }
  }

  function onDragEnd(result: DropResult) {
  const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }

    // Flytta tom position fritt på planen
    if (draggableId.startsWith("pos-") && destination.droppableId.startsWith("plan-")) {
      // Format: draggableId = pos-lineupKey-idx
      const [, lineupKey, idxStr] = draggableId.split("-");
      const posIdx = Number(idxStr);
      if (!lineupKey || isNaN(posIdx)) return;
      const positions = lineups[lineupKey] ?? [];
  if (!positions[posIdx] || positions[posIdx]?.playerId === undefined || positions[posIdx]?.playerId) return;

      // Hämta planens bounding box
      const planDiv = planRefs.current[lineupKey];
      if (!planDiv) return;
      const rect = planDiv.getBoundingClientRect();

      // Beräkna x/y relativt till planens bounding box
      let x = latestDragCoords.x - rect.left;
      let y = latestDragCoords.y - rect.top;
      // Begränsa till planens area
      x = Math.max(0, Math.min(rect.width, x));
      y = Math.max(0, Math.min(rect.height, y));

      // Uppdatera positionens koordinater
      const newPositions = positions.map((pos, i) =>
        i === posIdx ? { ...pos, x, y } : pos
      );
      setLineups({ ...lineups, [lineupKey]: newPositions });
      return;
    }

    // Från tillgängliga spelare till position
    if (source.droppableId === "availablePlayers") {
      const [lineupKey, posIdx] = destination.droppableId.split("-");
      if (!lineupKey || posIdx === undefined) return;
      const positions = lineups[lineupKey] ?? [];
      const posIndex = Number(posIdx);
  if (isNaN(posIndex) || !positions[posIndex]) return;
  if (positions[posIndex]?.playerId) return;
      const newPositions = positions.map((pos: Position, i: number) =>
        i === posIndex ? { ...pos, playerId: draggableId } : pos
      );
      setLineups({ ...lineups, [lineupKey]: newPositions });
      return;
    }

    // Flytta spelare mellan positioner/femmor
    const [srcLineupKey, srcPosIdx] = source.droppableId.split("-");
    const [destLineupKey, destPosIdx] = destination.droppableId.split("-");
    if (!srcLineupKey || srcPosIdx === undefined || !destLineupKey || destPosIdx === undefined) return;
    const srcPositions = lineups[srcLineupKey] ?? [];
    const destPositions = lineups[destLineupKey] ?? [];
    const srcIndex = Number(srcPosIdx);
    const destIndex = Number(destPosIdx);
    if (isNaN(srcIndex) || isNaN(destIndex) || !srcPositions[srcIndex] || !destPositions[destIndex]) return;
  const srcPlayerId = srcPositions[srcIndex]?.playerId;
  const destPlayerId = destPositions[destIndex]?.playerId;
  if (!srcPlayerId) return;
    // Om destinationen är tom, flytta som vanligt
    if (!destPlayerId) {
      const newSrcPositions = srcPositions.map((pos: Position, i: number) =>
        i === srcIndex ? { ...pos, playerId: null } : pos
      );
      const newDestPositions = destPositions.map((pos: Position, i: number) =>
        i === destIndex ? { ...pos, playerId: srcPlayerId } : pos
      );
      setLineups({
        ...lineups,
        [srcLineupKey]: newSrcPositions,
        [destLineupKey]: newDestPositions
      });
      return;
    }
    // Om destinationen har en spelare, byt plats
    const newSrcPositions = srcPositions.map((pos: Position, i: number) =>
      i === srcIndex ? { ...pos, playerId: destPlayerId } : pos
    );
    const newDestPositions = destPositions.map((pos: Position, i: number) =>
      i === destIndex ? { ...pos, playerId: srcPlayerId } : pos
    );
    setLineups({
      ...lineups,
      [srcLineupKey]: newSrcPositions,
      [destLineupKey]: newDestPositions
    });
  }

  function renderPlan(lineupKey: string, positions: Position[], half: boolean = false) {
    return (
      <div
        ref={el => { planRefs.current[lineupKey] = el || null; }}
        id={`plan-${lineupKey}`}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: half ? 400 : 800,
          height: "min(60vw, 500px)",
          minHeight: 260,
          background: `url(${innebandyplan}) center/contain no-repeat`,
          border: "2px solid #22c55e",
          borderRadius: 24,
          margin: "0 auto",
          boxSizing: "border-box",
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Droppable droppableId={`plan-${lineupKey}`} type="plan">
          {(planProvided: any) => (
            <div ref={planProvided.innerRef} {...planProvided.droppableProps} style={{ width: "100%", height: "100%", position: "absolute", left: 0, top: 0 }}>
              {positions.map((pos, idx) => {
                const player = allPlayers.find(p => p.id === pos.playerId);
                return (
                  <Droppable droppableId={`${lineupKey}-${idx}`} key={idx} direction="vertical" type={"position"}>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          position: "absolute",
                          left: `${pos.x}px`,
                          top: `${pos.y}px`,
                          transform: "translate(-50%, -50%)",
                          width: 160,
                          height: 56,
                          background: player ? "#101a10cc" : "#fff8",
                          border: player ? "2px solid #22c55e" : "2px dashed #22c55e",
                          borderRadius: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          color: player ? "#fff" : "#222",
                          fontSize: "1.2rem",
                          boxShadow: player ? "0 2px 12px #22c55e88" : "0 1px 4px #22c55e33",
                          cursor: player ? "pointer" : "grab",
                          transition: "all 0.2s",
                          zIndex: 3
                        }}
                      >
                        {player ? (
                          <Draggable draggableId={player.id} index={0} key={player.id}>
                            {(providedDraggable: any) => (
                              <div
                                ref={providedDraggable.innerRef}
                                {...providedDraggable.draggableProps}
                                {...providedDraggable.dragHandleProps}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "100%",
                                  height: "100%",
                                  ...providedDraggable.draggableProps.style
                                }}
                              >
                                {`${player.name} (${player.id})`}
                                <button onClick={() => handleRemove(lineupKey, idx)} style={{ marginLeft: 8, background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "2px 8px", cursor: "pointer" }}>Ta bort</button>
                              </div>
                            )}
                          </Draggable>
                        ) : (
                          <Draggable draggableId={`pos-${lineupKey}-${idx}`} index={idx} key={`pos-${lineupKey}-${idx}`} isDragDisabled={!!player}>
                            {(providedDraggable: any) => (
                              <div
                                ref={providedDraggable.innerRef}
                                {...providedDraggable.draggableProps}
                                {...providedDraggable.dragHandleProps}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: player ? 0.5 : 1,
                                  ...providedDraggable.draggableProps.style
                                }}
                              >
                                Tom position
                              </div>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
              {planProvided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }

  // --- JSX ---
  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #101a10 60%, #22c55e 100%)",
        padding: "2rem 0",
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif"
      }}>
        <style>{`
          @media (max-width: 700px) {
            .laguppstallning-container {
              padding: 0.5rem;
              border-radius: 0;
              box-shadow: none;
            }
            .laguppstallning-header h1 {
              font-size: 2rem;
            }
            .lineup-section {
              padding: 1rem;
              margin-bottom: 16px;
            }
            .comment-area {
              font-size: 1rem;
              min-height: 48px;
            }
          }
          @media (max-width: 500px) {
            .laguppstallning-header h1 {
              font-size: 1.3rem;
            }
            .lineup-section {
              padding: 0.5rem;
            }
          }
        `}</style>
        <div className="laguppstallning-container" style={{ maxWidth: 900, margin: "0 auto", padding: "2rem", borderRadius: 32, boxShadow: "0 8px 32px #000a", background: "rgba(20,32,20,0.85)", backdropFilter: "blur(8px)", border: "2px solid #22c55e" }}>
          <div className="laguppstallning-header" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem" }}>
            <h1 style={{ color: "#22c55e", fontWeight: 900, fontSize: "2.8rem", letterSpacing: "2px", textShadow: "0 2px 12px #000" }}>Laguppställningar</h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <button onClick={handleSave} style={{ alignSelf: "flex-end", marginBottom: 16, background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: "1.1rem", border: "none", borderRadius: 12, padding: "0.7rem 2rem", cursor: "pointer", boxShadow: "0 2px 8px #22c55e55" }}>
              Spara laguppställning
            </button>
            {saveStatus && <div style={{ color: saveStatus.includes("Fel") ? "#ef4444" : "#22c55e", fontWeight: 700, marginBottom: 16 }}>{saveStatus}</div>}
            {[...lineupTypes, ...specialTypes].map(({ key: lineupKey, label }) => (
              <div key={lineupKey} className="lineup-section" style={{ width: "100%", background: "rgba(255,255,255,0.08)", borderRadius: 24, boxShadow: "0 2px 16px #22c55e33", padding: "2rem", marginBottom: 32 }}>
                <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.3rem", margin: "1rem 0" }}>{label}</h2>
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor={`comment-${lineupKey}`} style={{ display: "block", fontWeight: 700, color: "#22c55e", marginBottom: 6, fontSize: "1.08rem" }}>
                    Kommentar / fokus för {label}
                  </label>
                  <textarea
                    id={`comment-${lineupKey}`}
                    className="comment-area"
                    value={lineupComments[lineupKey]}
                    onChange={e => setLineupComments(c => ({ ...c, [lineupKey]: e.target.value }))}
                    placeholder={label + " kommentar/fokus..."}
                    style={{
                      width: "100%",
                      minHeight: 64,
                      maxHeight: 180,
                      padding: "0.8rem 1rem",
                      borderRadius: 12,
                      fontSize: "1.08rem",
                      background: "#101a10",
                      color: "#22c55e",
                      border: "2px solid #22c55e",
                      boxShadow: "0 2px 8px #22c55e22",
                      resize: "vertical",
                      outline: "none",
                      fontFamily: "inherit",
                      transition: "border 0.2s"
                    }}
                  />
                  <span style={{ color: "#888", fontSize: "0.95rem", marginTop: 4, display: "block" }}>
                    Skriv en kommentar om femmans fokus, taktik eller viktiga punkter.
                  </span>
                </div>
                {renderPlan(lineupKey, lineups[lineupKey] ?? [], false)}
              </div>
            ))}
            <Droppable droppableId="availablePlayers" direction="horizontal">
              {(provided: any) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ width: "100%", background: "rgba(255,255,255,0.08)", borderRadius: 24, boxShadow: "0 2px 16px #22c55e33", padding: "2rem", marginBottom: 32, minHeight: 80, display: "flex", flexWrap: "wrap", gap: 8 }}
                >
                  <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.2rem", margin: "1rem 0", width: "100%" }}>Tillgängliga spelare</h2>
                  {allPlayers.filter(p => !Object.values(lineups).flat().map(pos => pos.playerId).includes(p.id)).map((p, idx) => (
                    <Draggable draggableId={p.id} index={idx} key={p.id}>
                      {(providedDraggable: any) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                          style={{
                            background: "#101a10cc",
                            color: "#fff",
                            borderRadius: 8,
                            padding: "0.5rem 1rem",
                            fontWeight: 700,
                            fontSize: "1rem",
                            border: "2px solid #22c55e",
                            cursor: "grab",
                            marginBottom: 8,
                            ...providedDraggable.draggableProps.style
                          }}
                        >
                          {p.name} ({p.id})
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
