import { useState, useEffect, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";
import innebandyplan from "../assets/innebandyplan-liggande.svg";
import css from "./Laguppstallning.module.css";
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

  // Set CSS variables for position absolutely via JavaScript (since pure CSS can't read data attributes into variables)
  useEffect(() => {
    Object.entries(lineups).forEach(([_, positions]) => {
      positions.forEach((pos, idx) => {
        const el = document.querySelector(
          `[data-pos-x][data-pos-y][data-draggable-index="${idx}"]`
        ) as HTMLElement | null;
        if (el) {
          el.style.setProperty("--pos-x", `${pos.x}px`);
          el.style.setProperty("--pos-y", `${pos.y}px`);
        }
      });
    });
  }, [lineups]);

  function renderPlan(lineupKey: string, positions: Position[]) {
    return (
      <div
        ref={el => { planRefs.current[lineupKey] = el || null; }}
        className={css.planContainer}
      >
        <img src={innebandyplan} alt="Innebandyplan" className={css.planImg} />
        <Droppable droppableId={`plan-${lineupKey}`} type="plan">
          {(planProvided: any) => (
            <div
              ref={planProvided.innerRef}
              {...planProvided.droppableProps}
              className={css.positionsLayer}
            >
              {positions.map((pos, idx) => {
                const player = allPlayers.find(p => p.id === pos.playerId);
                return (
                  <Droppable droppableId={`${lineupKey}-${idx}`} key={idx} direction="vertical" type={"position"}>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={player ? `${css.positionDroppable} ${css.player}` : css.positionDroppable}
                        data-pos-x={pos.x}
                        data-pos-y={pos.y}
                        data-draggable-index={idx}
                      >
                        {player ? (
                          <Draggable draggableId={player.id} index={0} key={player.id}>
                            {(providedDraggable: any) => (
                              <div
                                ref={providedDraggable.innerRef}
                                {...providedDraggable.draggableProps}
                                {...providedDraggable.dragHandleProps}
                                className={`${css.playerContent} ${css.playerDraggableContent}`}
                                data-draggable-index={idx}
                              >
                                {`${player.name} (${player.id})`}
                                <button onClick={() => handleRemove(lineupKey, idx)} className={css.removeBtn}>Ta bort</button>
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
                                className={`${css.playerContent} ${player ? css.playerContentDisabled : ""} ${css.draggablePosition}`}
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
      <div className={css.root}>
        <div className={css.container}>
          <div className={css.header}>
            <h1 className={css.heading}>Laguppställningar</h1>
          </div>
          <div className={css.flexColumn}>
            <button onClick={handleSave} className={css.saveBtn}>
              Spara laguppställning
            </button>
            {saveStatus && (
              <div className={saveStatus.includes("Fel") ? `${css.saveStatus} ${css.error}` : `${css.saveStatus} ${css.success}`}>{saveStatus}</div>
            )}
            {[...lineupTypes, ...specialTypes].map(({ key: lineupKey, label }) => (
              <div key={lineupKey} className={css.lineupSection}>
                <h2 className={css.lineupLabel}>{label}</h2>
                <div className={css.commentContainer}>
                  <label htmlFor={`comment-${lineupKey}`} className={css.commentLabel}>
                    Kommentar / fokus för {label}
                  </label>
                  <textarea
                    id={`comment-${lineupKey}`}
                    className={css.commentArea}
                    value={lineupComments[lineupKey]}
                    onChange={e => setLineupComments(c => ({ ...c, [lineupKey]: e.target.value }))}
                    placeholder={label + " kommentar/fokus..."}
                  />
                  <span className={css.commentHelp}>
                    Skriv en kommentar om femmans fokus, taktik eller viktiga punkter.
                  </span>
                </div>
                {renderPlan(lineupKey, lineups[lineupKey] ?? [])}
              </div>
            ))}
            <Droppable droppableId="availablePlayers" direction="horizontal">
              {(provided: any) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={css.availablePlayers}
                >
                  <h2 className={css.availableLabel}>Tillgängliga spelare</h2>
                  {allPlayers.filter(p => !Object.values(lineups).flat().map(pos => pos.playerId).includes(p.id)).map((p, idx) => (
                    <Draggable draggableId={p.id} index={idx} key={p.id}>
                      {(providedDraggable: any) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                          className={css.playerDraggable}
                          data-draggable-index={idx}
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
