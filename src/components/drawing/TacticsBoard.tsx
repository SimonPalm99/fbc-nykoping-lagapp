import React, { useState, useRef, useEffect, useCallback } from "react";
import { DrawingElement, TacticDrawing, DrawingAnimation, DrawingTemplate } from "../../types/tactics";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";

interface Props {
  tactic?: TacticDrawing;
  onSave?: (tactic: TacticDrawing) => void;
  onShare?: (tacticId: string, playerIds: string[]) => void;
  onDiscuss?: (tacticId: string, comment: string) => void;
  readonly?: boolean;
  templates?: DrawingTemplate[];
}

const TacticsBoard: React.FC<Props> = ({ 
  tactic, 
  onSave, 
  onShare, 
  onDiscuss,
  readonly = false,
  templates = []
}) => {
  const { user, isLeader } = useAuth();
  // Removed unused _theme variable
  const toast = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced State
  const [elements, setElements] = useState<DrawingElement[]>(tactic?.elements || []);
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [title, setTitle] = useState(tactic?.title || "");
  const [description, setDescription] = useState(tactic?.description || "");
  const [category, setCategory] = useState<"offense" | "defense" | "special_teams" | "general">(tactic?.category || "general");
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showDiscussionPanel, setShowDiscussionPanel] = useState(false);
  const [animations] = useState<DrawingAnimation[]>(tactic?.animations || []);
  const [leaderComment, setLeaderComment] = useState("");
  const [history, setHistory] = useState<DrawingElement[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [layers, setLayers] = useState<{[key: string]: boolean}>({
    players: true,
    opponents: true,
    ball: true,
    arrows: true,
    zones: true,
    text: true
  });
  // Touch and mobile support
  // Removed unused touchStart state
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  const [isLoading] = useState(false);

  // Enhanced tools for leaders
  const leaderTools = [
    { id: "select", name: "Välj/Flytta", icon: "👆", color: "#64748b", description: "Markera och flytta element" },
    { id: "player", name: "Spelare", icon: "👤", color: "#3b82f6", description: "Hemmalag spelare" },
    { id: "opponent", name: "Motståndare", icon: "🔴", color: "#ef4444", description: "Motståndare" },
    { id: "ball", name: "Boll", icon: "🏒", color: "#f59e0b", description: "Innebandyboll" },
    { id: "arrow", name: "Pil", icon: "➡️", color: "#10b981", description: "Rörelse och passning" },
    { id: "curve", name: "Kurva", icon: "〜", color: "#8b5cf6", description: "Kurvad rörelse" },
    { id: "zone", name: "Zon", icon: "⬜", color: "#06b6d4", description: "Markera områden" },
    { id: "text", name: "Text", icon: "📝", color: "#6b7280", description: "Textnoteringar" },
    { id: "cone", name: "Kon", icon: "🔶", color: "#f97316", description: "Träningskoner" },
    { id: "goal", name: "Mål", icon: "🥅", color: "#dc2626", description: "Målmarkering" },
    { id: "line", name: "Linje", icon: "📏", color: "#475569", description: "Raka linjer" },
    { id: "circle", name: "Cirkel", icon: "⭕", color: "#0891b2", description: "Cirklar och områden" }
  ];

  const playerTools = [
    { id: "select", name: "Välj", icon: "👆", color: "#64748b", description: "Endast visning" }
  ];

  const tools = isLeader() ? leaderTools : playerTools;

  // History management
  const addToHistory = useCallback((newElements: DrawingElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const prevState = history[historyIndex - 1];
      if (prevState) {
        setElements([...prevState]);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      if (nextState) {
        setElements([...nextState]);
      }
    }
  };

  // Responsive canvas sizing
  const drawArrow = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    const headLength = 15;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Rita linje
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Rita pilhuvud
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const drawCurve = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - 30;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(midX, midY, x2, y2);
    ctx.stroke();
    // Rita pilhuvud vid slutet
    const angle = Math.atan2(y2 - midY, x2 - midX);
    const headLength = 10;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  // Move drawElement above drawCanvas
  const drawElement = React.useCallback((ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    ctx.save();
    const teamColors = {
      home: "#4299e1",
      away: "#f56565",
      neutral: "#a0aec0"
    };
    ctx.fillStyle = element.color || teamColors[element.team || "neutral"];
    ctx.strokeStyle = element.color || teamColors[element.team || "neutral"];
    ctx.lineWidth = element.strokeWidth || 2;
    if (selectedElement === element.id) {
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 8;
    }
    switch(element.type) {
      case "player":
      case "opponent":
        ctx.beginPath();
        ctx.arc(element.x, element.y, 15, 0, 2 * Math.PI);
        ctx.fill();
        if (element.playerNumber) {
          ctx.fillStyle = "#fff";
          ctx.font = "12px bold Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            element.playerNumber.toString(), 
            element.x, 
            element.y + 4
          );
        }
        break;
      case "ball":
        ctx.beginPath();
        ctx.arc(element.x, element.y, 8, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case "arrow":
        drawArrow(ctx, element.x, element.y, 
                  element.x + (element.width || 50), 
                  element.y + (element.height || 0));
        break;
      case "curve":
        drawCurve(ctx, element.x, element.y, 
                 element.x + (element.width || 50), 
                 element.y + (element.height || 0));
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(element.x, element.y);
        ctx.lineTo(element.x + (element.width || 50), element.y + (element.height || 0));
        ctx.stroke();
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.width || 20, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case "rectangle":
      case "zone":
        ctx.strokeRect(element.x, element.y, element.width || 50, element.height || 50);
        if (element.type === "zone") {
          ctx.globalAlpha = 0.3;
          ctx.fillRect(element.x, element.y, element.width || 50, element.height || 50);
          ctx.globalAlpha = 1;
        }
        break;
      case "text":
        ctx.fillStyle = element.color || "#fff";
        ctx.font = `${element.fontSize || 14}px Arial`;
        ctx.fillText(element.text || "Text", element.x, element.y);
        break;
      case "cone":
        const size = 10;
        ctx.beginPath();
        ctx.moveTo(element.x, element.y - size);
        ctx.lineTo(element.x - size, element.y + size);
        ctx.lineTo(element.x + size, element.y + size);
        ctx.closePath();
        ctx.fill();
        break;
      case "goal":
        ctx.strokeRect(element.x - 15, element.y - 8, 30, 16);
        break;
    }
    ctx.restore();
  }, [selectedElement]);
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.offsetWidth;
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
          setCanvasSize({
            width: Math.min(containerWidth - 40, 600),
            height: 300
          });
        } else {
          setCanvasSize({
            width: Math.min(containerWidth - 40, 800),
            height: 500
          });
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const drawCanvas = React.useCallback(() => {
    // ...existing code...
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Rensa canvas
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.fillStyle = "#2d5a27";
    ctx.fillRect(0, 0, canvas.width / zoom, canvas.height / zoom);

    // Rita rutnät om aktiverat
    if (showGrid) {
      drawGrid(ctx, canvas.width / zoom, canvas.height / zoom);
    }

    // Rita plan
    drawRink(ctx, canvas.width / zoom, canvas.height / zoom);

    // Rita element
    elements.forEach(element => {
      const shouldShow = layers[getElementLayer(element.type)];
      if (shouldShow) {
        drawElement(ctx, element);
      }
    });

    ctx.restore();
  }, [elements, zoom, showGrid, canvasSize, layers, drawElement]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (readonly || !isLeader()) return;

    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas || !touch) return;

    const rect = canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / zoom;
    const y = (touch.clientY - rect.top) / zoom;

    // Removed setTouchStart

    if (selectedTool === "select") {
      const clickedElement = getElementAtPosition(x, y);
      if (clickedElement) {
        setSelectedElement(clickedElement.id);
        setDraggedElement(clickedElement.id);
        setDragOffset({
          x: x - clickedElement.x,
          y: y - clickedElement.y
        });
      } else {
        setSelectedElement(null);
      }
    } else {
      createNewElement(x, y);
    }

    // Helper to find element at position
    function getElementAtPosition(x: number, y: number): DrawingElement | null {
      // Check from topmost to bottom
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (!el) continue;
        switch (el.type) {
          case "player":
          case "opponent":
            // Circle hit test
            if (Math.hypot(x - el.x, y - el.y) <= 15) return el;
            break;
          case "ball":
            if (Math.hypot(x - el.x, y - el.y) <= 8) return el;
            break;
          case "cone":
            // Triangle hit test (approximate as circle)
            if (Math.hypot(x - el.x, y - el.y) <= 12) return el;
            break;
          case "goal":
            if (
              x >= el.x - 15 &&
              x <= el.x + 15 &&
              y >= el.y - 8 &&
              y <= el.y + 8
            ) return el;
            break;
          case "circle":
            if (Math.hypot(x - el.x, y - el.y) <= (el.width || 20)) return el;
            break;
          case "zone":
          case "rectangle":
            if (
              x >= el.x &&
              x <= el.x + (el.width || 50) &&
              y >= el.y &&
              y <= el.y + (el.height || 50)
            ) return el;
            break;
          case "text":
            // Approximate text hit box
            if (
              x >= el.x - 30 &&
              x <= el.x + 30 &&
              y >= el.y - 15 &&
              y <= el.y + 15
            ) return el;
            break;
          case "arrow":
          case "curve":
          case "line":
            // Approximate line hit test
            const x2 = el.x + (el.width || 50);
            const y2 = el.y + (el.height || 0);
            const dist =
              Math.abs(
                (y2 - el.y) * x - (x2 - el.x) * y + x2 * el.y - y2 * el.x
              ) / Math.hypot(x2 - el.x, y2 - el.y);
            if (dist < 10) return el;
            break;
        }
      }
      return null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!draggedElement || readonly || !isLeader()) return;

    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas || !touch) return;

    const rect = canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / zoom;
    const y = (touch.clientY - rect.top) / zoom;

    setElements(prev => prev.map(element => {
      if (element.id === draggedElement) {
        return {
          ...element,
          x: x - dragOffset.x,
          y: y - dragOffset.y
        };
      }
      return element;
    }));
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (draggedElement) {
      addToHistory(elements);
      setDraggedElement(null);
    }
    // Removed setTouchStart(null)
  };

  // Removed duplicate drawCanvas definition

  const getElementLayer = (type: string): string => {
    switch(type) {
      case "player": return "players";
      case "opponent": return "opponents";
      case "ball": return "ball";
      case "arrow": case "curve": case "line": return "arrows";
      case "zone": case "circle": case "rectangle": return "zones";
      case "text": return "text";
      default: return "text";
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    
    const gridSize = 20;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawRink = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;

    // Yttre gränser
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Mittlinje
    ctx.beginPath();
    ctx.moveTo(width / 2, 20);
    ctx.lineTo(width / 2, height - 20);
    ctx.stroke();

    // Mittcirkel
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 40, 0, 2 * Math.PI);
    ctx.stroke();

    // Målområden
    const goalWidth = 80;
    const goalHeight = 40;
    
    // Vänster mål
    ctx.strokeRect(20, (height - goalHeight) / 2, goalWidth, goalHeight);
    
    // Höger mål
    ctx.strokeRect(width - 20 - goalWidth, (height - goalHeight) / 2, goalWidth, goalHeight);

    // Mållinjer
    ctx.strokeRect(20, 20, goalWidth, height - 40);
    ctx.strokeRect(width - 20 - goalWidth, 20, goalWidth, height - 40);
  };


  // (Removed duplicate drawArrow function. The correct implementation is already defined above.)

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readonly || !isLeader()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (selectedTool === "select") {
      const clickedElement = getElementAtPosition(x, y);
      if (clickedElement) {
        setSelectedElement(clickedElement.id);
        setDraggedElement(clickedElement.id);
        setDragOffset({
          x: x - clickedElement.x,
          y: y - clickedElement.y
        });
      } else {
        setSelectedElement(null);
      }
    } else {
      createNewElement(x, y);
    }

    // Helper to find element at position
    function getElementAtPosition(x: number, y: number): DrawingElement | null {
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (!el) continue;
        switch (el.type) {
          case "player":
          case "opponent":
            if (Math.hypot(x - el.x, y - el.y) <= 15) return el;
            break;
          case "ball":
            if (Math.hypot(x - el.x, y - el.y) <= 8) return el;
            break;
          case "cone":
            if (Math.hypot(x - el.x, y - el.y) <= 12) return el;
            break;
          case "goal":
            if (
              x >= el.x - 15 &&
              x <= el.x + 15 &&
              y >= el.y - 8 &&
              y <= el.y + 8
            ) return el;
            break;
          case "circle":
            if (Math.hypot(x - el.x, y - el.y) <= (el.width || 20)) return el;
            break;
          case "zone":
          case "rectangle":
            if (
              x >= el.x &&
              x <= el.x + (el.width || 50) &&
              y >= el.y &&
              y <= el.y + (el.height || 50)
            ) return el;
            break;
          case "text":
            if (
              x >= el.x - 30 &&
              x <= el.x + 30 &&
              y >= el.y - 15 &&
              y <= el.y + 15
            ) return el;
            break;
          case "arrow":
          case "curve":
          case "line":
            const x2 = el.x + (el.width || 50);
            const y2 = el.y + (el.height || 0);
            const dist =
              Math.abs(
                (y2 - el.y) * x - (x2 - el.x) * y + x2 * el.y - y2 * el.x
              ) / Math.hypot(x2 - el.x, y2 - el.y);
            if (dist < 10) return el;
            break;
        }
      }
      return null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedElement || readonly || !isLeader()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setElements(prev => prev.map(element => {
      if (element.id === draggedElement) {
        return {
          ...element,
          x: x - dragOffset.x,
          y: y - dragOffset.y
        };
      }
      return element;
    }));
  };

  const handleMouseUp = () => {
    if (draggedElement) {
      addToHistory(elements);
      setDraggedElement(null);
    }
  };

  const createNewElement = (x: number, y: number) => {
    if (selectedTool === "player" || selectedTool === "opponent") {
      // Förbättrad prompt för mobila enheter
      const isMobile = window.innerWidth < 768;
      const playerNumber = isMobile ? 
        prompt("Ange tröjnummer (1-99):") : 
        prompt("Ange tröjnummer:");
      
      if (playerNumber && !isNaN(parseInt(playerNumber))) {
        const number = parseInt(playerNumber);
        if (number >= 1 && number <= 99) {
          const newElement: DrawingElement = {
            id: Date.now().toString(),
            type: selectedTool as any,
            x,
            y,
            team: selectedTool === "player" ? selectedTeam : "away",
            playerNumber: number,
            color: selectedTool === "player" ? (selectedTeam === "home" ? "#4299e1" : "#f56565") : "#f56565"
          };
          const newElements = [...elements, newElement];
          setElements(newElements);
          addToHistory(newElements);
          toast?.success(`Spelare ${number} tillagd!`);
        } else {
          toast?.error("Ange ett nummer mellan 1-99");
        }
      }
    } else if (selectedTool === "text") {
      const text = prompt("Ange text:");
      if (text && text.trim()) {
        const newElement: DrawingElement = {
          id: Date.now().toString(),
          type: "text",
          x,
          y,
          text: text.trim(),
          fontSize: 14,
          color: "#fff"
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
        toast?.success("Text tillagd!");
      }
    } else {
      // Standard element
      const newElement: DrawingElement = {
        id: Date.now().toString(),
        type: selectedTool as any,
        x,
        y,
        width: selectedTool === "circle" ? 20 : 50,
        height: selectedTool === "circle" ? 20 : 30,
        color: selectedTeam === "home" ? "#4299e1" : "#f56565"
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      
      const elementNames: {[key: string]: string} = {
        ball: "Boll",
        arrow: "Pil",
        curve: "Kurva",
        zone: "Zon",
        cone: "Kon",
        goal: "Mål",
        line: "Linje",
        circle: "Cirkel"
      };
      
      toast?.success(`${elementNames[selectedTool] || "Element"} tillagt!`);
    }
  };

  const deleteSelectedElement = () => {
    if (selectedElement) {
      const newElements = elements.filter(el => el.id !== selectedElement);
      setElements(newElements);
      addToHistory(newElements);
      setSelectedElement(null);
    }
  };

  const handleSave = () => {
    if (!onSave || !title.trim()) {
      toast?.error("Ange ett namn för taktiken");
      return;
    }

    const tacticToSave: TacticDrawing = {
      id: tactic?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      type: tactic?.type || "formation",
      category,
      createdBy: user?.id || "current-user",
      createdAt: tactic?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements,
      animations,
      notes: description.trim(),
      isPrivate: true,
      sharedWith: [],
      tags: [],
      difficulty: "basic",
      versions: tactic?.versions || []
    };

    onSave(tacticToSave);
    toast?.success("Taktiken sparades!");
  };

  const clearCanvas = () => {
    if (window.confirm("Är du säker på att du vill rensa allt?")) {
      setElements([]);
      addToHistory([]);
      setSelectedElement(null);
    }
  };

  const handleShareTactic = () => {
    if (tactic && onShare) {
      onShare(tactic.id, []); // Implementera spelarval
      setShowShareModal(false);
      toast?.success("Taktiken delades med laget!");
    }
  };

  const handleDiscussWithLeaders = () => {
    if (leaderComment.trim() && onDiscuss && tactic) {
      onDiscuss(tactic.id, leaderComment);
      setLeaderComment("");
      setShowDiscussionPanel(false);
      toast?.success("Kommentar skickad till ledarna!");
    }
  };

  const exportAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skapa en temporär canvas för export
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    exportCanvas.width = canvasSize.width;
    exportCanvas.height = canvasSize.height;

    // Rita vit bakgrund för export
    exportCtx.fillStyle = '#ffffff';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Rita planens innehåll
    exportCtx.drawImage(canvas, 0, 0);

    // Skapa download link
    const link = document.createElement('a');
    link.download = `${title || 'taktik'}.png`;
    link.href = exportCanvas.toDataURL();
    link.click();

    toast?.success("Taktiken exporterad som bild!");
  };

  const resetToTemplate = (template: DrawingTemplate) => {
    if (window.confirm("Ersätta nuvarande taktik med mallen?")) {
      setElements(template.elements);
      setTitle(template.name);
      setDescription(template.description || "");
      // Map template category to tactic category
      const categoryMap: {[key: string]: "offense" | "defense" | "special_teams" | "general"} = {
        "field": "general",
        "zones": "general", 
        "formations": "general",
        "symbols": "general"
      };
      setCategory(categoryMap[template.category] || "general");
      // Keep current type since template doesn't have one
      addToHistory(template.elements);
      setShowTemplateModal(false);
      toast?.success("Mall laddad!");
    }
  };

  return (
    <div className="tactics-board">
      {/* Header */}
      <div className="tactics-board__header">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Taktikens namn..."
          disabled={readonly || !isLeader()}
          className="tactics-board__title-input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beskrivning av taktiken..."
          disabled={readonly || !isLeader()}
          rows={3}
          className="tactics-board__description-textarea"
        />
      </div>

      {/* Tools och kontroller för ledare */}
      {isLeader() && !readonly && (
        <div className="tactics-board__controls">
          {/* Verktyg */}
          <div className="tactics-board__panel">
            <h3 className="tactics-board__panel-title">🛠️ Verktyg</h3>
            <div className="tactics-board__tools-grid">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  title={tool.description}
                  className={`tacticsBoard__toolButton${selectedTool === tool.id ? ' tacticsBoard__toolButtonActive' : ''}`}
                  data-toolcolor={selectedTool === tool.id ? tool.color : undefined}
                >
                  <span className="tacticsBoard__toolIcon">{tool.icon}</span>
                  <span>{tool.name}</span>
                </button>
              ))}
            </div>

            {/* Lagval */}
            <div className="tactics-board__team-selector">
              <h4 className="tacticsBoard__panelTitleSmall">Lag</h4>
              <div className="tactics-board__team-buttons">
                <button
                  onClick={() => setSelectedTeam("home")}
                  className={`tacticsBoard__teamButton${selectedTeam === "home" ? ' tacticsBoard__teamButtonHome' : ''}`}
                >
                  Hemma
                </button>
                <button
                  onClick={() => setSelectedTeam("away")}
                  className={`tacticsBoard__teamButton${selectedTeam === "away" ? ' tacticsBoard__teamButtonAway' : ''}`}
                >
                  Borta
                </button>
              </div>
            </div>
          </div>

          {/* Huvudkontroller */}
          <div className="tactics-board__panel">
            <div className="tactics-board__controls-header">
              <h3 className="tactics-board__panel-title">⚙️ Kontroller</h3>
              <div className="tactics-board__history-buttons">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className={`tacticsBoard__historyButton${historyIndex <= 0 ? '' : ' tacticsBoard__historyButtonActive'}`}
                >
                  ↶ Ångra
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className={`tacticsBoard__historyButton${historyIndex >= history.length - 1 ? '' : ' tacticsBoard__historyButtonActive'}`}
                >
                  ↷ Gör om
                </button>
              </div>
            </div>

            <div className="tactics-board__action-grid">
              <button
                onClick={clearCanvas}
                className="tacticsBoard__actionButton tacticsBoard__actionButtonDanger"
              >
                🗑️ Rensa
              </button>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`tacticsBoard__actionButton${showGrid ? ' tacticsBoard__actionButtonPrimary' : ''}`}
              >
                # Rutnät
              </button>
              <button
                onClick={deleteSelectedElement}
                disabled={!selectedElement}
                className={`tacticsBoard__actionButton${!selectedElement ? '' : ' tacticsBoard__actionButtonDanger'}`}
              >
                ❌ Ta bort
              </button>
              <button
                onClick={exportAsImage}
                className="tacticsBoard__actionButton tacticsBoard__actionButtonPrimary"
              >
                📸 Exportera
              </button>
              {templates.length > 0 && (
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="tacticsBoard__actionButton tacticsBoard__actionButtonSecondary"
                >
                  📋 Mallar
                </button>
              )}
            </div>

            {/* Zoom - Dölj på mobil för touch-zoom */}
            <div className="tactics-board__zoom-controls">
              <span className="tacticsBoard__zoomLabel">🔍 Zoom:</span>
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="tacticsBoard__zoomButton"
              >
                -
              </button>
              <span className="tactics-board__zoom-display">
                <span className="tacticsBoard__zoomDisplay">{Math.round(zoom * 100)}%</span>
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="tacticsBoard__zoomButton"
              >
                +
              </button>
            </div>
          </div>

          {/* Lager */}
          <div className="tactics-board__panel">
            <h3 className="tactics-board__panel-title">👁️ Lager</h3>
            <div className="tactics-board__layers">
              {Object.entries(layers).map(([layer, visible]) => (
                <label key={layer} className="tactics-board__layer-checkbox">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setLayers(prev => ({
                      ...prev,
                      [layer]: e.target.checked
                    }))}
                  />
                  <span className="tacticsBoard__capitalize">
                    {layer === "players" ? "Spelare" :
                     layer === "opponents" ? "Motståndare" :
                     layer === "ball" ? "Boll" :
                     layer === "arrows" ? "Pilar" :
                     layer === "zones" ? "Zoner" : "Text"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="tactics-board__canvas-container" ref={containerRef}>
        {isLoading && (
          <div className="tactics-board__canvas-loading">
            Laddar ritverktyg...
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`tactics-board__canvas ${
            selectedTool === "select" ? 'tactics-board__canvas--select' : 'tactics-board__canvas--draw'
          }`}
        />
      </div>

      {/* Åtgärdsknappar */}
      {isLeader() && !readonly && (
        <div className="tactics-board__actions">
          <div className="tactics-board__action-group">
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className={`tacticsBoard__saveButton${!title.trim() ? ' tacticsBoard__saveButtonDisabled' : ''}`}
            >
              💾 Spara taktik
            </button>
            {tactic && onShare && (
              <button
                onClick={() => setShowShareModal(true)}
                className="tacticsBoard__secondaryButton"
              >
                📤 Dela med lag
              </button>
            )}
            <button
              onClick={() => setShowDiscussionPanel(true)}
              className="tacticsBoard__secondaryButton"
            >
              💬 Diskutera med ledare
            </button>
          </div>
        </div>
      )}

      {/* Info för spelare */}
      {!isLeader() && (
        <div className="tactics-board__player-info">
          <h3 className="tactics-board__player-info-title">
            📋 {title || "Taktik från ledarna"}
          </h3>
          <p className="tactics-board__player-info-description">
            ℹ️ Denna taktik har delats av ledarna. Du kan bara visa den.
          </p>
          {description && (
            <p className="tactics-board__player-info-notes">
              "{description}"
            </p>
          )}
        </div>
      )}

      {/* Delningsmodal */}
      {showShareModal && (
        <div className="tactics-board__modal">
          <div className="tactics-board__modal-content">
            <h3 className="tactics-board__modal-title">📤 Dela taktik</h3>
            <p className="tactics-board__modal-description">
              Taktiken kommer att delas med alla spelare i laget.
            </p>
            <div className="tactics-board__modal-actions">
              <button
                onClick={() => setShowShareModal(false)}
                className="tacticsBoard__modalButton tacticsBoard__modalButtonCancel"
              >
                Avbryt
              </button>
              <button
                onClick={handleShareTactic}
                className="tacticsBoard__modalButton tacticsBoard__modalButtonPrimary"
              >
                Dela nu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diskussionspanel */}
      {showDiscussionPanel && (
        <div className="tactics-board__modal">
          <div className="tactics-board__modal-content">
            <h3 className="tactics-board__modal-title">💬 Diskutera med andra ledare</h3>
            <textarea
              value={leaderComment}
              onChange={(e) => setLeaderComment(e.target.value)}
              placeholder="Skriv din kommentar om taktiken..."
              rows={4}
              className="tactics-board__modal-textarea"
            />
            <div className="tactics-board__modal-actions">
              <button
                onClick={() => {
                  setShowDiscussionPanel(false);
                  setLeaderComment("");
                }}
                className="tacticsBoard__modalButton tacticsBoard__modalButtonCancel"
              >
                Avbryt
              </button>
              <button
                onClick={handleDiscussWithLeaders}
                disabled={!leaderComment.trim()}
                className="tacticsBoard__modalButton tacticsBoard__modalButtonPrimary"
              >
                Skicka kommentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mallmodal */}
      {showTemplateModal && (
        <div className="tactics-board__modal">
          <div className="tactics-board__modal-content">
            <h3 className="tactics-board__modal-title">📋 Välj mall</h3>
            <p className="tactics-board__modal-description">
              Välj en fördefinierad mall att utgå från. Din nuvarande taktik kommer att ersättas.
            </p>
            <div className="tacticsBoard__templateGrid">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => resetToTemplate(template)}
                  className="tacticsBoard__templateBtn"
                >
                  <div className="tacticsBoard__templateName">
                    {template.name}
                  </div>
                  <div className="tacticsBoard__templateDesc">
                    {template.description}
                  </div>
                  <div className="tacticsBoard__templateCat">
                    {template.category}
                  </div>
                </button>
              ))}
            </div>
            <div className="tactics-board__modal-actions">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="tacticsBoard__modalButton tacticsBoard__modalButtonCancel"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TacticsBoard;
