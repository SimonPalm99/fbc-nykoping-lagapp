import React, { useRef, useState, useEffect } from "react";
import { tacticsAPI } from "../services/apiService";
import { useWhiteboardCanvas } from "../hooks/useWhiteboardCanvas";
import { ExerciseStep } from "../types/whiteboardTypes";
import WhiteboardCanvas from "../components/WhiteboardCanvas";
import WhiteboardToolbar from "../components/WhiteboardToolbar";
import WhiteboardMarkers from "../components/WhiteboardMarkers";
import innebandyplan from "../assets/innebandyplan-liggande.svg";
import styles from "./Whiteboard.module.css";

// Verktygstyper
const TOOLS = [
  { key: "hand", label: "Hand" },
  { key: "pen", label: "Penna" },
  { key: "eraser", label: "Sudd" },
  { key: "line", label: "Linje" },
  { key: "text", label: "Textruta" }
];

const MARKERS = [
  { key: "player", label: "Spelare", color: "#2E7D32" },
  { key: "opponent", label: "Motståndare", color: "#e53935" },
  { key: "ball", label: "Boll", color: "#FFB300" }
];

const COLORS = [
  { key: "#222", label: "Svart" },
  { key: "#2E7D32", label: "Grön" },
  { key: "#e53935", label: "Röd" },
  { key: "#1976d2", label: "Blå" },
  { key: "#FFB300", label: "Gul" }
];

