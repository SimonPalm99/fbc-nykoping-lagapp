import React, { useRef, useState } from "react";

// Typ för markör
interface Marker {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  type: 'circle' | 'triangle' | 'arrow' | 'text' | 'default';
  path?: Array<{ x: number; y: number }>;
}

// Typ för linje
interface Line {
  id: string;
  points: Array<{ x: number; y: number }>;
  color: string;
}

const COLORS = ["#22c55e", "#111", "#FFD600", "#FF5252", "#2196F3"];

const Whiteboard: React.FC = () => {
  // Zoom och pan state
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);
  const panStart = React.useRef<{ x: number; y: number } | null>(null);

  function getColor(c: string | undefined): string {
    return String(c ?? COLORS[0]);
  }
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [selectedTool, setSelectedTool] = useState<'marker'|'line'|'move'|'record'>('marker');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedMarkerType, setSelectedMarkerType] = useState<'circle'|'triangle'|'arrow'|'text'|'default'>('default');
  const [recording, setRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState<Array<{ x: number; y: number }>>([]);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Rita på canvas, justera för zoom/offset
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(offset.x/zoom, offset.y/zoom);
    // Rita linjer
    lines.forEach(line => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      line.points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    });
    // Rita markörer
    markers.forEach(marker => {
      ctx.save();
      if (marker.type === 'circle') {
        ctx.beginPath();
        ctx.arc(marker.x, marker.y, 18, 0, 2 * Math.PI);
        ctx.fillStyle = marker.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = "bold 1.1rem sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(marker.label, marker.x, marker.y + 5);
      } else if (marker.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(marker.x, marker.y - 18);
        ctx.lineTo(marker.x - 16, marker.y + 14);
        ctx.lineTo(marker.x + 16, marker.y + 14);
        ctx.closePath();
        ctx.fillStyle = marker.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = "bold 1.1rem sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(marker.label, marker.x, marker.y + 8);
      } else if (marker.type === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(marker.x - 18, marker.y);
        ctx.lineTo(marker.x + 10, marker.y);
        ctx.lineTo(marker.x + 10, marker.y - 10);
        ctx.lineTo(marker.x + 18, marker.y + 2);
        ctx.lineTo(marker.x + 10, marker.y + 10);
        ctx.lineTo(marker.x + 10, marker.y + 2);
        ctx.lineTo(marker.x - 18, marker.y + 2);
        ctx.closePath();
        ctx.fillStyle = marker.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = "bold 1.1rem sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(marker.label, marker.x, marker.y - 12);
      } else if (marker.type === 'text') {
        ctx.font = "bold 1.5rem sans-serif";
        ctx.fillStyle = marker.color;
        ctx.textAlign = "center";
        ctx.fillText(marker.label, marker.x, marker.y + 5);
      } else {
        ctx.beginPath();
        ctx.arc(marker.x, marker.y, 18, 0, 2 * Math.PI);
        ctx.fillStyle = marker.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = "bold 1.1rem sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(marker.label, marker.x, marker.y + 5);
      }
      ctx.restore();
      // Rita inspelad path
      if (marker.path && marker.path.length > 1) {
        ctx.beginPath();
        marker.path.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = marker.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
    ctx.restore();
  }, [markers, lines, zoom, offset]);

  // Hantera mouse events
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    // Justera koordinater för zoom och offset
    const x = (e.clientX - rect.left) / zoom - offset.x / zoom;
    const y = (e.clientY - rect.top) / zoom - offset.y / zoom;
    if (selectedTool === 'marker') {
      let label = "M";
      if (selectedMarkerType === 'text') {
        label = prompt("Text?") || "T";
      } else {
        label = prompt("Markörens namn/nummer?") || "M";
      }
      setMarkers([...markers, { id: Date.now().toString(), x, y, color: getColor(selectedColor), label, type: selectedMarkerType }]);
    } else if (selectedTool === 'move') {
      // Välj markör att flytta
      const found = markers.find(m => Math.hypot(m.x - x, m.y - y) < 20);
      if (found) setSelectedMarker(found.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'line') {
      setDrawing(true);
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom - offset.x / zoom;
      const y = (e.clientY - rect.top) / zoom - offset.y / zoom;
      setCurrentLine({ id: Date.now().toString(), points: [{ x, y }], color: getColor(selectedColor) });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - offset.x / zoom;
    const y = (e.clientY - rect.top) / zoom - offset.y / zoom;
    if (drawing && selectedTool === 'line' && currentLine) {
      setCurrentLine({ ...currentLine, points: [...currentLine.points, { x, y }] });
    } else if (selectedTool === 'move' && selectedMarker) {
      setMarkers(markers => markers.map(m => m.id === selectedMarker ? { ...m, x, y } : m));
    } else if (recording && selectedMarker) {
      setRecordedPath(path => [...path, { x, y }]);
      setMarkers(markers => markers.map(m => m.id === selectedMarker ? { ...m, x, y } : m));
    }
  };

  const handleMouseUp = () => {
    if (drawing && selectedTool === 'line' && currentLine) {
      setLines([...lines, currentLine]);
      setDrawing(false);
      setCurrentLine(null);
    }
    if (selectedMarker) setSelectedMarker(null);
    if (recording && selectedMarker) {
      setMarkers(markers => markers.map(m => m.id === selectedMarker ? { ...m, path: recordedPath } : m));
      setRecording(false);
      setRecordedPath([]);
    }
  };

  // Spela in rörelse
  const startRecording = (markerId: string) => {
    setSelectedMarker(markerId);
    setRecording(true);
    setRecordedPath([]);
  };

  // Spela upp rörelse (demo)
  const playPath = (marker: Marker) => {
    if (!marker.path || marker.path.length < 2) return;
    let i = 0;
    const interval = setInterval(() => {
      if (marker.path && marker.path[i] !== undefined) {
        const pt = marker.path[i];
        if (pt) {
          setMarkers(markers => markers.map(m => m.id === marker.id ? { ...m, x: pt.x, y: pt.y } : m));
        }
        i++;
        if (i >= marker.path.length) clearInterval(interval);
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  // Spara/ladda övning
  const saveExercise = () => {
    localStorage.setItem('whiteboardExercise', JSON.stringify({ markers, lines }));
    alert('Övning sparad!');
  };
  const loadExercise = () => {
    const data = localStorage.getItem('whiteboardExercise');
    if (!data) return;
    const { markers: m, lines: l } = JSON.parse(data);
    setMarkers(m);
    setLines(l);
  };


  // Mus/touch pan
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsPanning(true);
    panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanning && panStart.current) {
      setOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
    }
  };
  const handlePointerUp = () => {
    setIsPanning(false);
  };
  // Zoom med mus/touch
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    let newZoom = zoom + (e.deltaY < 0 ? 0.1 : -0.1);
    newZoom = Math.max(0.5, Math.min(2.5, newZoom));
    setZoom(newZoom);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0, background: '#f8fafc', zIndex: 100, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Verktygsrad utanför whiteboard */}
      <div style={{ display: 'flex', gap: '1rem', padding: '1.2rem 2rem', background: 'rgba(34,197,94,0.10)', borderBottom: '2px solid #22c55e', alignItems: 'center', flexWrap: 'wrap', zIndex: 2, position: 'relative' }}>
        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} style={{ background:'#22c55e', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.5rem 1.2rem', fontWeight:700, fontSize:'1.1rem', cursor:'pointer' }}>-</button>
        <span style={{ fontWeight:700, color:'#222', fontSize:'1.1rem' }}>{(zoom*100).toFixed(0)}%</span>
        <button onClick={() => setZoom(z => Math.min(2.5, z + 0.1))} style={{ background:'#22c55e', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.5rem 1.2rem', fontWeight:700, fontSize:'1.1rem', cursor:'pointer' }}>+</button>
        <button onClick={() => setSelectedTool('marker')} style={{ background: selectedTool==='marker'?'#22c55e':'#222', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.7rem 1.7rem', fontWeight:700, fontSize:'1.15rem', cursor:'pointer', boxShadow: selectedTool==='marker'?'0 2px 8px #22c55e22':'none' }}>Markör</button>
        <button onClick={() => setSelectedTool('line')} style={{ background: selectedTool==='line'?'#22c55e':'#222', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.7rem 1.7rem', fontWeight:700, fontSize:'1.15rem', cursor:'pointer', boxShadow: selectedTool==='line'?'0 2px 8px #22c55e22':'none' }}>Linje</button>
        <button onClick={() => setSelectedTool('move')} style={{ background: selectedTool==='move'?'#22c55e':'#222', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.7rem 1.7rem', fontWeight:700, fontSize:'1.15rem', cursor:'pointer', boxShadow: selectedTool==='move'?'0 2px 8px #22c55e22':'none' }}>Flytta</button>
        <button onClick={saveExercise} style={{ background:'#FFD600', color:'#222', border:'none', borderRadius:'0.7rem', padding:'0.7rem 1.7rem', fontWeight:700, fontSize:'1.15rem', cursor:'pointer' }}>Spara</button>
        <button onClick={loadExercise} style={{ background:'#2196F3', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.7rem 1.7rem', fontWeight:700, fontSize:'1.15rem', cursor:'pointer' }}>Ladda</button>
        <span style={{ marginLeft: '1rem', fontWeight:700, color:'#22c55e', fontSize:'1.1rem' }}>Färg:</span>
        {COLORS.map(c => (
          <button key={c} onClick={() => setSelectedColor(c)} style={{ background:c, border:'2px solid #fff', borderRadius:'50%', width:32, height:32, marginRight:6, cursor:'pointer' }} />
        ))}
        <span style={{ marginLeft: '1rem', fontWeight:700, color:'#22c55e', fontSize:'1.1rem' }}>Typ:</span>
        <select value={selectedMarkerType} onChange={e => setSelectedMarkerType(e.target.value as any)} style={{ fontWeight:700, borderRadius:'0.7rem', padding:'0.5rem 1.2rem', border:'2px solid #22c55e', background:'#fff', color:'#222', cursor:'pointer', fontSize:'1.1rem' }}>
          <option value="default">Standard</option>
          <option value="circle">Cirkel</option>
          <option value="triangle">Triangel</option>
          <option value="arrow">Pil</option>
          <option value="text">Text</option>
        </select>
      </div>
      {/* Whiteboardyta med zoom/pan */}
      <div
        style={{ flex: 1, position: 'relative', width: '100%', height: '100%', overflow: 'auto', background: '#f8fafc' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <div
          style={{
            position:'absolute',
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            zIndex:0,
            pointerEvents:'none',
            transform: `scale(${zoom}) translate(${offset.x/zoom}px,${offset.y/zoom}px)`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.2s',
          }}
        >
          <svg viewBox="0 0 900 360" width="100%" height="100%" style={{display:'block', height:'100%', width:'100%'}}>
            {/* ...planen... */}
            <rect x="20" y="20" width="860" height="320" rx="40" fill="#f8fafc" stroke="#222" strokeWidth="5" />
            <line x1="450" y1="20" x2="450" y2="340" stroke="#222" strokeWidth="3" />
            <rect x="40" y="120" width="60" height="120" rx="18" fill="#e3e3e3" stroke="#222" strokeWidth="2" />
            <rect x="800" y="120" width="60" height="120" rx="18" fill="#e3e3e3" stroke="#222" strokeWidth="2" />
            <rect x="30" y="160" width="20" height="40" rx="6" fill="#fff" stroke="#222" strokeWidth="2" />
            <rect x="850" y="160" width="20" height="40" rx="6" fill="#fff" stroke="#222" strokeWidth="2" />
            <circle cx="450" cy="180" r="38" fill="none" stroke="#222" strokeWidth="2" />
            <circle cx="450" cy="180" r="6" fill="#222" />
            <text x="40" y="40" fontSize="28" fill="#222">+</text>
            <text x="860" y="40" fontSize="28" fill="#222">+</text>
            <text x="40" y="320" fontSize="28" fill="#222">+</text>
            <text x="860" y="320" fontSize="28" fill="#222">+</text>
            <rect x="20" y="20" width="860" height="320" rx="40" fill="none" stroke="#22c55e" strokeWidth="2" />
          </svg>
        </div>
        <canvas
          ref={canvasRef}
          width={900}
          height={360}
          style={{ width: '100%', height: '100%', background: 'transparent', borderRadius: '1rem', boxShadow: '0 2px 8px #22c55e22', cursor: selectedTool==='move'?'grab':'crosshair', position:'absolute', left:0, top:0, zIndex:1,
            transform: `scale(${zoom}) translate(${offset.x/zoom}px,${offset.y/zoom}px)`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.2s',
          }}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        {/* Lista markörer för inspelning/spelning */}
        <div style={{ position:'absolute', bottom:24, left:24, display:'flex', gap:'1rem', flexWrap:'wrap', zIndex:2 }}>
          {markers.map(marker => (
            <div key={marker.id} style={{ background:'#fff', borderRadius:'0.7rem', boxShadow:'0 2px 8px #22c55e22', padding:'0.5rem 1rem', display:'flex', alignItems:'center', gap:'0.7rem' }}>
              <span style={{ color:marker.color, fontWeight:700 }}>{marker.label}</span>
              <button onClick={() => startRecording(marker.id)} style={{ background:'#FFD600', color:'#222', border:'none', borderRadius:'0.7rem', padding:'0.2rem 0.7rem', fontWeight:700, cursor:'pointer' }}>Spela in</button>
              <button onClick={() => playPath(marker)} style={{ background:'#22c55e', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.2rem 0.7rem', fontWeight:700, cursor:'pointer' }}>Spela upp</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
