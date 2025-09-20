import React, { useRef, useState, useEffect } from "react";
import { tacticsAPI } from "../services/apiService";
import { useWhiteboardCanvas } from "../hooks/useWhiteboardCanvas";
import { ExerciseStep } from "../types/whiteboardTypes";
import WhiteboardCanvas from "../components/WhiteboardCanvas";
import WhiteboardToolbar from "../components/WhiteboardToolbar";
import WhiteboardMarkers from "../components/WhiteboardMarkers";
import innebandyplan from "../assets/innebandyplan-liggande.svg";

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
      <div key={i} style={{ position: "absolute", left: t.x, top: t.y, minWidth: 120, background: "#fff", color: "#222", border: "2px solid #2E7D32", borderRadius: 8, padding: "0.5rem 0.8rem", fontWeight: 700, fontSize: "1.05rem", zIndex: 3, boxShadow: "0 2px 8px rgba(46,125,50,0.10)" }}>{t.text}</div>
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
    <div>
      {/* Whiteboard-namn och spara */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={whiteboardName}
          onChange={e => setWhiteboardName(e.target.value)}
          placeholder="Namnge din whiteboard..."
          style={{ padding: "0.5rem", fontSize: "1rem", borderRadius: 6, border: "1.5px solid #2E7D32", marginRight: 8 }}
        />
        <button onClick={handleSave} style={{ padding: "0.5rem 1.2rem", fontWeight: 700, background: "#2E7D32", color: "#fff", borderRadius: 6, border: "none" }}>Spara</button>
      </div>
      {/* Lista med sparade whiteboards + ta bort/döp om */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Sparade whiteboards:</div>
        {isLoadingBoards ? (
          <div>Laddar...</div>
        ) : (
          <>
            <select value={whiteboardId} onChange={e => { setWhiteboardId(e.target.value); setRenameValue(""); }} style={{ padding: "0.5rem", fontSize: "1rem", borderRadius: 6, border: "1.5px solid #1976d2" }}>
              <option value="">Välj whiteboard...</option>
              {whiteboards.map(board => (
                <option key={board._id} value={board._id}>{board.name || board._id}</option>
              ))}
            </select>
            <button onClick={handleUpload} style={{ marginLeft: 8, padding: "0.5rem 1.2rem", fontWeight: 700, background: "#1976d2", color: "#fff", borderRadius: 6, border: "none" }}>Ladda</button>
            <button onClick={handleDelete} style={{ marginLeft: 8, padding: "0.5rem 1.2rem", fontWeight: 700, background: "#e53935", color: "#fff", borderRadius: 6, border: "none" }}>Ta bort</button>
            {/* Döp om fält */}
            {whiteboardId && (
              <span style={{ marginLeft: 12 }}>
                <input
                  type="text"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  placeholder="Nytt namn..."
                  style={{ padding: "0.4rem", fontSize: "1rem", borderRadius: 6, border: "1.5px solid #1976d2", marginRight: 4 }}
                />
                <button onClick={handleRename} style={{ padding: "0.4rem 1rem", fontWeight: 700, background: "#FFB300", color: "#222", borderRadius: 6, border: "none" }}>Döp om</button>
              </span>
            )}
          </>
        )}
      </div>
      {/* Whiteboard UI och canvas */}
      {/* ...existing code... */}
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
    <div style={{ width: "100vw", minHeight: "100vh", background: "#222", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: isMobile ? "100vw" : "100%", maxWidth: isMobile ? "100vw" : 1100, height: isMobile ? "60vw" : 650, background: "#222", borderRadius: isMobile ? 0 : 18, boxShadow: isMobile ? "none" : "0 8px 32px rgba(46,125,50,0.18)", overflow: "hidden", touchAction: "none" }}>
        {stepSavedMessage && (
          <div style={{ position: "absolute", left: "50%", top: 24, transform: "translateX(-50%)", background: "#388E3C", color: "#fff", borderRadius: 8, padding: "0.5rem 1.2rem", fontWeight: 700, fontSize: "1.15rem", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 99, transition: "opacity 0.3s" }}>
            {stepSavedMessage}
          </div>
        )}
        <img src={innebandyplan} alt="Innebandyplan" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.98 }} />
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
          <div style={{ position: "absolute", left: showTextInput.x, top: showTextInput.y, zIndex: 10, background: "#fff", border: "2px solid #2E7D32", borderRadius: 8, padding: isMobile ? "1rem" : "0.5rem 0.8rem", minWidth: isMobile ? 180 : 120 }}>
            <textarea value={textInputValue} onChange={e => setTextInputValue(e.target.value)} style={{ width: "100%", minHeight: isMobile ? 60 : 40, fontSize: isMobile ? "1.25rem" : "1.05rem", color: "#222", border: "none", outline: "none", resize: "none", background: "#fff" }} placeholder="Kommentar..." />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={handleTextInputSave} style={{ background: "#2E7D32", color: "#fff", borderRadius: 6, border: "none", fontWeight: 700, fontSize: isMobile ? "1.15rem" : "1.05rem", padding: isMobile ? "0.7rem 1.3rem" : "0.4rem 1rem", cursor: "pointer" }}>Spara</button>
              <button onClick={() => setShowTextInput(null)} style={{ background: "#e53935", color: "#fff", borderRadius: 6, border: "none", fontWeight: 700, fontSize: isMobile ? "1.15rem" : "1.05rem", padding: isMobile ? "0.7rem 1.3rem" : "0.4rem 1rem", cursor: "pointer" }}>Avbryt</button>
            </div>
          </div>
        )}
        {pendingMarker && mousePos && (
          <div style={{ position: "fixed", left: mousePos.x-18, top: mousePos.y-18, width: 36, height: 36, borderRadius: "50%", background: pendingMarker === "player" ? "#2E7D32" : pendingMarker === "opponent" ? "#e53935" : "#111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "1.15rem", zIndex: 9999, pointerEvents: "none", opacity: 0.85, boxShadow: "0 2px 8px rgba(0,0,0,0.18)", border: pendingMarker === "ball" ? "2px solid #fff" : "none" }}>
            {pendingMarker === "player" ? "S" : pendingMarker === "opponent" ? "M" : "B"}
          </div>
        )}
        {/* Kommentar och paus/play under uppspelning */}
        {isExerciseMode && currentComment && (
          <div style={{ position: "absolute", left: "50%", top: "10px", transform: "translateX(-50%)", zIndex: 20, background: "rgba(255,255,255,0.9)", color: "#222", border: "2px solid #2E7D32", borderRadius: 8, padding: "0.5rem 1rem", fontWeight: 700, fontSize: "1.1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}>
            {currentComment}
          </div>
        )}
      </div>
      {/* Övningsläge-knapp och stegkontroller */}
      <div style={{ width: isMobile ? "100vw" : "100%", maxWidth: isMobile ? "100vw" : 1100, marginTop: 12, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        {!isExerciseMode && (
          <button onClick={startExercise} style={{ background: "#1976d2", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: isMobile ? "1.25rem" : "1.08rem", padding: isMobile ? "1rem 2rem" : "0.7rem 1.5rem", cursor: "pointer", minWidth: 120 }}>Skapa övning</button>
        )}
        {isExerciseMode && (
          <>
            <span style={{ fontWeight: 900, fontSize: "1.18rem", color: "#388E3C", background: "#fff", borderRadius: 8, padding: "0.3rem 1rem", marginRight: 8, boxShadow: "0 2px 8px rgba(46,125,50,0.10)" }}>Steg {currentExerciseStep + 1}</span>
            <button onClick={saveExerciseStep} style={{ background: "#ffa726", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: isMobile ? "1.15rem" : "1.08rem", padding: isMobile ? "0.8rem 1.5rem" : "0.5rem 1.2rem", cursor: "pointer", minWidth: 120 }}>Spara steg</button>
            <button onClick={() => goToStep(currentExerciseStep - 1)} disabled={currentExerciseStep <= 0} style={{ background: currentExerciseStep <= 0 ? "#ddd" : "#1976d2", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: isMobile ? "1.15rem" : "1.08rem", padding: isMobile ? "0.8rem 1.5rem" : "0.5rem 1.2rem", cursor: currentExerciseStep <= 0 ? "not-allowed" : "pointer", minWidth: 120, opacity: currentExerciseStep <= 0 ? 0.6 : 1 }}>⬅ Backa steg</button>
            <button onClick={() => goToStep(currentExerciseStep + 1)} disabled={currentExerciseStep >= exerciseSteps.length - 1} style={{ background: currentExerciseStep >= exerciseSteps.length - 1 ? "#ddd" : "#1976d2", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: isMobile ? "1.15rem" : "1.08rem", padding: isMobile ? "0.8rem 1.5rem" : "0.5rem 1.2rem", cursor: currentExerciseStep >= exerciseSteps.length - 1 ? "not-allowed" : "pointer", minWidth: 120, opacity: currentExerciseStep >= exerciseSteps.length - 1 ? 0.6 : 1 }}>Framåt steg ➡</button>
            <button onClick={cancelExercise} style={{ background: "#e53935", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: isMobile ? "1.15rem" : "1.08rem", padding: isMobile ? "0.8rem 1.5rem" : "0.5rem 1.2rem", cursor: "pointer", minWidth: 120, marginLeft: 8 }}>Avbryt övning</button>
          </>
        )}
        {/* Paus/play och spela upp övning alltid synliga bredvid skapa övning */}
        <button onClick={() => setIsPaused(p => !p)} style={{ background: isPaused ? "#1976d2" : "#ffa726", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: isMobile ? "1.15rem" : "1.08rem", padding: isMobile ? "0.8rem 1.5rem" : "0.5rem 1.2rem", cursor: "pointer", minWidth: 120 }}>
          {isPaused ? "▶ Fortsätt" : "⏸ Pausa"}
        </button>
        <button onClick={playSmoothExerciseWithPause} style={{ background: "#388E3C", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: isMobile ? "1.15rem" : "1.08rem", padding: isMobile ? "0.8rem 1.5rem" : "0.5rem 1.2rem", cursor: "pointer", minWidth: 120 }}>
          Spela upp övning
        </button>
      </div>
  <div style={{ width: isMobile ? "100vw" : "100%", maxWidth: isMobile ? "100vw" : 1100, marginTop: 24, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 18 : 24, justifyContent: "center", alignItems: "start", background: "#fff", borderRadius: isMobile ? 0 : 12, boxShadow: isMobile ? "none" : "0 2px 12px rgba(46,125,50,0.10)", padding: isMobile ? "2rem 0.5rem" : "1.2rem 0.5rem" }}>
        {/* Verktyg */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontWeight: 900, fontSize: "1.08rem", color: "#222", marginBottom: 6 }}>Markörer</div>
          <div style={{ display: "flex", gap: 6 }}>
            {MARKERS.map((m: any) => (
              <button key={m.key} onClick={() => { setPendingMarker(m.key); setMarker(""); setTool('hand'); }} style={{ background: pendingMarker===m.key ? m.color : "#f5f5f5", color: pendingMarker===m.key ? "#fff" : "#222", borderRadius: 6, border: pendingMarker===m.key ? `2px solid ${m.color}` : "1.5px solid #ddd", fontWeight: 700, fontSize: isMobile ? "1.25rem" : "1.02rem", padding: isMobile ? "1rem 2rem" : "0.45rem 0.9rem", cursor: "pointer", boxShadow: pendingMarker===m.key ? `0 2px 8px ${m.color}33` : "none", minWidth: isMobile ? 64 : 44, minHeight: isMobile ? 54 : 38, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.label}</button>
            ))}
          </div>
        </div>
        {/* Åtgärder */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontWeight: 900, fontSize: "1.08rem", color: "#222", marginBottom: 6 }}>Åtgärder</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
             <button onClick={handleSave} style={{ background: "#f5f5f5", color: "#222", borderRadius: 6, border: "1.5px solid #ddd", fontWeight: 700, fontSize: isMobile ? "1.25rem" : "1.02rem", padding: isMobile ? "1rem 2rem" : "0.45rem 0.9rem", cursor: "pointer", minWidth: isMobile ? 64 : 44 }}>💾 Spara</button>
             <button onClick={handleUndo} style={{ background: "#f5f5f5", color: "#222", borderRadius: 6, border: "1.5px solid #ddd", fontWeight: 700, fontSize: isMobile ? "1.25rem" : "1.02rem", padding: isMobile ? "1rem 2rem" : "0.45rem 0.9rem", cursor: "pointer", minWidth: isMobile ? 64 : 44 }}>↩ Ångra</button>
             <button onClick={handleUpload} style={{ background: "#f5f5f5", color: "#222", borderRadius: 6, border: "1.5px solid #ddd", fontWeight: 700, fontSize: isMobile ? "1.25rem" : "1.02rem", padding: isMobile ? "1rem 2rem" : "0.45rem 0.9rem", cursor: "pointer", minWidth: isMobile ? 64 : 44 }}>⬆ Ladda upp</button>
          </div>
        </div>
      </div>
      {/* ...existing code... */}
      {isExerciseMode && (
  <div style={{ width: isMobile ? "100vw" : 600, margin: "18px auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
      <button onClick={saveExerciseStep} style={{ background: "#ffa726", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: "1.15rem", padding: "0.7rem 1.5rem", cursor: "pointer", minWidth: 120 }}>
        Spara steg {currentExerciseStep + 1}
      </button>
      <button onClick={() => setCurrentExerciseStep(s => Math.max(0, s-1))} style={{ background: "#1976d2", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: "1.15rem", padding: "0.7rem 1.5rem", cursor: "pointer", minWidth: 120 }}>
        ← Tillbaka
      </button>
      <button onClick={() => setCurrentExerciseStep(s => Math.min(exerciseSteps.length-1, s+1))} style={{ background: "#1976d2", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: "1.15rem", padding: "0.7rem 1.5rem", cursor: "pointer", minWidth: 120 }}>
        Framåt →
      </button>
  <button onClick={() => { setExerciseSteps([]); setMarkerPaths([]); setCurrentExerciseStep(0); setPlacedMarkers(placedMarkers.map((m: any) => ({ ...m }))); }} style={{ background: "#e53935", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: "1.15rem", padding: "0.7rem 1.5rem", cursor: "pointer", minWidth: 120 }}>
        Börja om
      </button>
      <button onClick={() => alert('Övning sparad!')} style={{ background: "#388E3C", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: "1.15rem", padding: "0.7rem 1.5rem", cursor: "pointer", minWidth: 120 }}>
        Spara övning
      </button>
      <button onClick={() => setIsExerciseMode(false)} style={{ background: "#222", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: "1.15rem", padding: "0.7rem 1.5rem", cursor: "pointer", minWidth: 120 }}>
        Avsluta
      </button>
      <button onClick={playExerciseFollowPaths} style={{ background: "#1976d2", color: "#fff", borderRadius: 8, border: "none", fontWeight: 700, fontSize: "1.15rem", padding: "0.7rem 1.5rem", cursor: "pointer", minWidth: 120 }}>
        ▶ Spela upp övning
      </button>
    </div>
    <div style={{ marginTop: 10, fontWeight: 700, fontSize: "1.08rem", color: "#222" }}>
      {exerciseSteps.length > 0 ? `Du har sparat ${exerciseSteps.length} steg.` : "Inga steg sparade ännu."}
    </div>
  </div>
)}
    </div>
  );
}

export default Whiteboard;