const Whiteboard: React.FC = () => {
  const [renameValue, setRenameValue] = useState<string>("");
  const handleDelete = () => {
    if (!whiteboardId) return;
    if (window.confirm("Vill du verkligen ta bort denna whiteboard?")) {
      tacticsAPI.delete(whiteboardId).then(res => {
        if (res.success) {
          setStepSavedMessage("Whiteboard borttagen!");
          setWhiteboardId("");
          setRenameValue("");
          tacticsAPI.getAll().then(listRes => {
            if (listRes.success && Array.isArray(listRes.data)) {
              setWhiteboards(listRes.data);
            }
          });
        } else {
          setStepSavedMessage("Fel vid borttagning!");
        }
      });
    }
  };
  const handleRename = () => {
    if (!whiteboardId || !renameValue.trim()) return;
    tacticsAPI.update(whiteboardId, { name: renameValue }).then(res => {
      if (res.success) {
        setStepSavedMessage("Whiteboard döpt!");
        setRenameValue("");
        tacticsAPI.getAll().then(listRes => {
          if (listRes.success && Array.isArray(listRes.data)) {
            setWhiteboards(listRes.data);
          }
        });
      } else {
        setStepSavedMessage("Fel vid namnbyte!");
      }
    });
  };
  const [whiteboardId, setWhiteboardId] = useState<string>("");
  const [whiteboardName, setWhiteboardName] = useState<string>("");
  const [whiteboards, setWhiteboards] = useState<any[]>([]);
  const [isLoadingBoards, setIsLoadingBoards] = useState(false);
  // Rensa whiteboard vid event
  useEffect(() => {
  // Hämta alla sparade whiteboards vid start
  const fetchBoards = async () => {
    setIsLoadingBoards(true);
    const res = await tacticsAPI.getAll();
    if (res.success && Array.isArray(res.data)) {
      setWhiteboards(res.data);
    }
    setIsLoadingBoards(false);
  };
  fetchBoards();
    const clearHandler = () => {
      setDrawings([]);
      setCurrentLine(null);
      setPlacedMarkers([]);
      setMarkerPaths([]);
      setTextBoxes([]);
    };
    window.addEventListener("whiteboard-clear", clearHandler);
    return () => {
      window.removeEventListener("whiteboard-clear", clearHandler);
    };
  }, []);
  // Avbryt övningsläge och återställ state
  const cancelExercise = () => {
    setIsExerciseMode(false);
    setExerciseSteps([]);
    setCurrentExerciseStep(0);
    setMarkerPaths([]);
    setPlacedMarkers([]);
    setStepSavedMessage("");
  };
  // Funktion för att gå bakåt/framåt mellan steg
  const goToStep = (step: number) => {
    if (step < 0 || step >= exerciseSteps.length) return;
    setCurrentExerciseStep(step);
    const s = exerciseSteps[step];
    if (s) {
      setPlacedMarkers(s.markers.map((m: any) => ({ ...m })));
      setMarkerPaths(s.lines.map((l: any) => ({ ...l })));
    }
  };
  const [stepSavedMessage, setStepSavedMessage] = useState<string>("");
  // Alla state-variabler samlade i början av komponenten
  const [isExerciseMode, setIsExerciseMode] = useState(false);
  const [exerciseSteps, setExerciseSteps] = useState<ExerciseStep[]>([]);
  const [currentExerciseStep, setCurrentExerciseStep] = useState(0);
  const [drawings, setDrawings] = useState<any[]>([]); // Penna och linje
  const [currentLine, setCurrentLine] = useState<any|null>(null);
  // --- Dragning med linje bakom markör i övningsläge ---
  // Spara paths per markör under övningsläge
  const [markerPaths, setMarkerPaths] = useState<any[]>([]); // [{ markerIndex, points: [{x,y}]}]
  const [color, setColor] = useState<string>(() => {
    return localStorage.getItem("whiteboardColor") || "#222";
  });
  const [placedMarkers, setPlacedMarkers] = useState<any[]>([]); // Markörer
  const [movingMarker, setMovingMarker] = useState<number|null>(null);
  const [isDraggingMarker, setIsDraggingMarker] = useState(false);
  const [textBoxes, setTextBoxes] = useState<any[]>([]);
  const [showTextInput, setShowTextInput] = useState<{x:number,y:number}|null>(null);
  const [textInputValue, setTextInputValue] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<string>("hand");
  const [marker, setMarker] = useState<string>("");
  const [pendingMarker, setPendingMarker] = useState<string>("");
  const [mousePos, setMousePos] = useState<{x:number,y:number}|null>(null);

  // --- Inspelning och uppspelning av markörers rörelser ---

  // Optimera rendering med hook
  useWhiteboardCanvas(canvasRef, drawings, currentLine, color, markerPaths, isExerciseMode);

  // Hantera mus/touch för ritverktyg
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
      if (isExerciseMode && tool === "hand") {
        const idx = placedMarkers.findIndex(m => Math.abs(m.x-x)<20 && Math.abs(m.y-y)<20);
        if (idx !== -1) {
          setMovingMarker(idx);
          setIsDraggingMarker(true);
          // Starta en ny path för denna markör om ingen finns, annars fortsätt på senaste
          setMarkerPaths(paths => {
            const last = paths.length ? paths[paths.length-1] : null;
            if (!last || last.markerIndex !== idx || last.points.length === 0) {
              return [...paths, { markerIndex: idx, points: [{ x, y }] }];
            }
            return paths;
          });
        }
        return;
      }
    // Om pendingMarker finns, placera ut den och returnera
    if (pendingMarker) {
      setPlacedMarkers([...placedMarkers, { type: pendingMarker, x, y }]);
      setPendingMarker("");
      return;
    }
    if (tool === "pen") {
      setCurrentLine({ tool: "pen", points: [{ x, y }], color });
    } else if (tool === "line") {
      setCurrentLine({ tool: "line", points: [{ x, y }], color });
    } else if (tool === "eraser") {
      // Sudda när man klickar på en linje
      const newDrawings = drawings.filter(d => !d.points.some((p:any) => Math.abs(p.x-x)<10 && Math.abs(p.y-y)<10));
      setDrawings(newDrawings);
    } else if (tool === "text") {
      setShowTextInput({ x, y });
    } else if (tool === "hand") {
      // Flytta markör om man klickar på en
      const idx = placedMarkers.findIndex(m => Math.abs(m.x-x)<20 && Math.abs(m.y-y)<20);
      if (idx !== -1) {
        setMovingMarker(idx);
        setIsDraggingMarker(true);
        return;
      }
    } else if (marker && marker !== 'menu') {
      // Placera markör
      setPlacedMarkers([...placedMarkers, { type: marker, x, y }]);
    }
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
      if (isExerciseMode && tool === "hand" && isDraggingMarker && movingMarker !== null) {
        const newMarkers = [...placedMarkers];
        newMarkers[movingMarker] = { ...newMarkers[movingMarker], x, y };
        setPlacedMarkers(newMarkers);
        // Lägg till punkt i path för denna markör
        setMarkerPaths(paths => {
          // Hitta senaste path för denna markör
          let updated = [...paths];
          let lastIdx = updated.length-1;
          if (lastIdx < 0 || updated[lastIdx].markerIndex !== movingMarker) {
            // Om ingen path finns, skapa en ny
            updated.push({ markerIndex: movingMarker, points: [{ x, y }] });
            return updated;
          }
          // Annars lägg till punkt
          updated[lastIdx] = {
            ...updated[lastIdx],
            points: [...updated[lastIdx].points, { x, y }]
          };
          return updated;
        });
        return;
      }
    if (!currentLine) return;
    setCurrentLine({ ...currentLine, points: [...currentLine.points, { x, y }] });
  };
  const handlePointerUp = () => {
    if (isExerciseMode && tool === "hand" && isDraggingMarker) {
      setIsDraggingMarker(false);
      setMovingMarker(null);
      return;
    }
    if (currentLine) {
      setDrawings([...drawings, currentLine]);
      setCurrentLine(null);
    }
    setMovingMarker(null);
  };


  // Rendera markörer

  // Rendera textrutor
  const renderTextBoxes = () => textBoxes.map((t, i) => (
    t && typeof t.x === "number" && typeof t.y === "number" ? (
      <div
        key={i}
        className={`${styles.textBox} textBoxPosition`}
        data-x={t.x}
        data-y={t.y}
      >{t.text}</div>
    ) : null
  ));

  // Hantera textinput
  const handleTextInputSave = () => {
    if (showTextInput && textInputValue.trim()) {
      setTextBoxes([...textBoxes, { x: showTextInput.x, y: showTextInput.y, text: textInputValue }]);
      setShowTextInput(null);
      setTextInputValue("");
    }
  };

  // Spara, ladda upp, ångra, upprepa
  const handleSave = () => {
    // Spara till backend (MongoDB) med namn
    if (!whiteboardName.trim()) {
      setStepSavedMessage("Ange ett namn på whiteboarden!");
      return;
    }
    const data = {
      name: whiteboardName,
      drawings,
      placedMarkers,
      textBoxes,
      markerPaths,
    };
    tacticsAPI.create(data).then(res => {
      if (res.success && res.data && res.data._id) {
        setWhiteboardId(res.data._id);
        setStepSavedMessage("Whiteboard sparad på server!");
        setWhiteboardName("");
        // Uppdatera lista
        tacticsAPI.getAll().then(listRes => {
          if (listRes.success && Array.isArray(listRes.data)) {
            setWhiteboards(listRes.data);
          }
        });
      } else {
        setStepSavedMessage("Fel vid sparande!");
      }
    });
  };
  const handleUpload = () => {
    // Ladda vald whiteboard från backend
    if (!whiteboardId) {
      setStepSavedMessage("Välj en whiteboard att ladda!");
      return;
    }
    tacticsAPI.getById(whiteboardId).then(res => {
      if (res.success && res.data) {
        setDrawings(res.data.drawings || []);
        setPlacedMarkers(res.data.placedMarkers || []);
        setTextBoxes(res.data.textBoxes || []);
        setMarkerPaths(res.data.markerPaths || []);
        setStepSavedMessage("Whiteboard laddad från server!");
      } else {
        setStepSavedMessage("Fel vid laddning!");
      }
    });
  // UI för namn och lista
  // ...existing code...
  return (
    <div className={styles.whiteboardRoot}>
      {/* Whiteboard-namn och spara */}
      <div>
        <input
          type="text"
          value={whiteboardName}
          onChange={e => setWhiteboardName(e.target.value)}
          placeholder="Namnge din whiteboard..."
          className={styles.whiteboardNameInput}
        />
        <button onClick={handleSave} className={styles.whiteboardSaveBtn}>Spara</button>
      </div>
      {/* Lista med sparade whiteboards + ta bort/döp om */}
      <div>
        <div className={styles.whiteboardListHeader}>Sparade whiteboards:</div>
        {isLoadingBoards ? (
          <div>Laddar...</div>
        ) : (
          <>
            <label htmlFor="whiteboard-select" className={styles.whiteboardLabelHidden}>Välj whiteboard</label>
            <select
              id="whiteboard-select"
              title="Välj whiteboard"
              value={whiteboardId}
              onChange={e => { setWhiteboardId(e.target.value); setRenameValue(""); }}
              className={styles.whiteboardSelect}
            >
              <option value="">Välj whiteboard...</option>
              {whiteboards.map(board => (
                <option key={board._id} value={board._id}>{board.name || board._id}</option>
              ))}
            </select>
            <button onClick={handleUpload} className={styles.whiteboardLoadBtn}>Ladda</button>
            <button onClick={handleDelete} className={styles.whiteboardDeleteBtn}>Ta bort</button>
            {/* Döp om fält */}
            {whiteboardId && (
              <span className={styles.whiteboardRenameSpan}>
                <input
                  type="text"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  placeholder="Nytt namn..."
                  className={styles.whiteboardRenameInput}
                />
                <button onClick={handleRename} className={styles.whiteboardRenameBtn}>Döp om</button>
              </span>
            )}
          </>
        )}
      </div>
      {/* Whiteboard UI och canvas */}
      <div className={styles.whiteboardContainer}>
        <div className={styles.whiteboardHeader}>Whiteboard</div>
        <img src={innebandyplan} alt="Innebandyplan" className={styles.whiteboardImage} />
        {/* ...resten av whiteboard/canvas UI... */}
      </div>
    </div>
  );
  };
  const handleUndo = () => {
    // Ångra senaste steg
    alert("Ångra! (demo)");
  };
      // ...existing code...

  // --- Stegvis animation ---
  // const [currentStep, setCurrentStep] = useState(0); // Ta bort om ej används
  // const [isPlayingSteps, setIsPlayingSteps] = useState(false); // Ta bort om ej används

      // ...existing code...
      // ...existing code...

  // --- Animation av uppspelning med smidiga linjer (Bézier/smoothing) ---
  // Funktion playSmoothExercise tas bort, playSmoothExerciseWithPause används istället

  // --- Paus och kommentar vid uppspelning ---
  const [isPaused, setIsPaused] = useState(false);
  const [currentComment, setCurrentComment] = useState<string>("");

  // Spara hur många steg som helst med linjer och positioner
  const saveExerciseStep = () => {
    setExerciseSteps(prev => [
      ...prev,
      {
  markers: placedMarkers.map((m: any) => ({ ...m })),
        lines: markerPaths.map(path => ({ ...path }))
        }
      ]);
    setCurrentExerciseStep(exerciseSteps.length + 1);
    setStepSavedMessage(`Steg ${exerciseSteps.length + 1} sparat!`);
    setTimeout(() => setStepSavedMessage(""), 1800);
  };

  // Smooth och snygg uppspelning av markörens väg
  function playSmoothExerciseWithPause() {
    if (!exerciseSteps.length) return;
    let step = 0;
    function animateStep() {
      if (isPaused) return;
      const current = exerciseSteps[step];
      const next = exerciseSteps[step+1];
      if (!current || !next) return;
      setCurrentComment(current.comment || "");
      // Animera markörer och linjer smooth
      const frames = 40; // fler frames för mjukare rörelse
      let frame = 0;
      function animate() {
        if (isPaused) return;
        // Smooth markör
        if (!current || !next) return;
        const newMarkers = current.markers.map((m: any, i: number) => {
          const to = next.markers[i];
          if (!to) return m;
          return {
            ...m,
            x: m.x + ((to.x - m.x) * (frame+1)/frames),
            y: m.y + ((to.y - m.y) * (frame+1)/frames)
          };
        });
        setPlacedMarkers(newMarkers);
        // Smooth linjer
        if (current.lines && next.lines) {
          // Interpolera varje linje
          const smoothLines = current.lines.map((line: any, idx: number) => {
            const nextLine = next.lines[idx];
            if (!nextLine) return line;
            // Interpolera varje punkt
            const points = line.points.map((p: any, pi: number) => {
              const np = nextLine.points[pi];
              if (!np) return p;
              return {
                x: p.x + ((np.x - p.x) * (frame+1)/frames),
                y: p.y + ((np.y - p.y) * (frame+1)/frames)
              };
            });
            return { ...line, points };
          });
          setMarkerPaths(smoothLines);
        }
        frame++;
        if (frame < frames) {
          window.requestAnimationFrame(animate);
        } else {
          if (next && next.markers && next.lines) {
            setPlacedMarkers(next.markers.map((m: any) => ({ ...m })));
            setMarkerPaths(next.lines.map((l: any) => ({ ...l })));
          }
          step++;
          if (step < exerciseSteps.length-1) {
            setTimeout(animateStep, 400);
          }
        }
      }
      window.requestAnimationFrame(animate);
    }
    animateStep();
  }

  // --- Animation som följer linjen exakt för varje markör ---
  function playExerciseFollowPaths() {
    function getPathLength(points: any[]) {
      let len = 0;
      for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        len += Math.sqrt(dx*dx + dy*dy);
      }
      return len;
    }
    function interpolateExtra(points: any[], extra: number) {
      // Interpolera extra punkter mellan varje ritad punkt
      if (points.length < 2) return points;
      const result = [];
      for (let i = 1; i < points.length; i++) {
        const p1 = points[i-1];
        const p2 = points[i];
        for (let j = 0; j < extra; j++) {
          const t = j / extra;
          result.push({
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t
          });
        }
      }
      result.push(points[points.length-1]);
      return result;
    }
    function getPointAtDistance(points: any[], dist: number) {
      let travelled = 0;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i-1];
        const curr = points[i];
        const segLen = Math.sqrt((curr.x-prev.x)**2 + (curr.y-prev.y)**2);
        if (travelled + segLen >= dist) {
          const t = (dist - travelled) / segLen;
          return {
            x: prev.x + (curr.x-prev.x)*t,
            y: prev.y + (curr.y-prev.y)*t
          };
        }
        travelled += segLen;
      }
      return points[points.length-1];
    }
    if (!exerciseSteps.length) return;
    let step = 0;
    function animateStep() {
      if (isPaused) return;
      const current = exerciseSteps[step];
      const next = exerciseSteps[step+1];
      if (!current || !next) return;
      setCurrentComment(current.comment || "");
      // För varje markör, animera exakt längs sin path, punkt för punkt
      // Beräkna längsta path för alla markörer
      let maxLen = 0;
      const extraInterp = 10; // Antal extra punkter mellan varje ritad punkt
      const allPaths = current.lines.map((l: any) => interpolateExtra(l.points, extraInterp));
      allPaths.forEach((p: any[]) => { const len = getPathLength(p); if (len > maxLen) maxLen = len; });
      const totalFrames = Math.ceil(maxLen / 1); // 1 px per frame för maximal smoothness
      let frame = 0;
      function animate() {
        if (isPaused) return;
        if (!current || !next) return;
        const newMarkers = current.markers.map((m: any, i: number) => {
          const path = current.lines.find((l: any) => l.markerIndex === i);
          if (!path || path.points.length < 2) return m;
          const interpPoints = interpolateExtra(path.points, extraInterp);
          const len = getPathLength(interpPoints);
          const dist = Math.min((frame/totalFrames)*len, len);
          const p = getPointAtDistance(interpPoints, dist);
          return { ...m, x: p.x, y: p.y };
        });
        // Bygg upp linjen bakom markören kontinuerligt under animationen
        const newPaths = current.lines.map((l: any) => {
          if (!l.points || l.points.length < 2) return l;
          const interpPoints = interpolateExtra(l.points, extraInterp);
          const len = getPathLength(interpPoints);
          const dist = Math.min((frame/totalFrames)*len, len);
          // Samla punkter upp till aktuell distans
          let travelled = 0;
          const pts = [interpPoints[0]];
          for (let i = 1; i < interpPoints.length; i++) {
            const prev = interpPoints[i-1];
            const curr = interpPoints[i];
            const segLen = Math.sqrt((curr.x-prev.x)**2 + (curr.y-prev.y)**2);
            if (travelled + segLen > dist) {
              const t = (dist - travelled) / segLen;
              pts.push({
                x: prev.x + (curr.x-prev.x)*t,
                y: prev.y + (curr.y-prev.y)*t
              });
              break;
            } else {
              pts.push(curr);
              travelled += segLen;
            }
          }
          return { ...l, points: pts };
        });
        setPlacedMarkers(newMarkers);
        setMarkerPaths(newPaths);
        frame++;
        if (frame < totalFrames) {
          window.requestAnimationFrame(animate);
        } else {
          if (next && next.markers && next.lines) {
            setPlacedMarkers(next.markers.map((m: any) => ({ ...m })));
            setMarkerPaths(next.lines.map((l: any) => ({ ...l })));
          }
          step++;
          if (step < exerciseSteps.length-1) {
            setTimeout(animateStep, 400);
          }
        }
      }
      window.requestAnimationFrame(animate);
    }
    animateStep();
  }

  // --- Responsiv och iPad-anpassad whiteboard ---
  // Lägg till responsiv layout och större touchytor
  const isMobile = window.innerWidth < 900;

  useEffect(() => {
    const move = (e:any) => {
      if (isDraggingMarker && movingMarker !== null) {
        let x = e.clientX, y = e.clientY;
        if (e.touches && e.touches[0]) {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
        }
        // Justera för canvas-position
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          x -= rect.left;
          y -= rect.top;
        }
        const newMarkers = [...placedMarkers];
        newMarkers[movingMarker] = { ...newMarkers[movingMarker], x, y };
        setPlacedMarkers(newMarkers);
      } else if (pendingMarker) {
        let x = e.clientX, y = e.clientY;
        if (e.touches && e.touches[0]) {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
        }
        setMousePos({ x, y });
      }
    };
    const up = () => {
      if (isDraggingMarker) {
        setIsDraggingMarker(false);
        setMovingMarker(null);
      }
    };
    if (isDraggingMarker || pendingMarker) {
      window.addEventListener('mousemove', move);
      window.addEventListener('touchmove', move);
      window.addEventListener('mouseup', up);
      window.addEventListener('touchend', up);
    } else {
      setMousePos(null);
    }
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, [isDraggingMarker, movingMarker, pendingMarker, placedMarkers]);

  // Starta övningsläge
  const startExercise = () => {
    setIsExerciseMode(true);
    setExerciseSteps([]);
    setCurrentExerciseStep(0);
  };

  return (
    <div className={styles.whiteboardRoot}>
      <div className={styles.whiteboardContainer + (isMobile ? ' ' + styles.mobile : '')}>
        {stepSavedMessage && (
          <div className={styles.stepSavedMessage}>{stepSavedMessage}</div>
        )}
        <img src={innebandyplan} alt="Innebandyplan" className={styles.whiteboardImage} />
        <WhiteboardCanvas
          canvasRef={canvasRef}
          isMobile={isMobile}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handlePointerMove}
          handlePointerUp={handlePointerUp}
        />
        <WhiteboardMarkers
          markers={placedMarkers}
          tool={tool}
          setMovingMarker={setMovingMarker}
          setIsDraggingMarker={setIsDraggingMarker}
        />
        {renderTextBoxes()}
        {showTextInput && (
          <div
            className={`${styles.textInputOverlayWrapper} text-input-overlay-position`}
            data-left={showTextInput.x}
            data-top={showTextInput.y}
          >
            <div className={styles.textInputOverlay}>
              <textarea value={textInputValue} onChange={e => setTextInputValue(e.target.value)} className={styles.textInputArea} placeholder="Kommentar..." />
              <div className={styles.textInputBtnRow}>
                <button onClick={handleTextInputSave} className={styles.textInputSaveBtn}>Spara</button>
                <button onClick={() => setShowTextInput(null)} className={styles.textInputCancelBtn}>Avbryt</button>
              </div>
            </div>
          </div>
        )}
        {pendingMarker && mousePos && (
          <div
            className={styles.pendingMarkerWrapper}
            data-left={mousePos.x - 18}
            data-top={mousePos.y - 18}
          >
            <div
              className={
                styles.pendingMarker +
                (pendingMarker === "player" ? " " + styles.player : "") +
                (pendingMarker === "opponent" ? " " + styles.opponent : "") +
                (pendingMarker === "ball" ? " " + styles.ball : "")
              }
            >
              {pendingMarker === "player" ? "S" : pendingMarker === "opponent" ? "M" : "B"}
            </div>
          </div>
        )}
        {/* Kommentar och paus/play under uppspelning */}
        {isExerciseMode && currentComment && (
          <div className={styles.exerciseComment}>{currentComment}</div>
        )}
      </div>
      {/* Övningsläge-knapp och stegkontroller */}
  <div className={styles.exerciseControls + (isMobile ? ' ' + styles.mobile : '')}>
        {!isExerciseMode && (
          <button onClick={startExercise} className={styles.exerciseStartBtn}>Skapa övning</button>
        )}
        {isExerciseMode && (
          <>
            <span className={styles.exerciseStepLabel}>Steg {currentExerciseStep + 1}</span>
            <button onClick={saveExerciseStep} className={styles.exerciseSaveStepBtn}>Spara steg</button>
            <button onClick={() => goToStep(currentExerciseStep - 1)} disabled={currentExerciseStep <= 0} className={styles.exerciseBackStepBtn}>⬅ Backa steg</button>
            <button onClick={() => goToStep(currentExerciseStep + 1)} disabled={currentExerciseStep >= exerciseSteps.length - 1} className={styles.exerciseForwardStepBtn}>Framåt steg ➡</button>
            <button onClick={cancelExercise} className={styles.exerciseCancelBtn}>Avbryt övning</button>
          </>
        )}
        {/* Paus/play och spela upp övning alltid synliga bredvid skapa övning */}
        <button onClick={() => setIsPaused(p => !p)} className={styles.exercisePauseBtn}>
          {isPaused ? "▶ Fortsätt" : "⏸ Pausa"}
        </button>
        <button onClick={playSmoothExerciseWithPause} className={styles.exercisePlayBtn}>
          Spela upp övning
        </button>
      </div>
  <div className={styles.whiteboardGrid + (isMobile ? ' ' + styles.mobile : '')}>
        {/* Verktyg */}
  <div className={styles.toolbarCol}>
          <WhiteboardToolbar
            tools={TOOLS}
            tool={tool}
            setTool={setTool}
            colors={COLORS}
            color={color}
            setColor={setColor}
            isMobile={isMobile}
          />
        </div>
        {/* Markörer */}
  <div className={styles.markersCol}>
          <div className={styles.markersHeader}>Markörer</div>
          <div className={styles.markersBtnRow}>
            {MARKERS.map((m: any) => (
              <button key={m.key} onClick={() => { setPendingMarker(m.key); setMarker(""); setTool('hand'); }} className={styles.markerBtn + (pendingMarker===m.key ? ' ' + styles.markerBtnActive : '')}>{m.label}</button>
            ))}
          </div>
        </div>
        {/* Åtgärder */}
  <div className={styles.actionsCol}>
          <div className={styles.actionsHeader}>Åtgärder</div>
          <div className={styles.actionsBtnRow}>
             <button onClick={handleSave} className={styles.actionBtn}>💾 Spara</button>
             <button onClick={handleUndo} className={styles.actionBtn}>↩ Ångra</button>
             <button onClick={handleUpload} className={styles.actionBtn}>⬆ Ladda upp</button>
          </div>
        </div>
      </div>
      {/* ...existing code... */}
      {isExerciseMode && (
  <div className={styles.exerciseSteps + (isMobile ? ' ' + styles.mobile : '')}>
  <div className={styles.exerciseStepsBtnRow}>
      <button onClick={saveExerciseStep} className={styles.exerciseStepBtn}>Spara steg {currentExerciseStep + 1}</button>
      <button onClick={() => setCurrentExerciseStep(s => Math.max(0, s-1))} className={styles.exerciseStepBtn}>← Tillbaka</button>
      <button onClick={() => setCurrentExerciseStep(s => Math.min(exerciseSteps.length-1, s+1))} className={styles.exerciseStepBtn}>Framåt →</button>
      <button onClick={() => { setExerciseSteps([]); setMarkerPaths([]); setCurrentExerciseStep(0); setPlacedMarkers(placedMarkers.map((m: any) => ({ ...m }))); }} className={styles.exerciseStepBtn}>Börja om</button>
      <button onClick={() => alert('Övning sparad!')} className={styles.exerciseStepBtn}>Spara övning</button>
      <button onClick={() => setIsExerciseMode(false)} className={styles.exerciseStepBtn}>Avsluta</button>
      <button onClick={playExerciseFollowPaths} className={styles.exerciseStepBtn}>▶ Spela upp övning</button>
    </div>
    <div className={styles.exerciseStepInfo}>
      {exerciseSteps.length > 0 ? `Du har sparat ${exerciseSteps.length} steg.` : "Inga steg sparade ännu."}
    </div>
  </div>
)}
    </div>
  );
}

export default Whiteboard;
