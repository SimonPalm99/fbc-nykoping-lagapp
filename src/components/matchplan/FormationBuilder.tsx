import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";

interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  position: "Forward" | "Defense" | "Goalkeeper";
  available: boolean;
}

interface FormationPlayer {
  playerId: string;
  x: number;
  y: number;
  position: "Forward" | "Defense" | "Goalkeeper";
  line: number;
}

interface Formation {
  id: string;
  name: string;
  type: "5v5" | "powerplay" | "penalty" | "faceoff";
  players: FormationPlayer[];
  description: string;
  isDefault: boolean;
}

interface Props {
  players: Player[];
  formation?: Formation;
  onSave: (formation: Formation) => void;
  onCancel: () => void;
  readonly?: boolean;
}

const FormationBuilder: React.FC<Props> = ({ 
  players, 
  formation, 
  onSave, 
  onCancel, 
  readonly = false 
}) => {
  const { isLeader } = useAuth();
  const toast = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State
  const [formationPlayers, setFormationPlayers] = useState<FormationPlayer[]>(formation?.players || []);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [formationName, setFormationName] = useState(formation?.name || "");
  const [formationType, setFormationType] = useState<"5v5" | "powerplay" | "penalty" | "faceoff">(formation?.type || "5v5");
  const [description, setDescription] = useState(formation?.description || "");
  const [currentLine, setCurrentLine] = useState(1);
  const [showPlayerPanel, setShowPlayerPanel] = useState(true);

  // Fördefinierade positioner för olika formationer
  const defaultPositions = {
    "5v5": [
      // Startuppställning 5v5
      { position: "Goalkeeper" as const, x: 50, y: 280, line: 1 },
      { position: "Defense" as const, x: 120, y: 200, line: 1 },
      { position: "Defense" as const, x: 120, y: 320, line: 1 },
      { position: "Forward" as const, x: 200, y: 150, line: 1 },
      { position: "Forward" as const, x: 200, y: 260, line: 1 },
      { position: "Forward" as const, x: 200, y: 370, line: 1 }
    ],
    "powerplay": [
      // Powerplay-formation
      { position: "Goalkeeper" as const, x: 50, y: 280, line: 1 },
      { position: "Defense" as const, x: 120, y: 260, line: 1 },
      { position: "Forward" as const, x: 180, y: 180, line: 1 },
      { position: "Forward" as const, x: 180, y: 340, line: 1 },
      { position: "Forward" as const, x: 240, y: 200, line: 1 },
      { position: "Forward" as const, x: 240, y: 320, line: 1 }
    ],
    "penalty": [
      // Boxplay-formation
      { position: "Goalkeeper" as const, x: 50, y: 280, line: 1 },
      { position: "Defense" as const, x: 140, y: 220, line: 1 },
      { position: "Defense" as const, x: 140, y: 340, line: 1 },
      { position: "Forward" as const, x: 200, y: 280, line: 1 }
    ],
    "faceoff": [
      // Faceoff-formation
      { position: "Goalkeeper" as const, x: 50, y: 280, line: 1 },
      { position: "Defense" as const, x: 120, y: 200, line: 1 },
      { position: "Defense" as const, x: 120, y: 360, line: 1 },
      { position: "Forward" as const, x: 200, y: 280, line: 1 }, // Center
      { position: "Forward" as const, x: 180, y: 220, line: 1 },
      { position: "Forward" as const, x: 180, y: 340, line: 1 }
    ]
  };

  useEffect(() => {
    drawFormation();
  }, [formationPlayers, selectedPlayer]);

  const drawFormation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Rensa canvas
    ctx.fillStyle = "#2d5a27";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rita rink
    drawRink(ctx, canvas.width, canvas.height);

    // Rita spelare
    formationPlayers.forEach(formationPlayer => {
      const player = players.find(p => p.id === formationPlayer.playerId);
      if (player) {
        drawPlayer(ctx, formationPlayer, player, formationPlayer.playerId === selectedPlayer);
      }
    });
  };

  const drawRink = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

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
    const goalHeight = 60;
    
    // Vänster mål (vår)
    ctx.strokeRect(20, (height - goalHeight) / 2, goalWidth, goalHeight);
    
    // Höger mål (motståndare)
    ctx.strokeRect(width - 20 - goalWidth, (height - goalHeight) / 2, goalWidth, goalHeight);

    // Mållinjer
    ctx.strokeRect(20, 20, goalWidth, height - 40);
    ctx.strokeRect(width - 20 - goalWidth, 20, goalWidth, height - 40);

    // Faceoff-cirklar
    const faceoffRadius = 20;
    const faceoffY = height / 2;
    
    // Vänster faceoff-cirkel
    ctx.beginPath();
    ctx.arc(width * 0.25, faceoffY, faceoffRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Höger faceoff-cirkel
    ctx.beginPath();
    ctx.arc(width * 0.75, faceoffY, faceoffRadius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, formationPlayer: FormationPlayer, player: Player, isSelected: boolean) => {
    const colors = {
      Forward: "#3b82f6",
      Defense: "#10b981", 
      Goalkeeper: "#f59e0b"
    };

    // Rita spelarens cirkel
    ctx.beginPath();
    ctx.arc(formationPlayer.x, formationPlayer.y, isSelected ? 20 : 16, 0, 2 * Math.PI);
    ctx.fillStyle = colors[formationPlayer.position];
    ctx.fill();
    
    if (isSelected) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Rita tröjnummer
    ctx.fillStyle = "#fff";
    ctx.font = "12px bold Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      player.jerseyNumber.toString(), 
      formationPlayer.x, 
      formationPlayer.y + 4
    );

    // Rita linje-nummer
    ctx.fillStyle = isSelected ? "#fff" : "#a0aec0";
    ctx.font = "10px Arial";
    ctx.fillText(
      `L${formationPlayer.line}`, 
      formationPlayer.x, 
      formationPlayer.y - 25
    );

    // Rita spelarens namn under
    ctx.fillStyle = "#fff";
    ctx.font = "10px Arial";
    ctx.fillText(
      player.name?.split(" ")[0] ?? "Spelare", 
      formationPlayer.x, 
      formationPlayer.y + 35
    );
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readonly || !isLeader()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Kolla om vi klickade på en befintlig spelare
    const clickedPlayer = formationPlayers.find(fp => {
      const distance = Math.sqrt(Math.pow(fp.x - x, 2) + Math.pow(fp.y - y, 2));
      return distance <= 20;
    });

    if (clickedPlayer) {
      setSelectedPlayer(selectedPlayer === clickedPlayer.playerId ? null : clickedPlayer.playerId);
    } else {
      setSelectedPlayer(null);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readonly || !isLeader()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedPlayer = formationPlayers.find(fp => {
      const distance = Math.sqrt(Math.pow(fp.x - x, 2) + Math.pow(fp.y - y, 2));
      return distance <= 20;
    });

    if (clickedPlayer) {
      setDraggedPlayer(clickedPlayer.playerId);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedPlayer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Begränsa till canvas-området
    const boundedX = Math.max(30, Math.min(canvas.width - 30, x));
    const boundedY = Math.max(30, Math.min(canvas.height - 30, y));

    setFormationPlayers(prev => 
      prev.map(fp => 
        fp.playerId === draggedPlayer 
          ? { ...fp, x: boundedX, y: boundedY }
          : fp
      )
    );
  };

  const handleCanvasMouseUp = () => {
    setDraggedPlayer(null);
  };

  const addPlayerToFormation = (playerId: string, position: "Forward" | "Defense" | "Goalkeeper") => {
    if (formationPlayers.find(fp => fp.playerId === playerId)) {
      toast?.warning("Spelaren är redan i formationen");
      return;
    }

    const maxPlayers = formationType === "penalty" ? 4 : 6;
    if (formationPlayers.length >= maxPlayers) {
      toast?.warning(`Max ${maxPlayers} spelare för ${formationType}`);
      return;
    }

    // Hitta nästa lediga position
    const defaultPos = defaultPositions[formationType];
    const existingPositions = formationPlayers.map(fp => ({ x: fp.x, y: fp.y }));
    
    let newPosition = { x: 200, y: 200 };
    for (const pos of defaultPos) {
      const isTaken = existingPositions.some(ep => 
        Math.abs(ep.x - pos.x) < 30 && Math.abs(ep.y - pos.y) < 30
      );
      if (!isTaken) {
        newPosition = { x: pos.x, y: pos.y };
        break;
      }
    }

    const newFormationPlayer: FormationPlayer = {
      playerId,
      x: newPosition.x,
      y: newPosition.y,
      position,
      line: currentLine
    };

    setFormationPlayers(prev => [...prev, newFormationPlayer]);
    toast?.success("Spelare tillagd i formationen");
  };

  const removePlayerFromFormation = (playerId: string) => {
    setFormationPlayers(prev => prev.filter(fp => fp.playerId !== playerId));
    if (selectedPlayer === playerId) {
      setSelectedPlayer(null);
    }
  };

  const updatePlayerLine = (playerId: string, line: number) => {
    setFormationPlayers(prev => 
      prev.map(fp => 
        fp.playerId === playerId ? { ...fp, line } : fp
      )
    );
  };

  const loadTemplate = (type: "5v5" | "powerplay" | "penalty" | "faceoff") => {
    const template = defaultPositions[type];
    const availablePlayers = players.filter(p => p.available);
    
    if (availablePlayers.length < template.length) {
      toast?.warning("Inte tillräckligt med tillgängliga spelare");
      return;
    }

    const newFormation: FormationPlayer[] = template.map((pos, index) => ({
      playerId: availablePlayers[index]?.id ?? "",
      x: pos.x,
      y: pos.y,
      position: pos.position,
      line: pos.line
    }));

    setFormationPlayers(newFormation);
    setFormationType(type);
    toast?.success(`${type}-mall laddad`);
  };

  const handleSave = () => {
    if (!formationName.trim()) {
      toast?.error("Ange ett namn för formationen");
      return;
    }

    if (formationPlayers.length === 0) {
      toast?.error("Lägg till minst en spelare");
      return;
    }

    const newFormation: Formation = {
      id: formation?.id || Date.now().toString(),
      name: formationName.trim(),
      type: formationType,
      players: formationPlayers,
      description: description.trim(),
      isDefault: false
    };

    onSave(newFormation);
  };

  return (
    <div style={{ 
      background: "#1a202c", 
      padding: "20px", 
      borderRadius: "12px",
      color: "#fff"
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h3 style={{ margin: 0 }}>🏒 Formationsbyggare</h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setShowPlayerPanel(!showPlayerPanel)}
            style={{
              padding: "6px 12px",
              background: "#4a5568",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            {showPlayerPanel ? "Dölj spelare" : "Visa spelare"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showPlayerPanel ? "300px 1fr" : "1fr", gap: "20px" }}>
        {/* Spelare Panel */}
        {showPlayerPanel && (
          <div style={{ 
            background: "#2d3748", 
            padding: "16px", 
            borderRadius: "8px",
            height: "fit-content"
          }}>
            <h4 style={{ margin: "0 0 12px 0" }}>Tillgängliga spelare</h4>
            
            {/* Linje-väljare */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>
                Aktuell linje:
              </label>
              <select
                value={currentLine}
                onChange={(e) => setCurrentLine(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "4px 8px",
                  background: "#4a5568",
                  border: "1px solid #6b7280",
                  borderRadius: "4px",
                  color: "#fff",
                  fontSize: "12px"
                }}
              >
                <option value={1}>Linje 1</option>
                <option value={2}>Linje 2</option>
                <option value={3}>Linje 3</option>
                <option value={4}>Linje 4</option>
              </select>
            </div>

            {/* Mallar */}
            <div style={{ marginBottom: "16px" }}>
              <h5 style={{ margin: "0 0 8px 0", fontSize: "12px" }}>Snabbmallar:</h5>
              <div style={{ display: "grid", gap: "4px" }}>
                {["5v5", "powerplay", "penalty", "faceoff"].map(type => (
                  <button
                    key={type}
                    onClick={() => loadTemplate(type as any)}
                    style={{
                      padding: "4px 8px",
                      background: "#4a5568",
                      border: "none",
                      borderRadius: "4px",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    {type === "5v5" ? "5v5" : 
                     type === "powerplay" ? "Powerplay" :
                     type === "penalty" ? "Boxplay" : "Faceoff"}
                  </button>
                ))}
              </div>
            </div>

            {/* Spelare lista */}
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {players.filter(p => p.available).map(player => {
                const isInFormation = formationPlayers.some(fp => fp.playerId === player.id);
                const colors = {
                  Forward: "#3b82f6",
                  Defense: "#10b981", 
                  Goalkeeper: "#f59e0b"
                };
                
                return (
                  <div
                    key={player.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px",
                      margin: "4px 0",
                      background: isInFormation ? "#4a5568" : "#1a202c",
                      borderRadius: "6px",
                      opacity: isInFormation ? 0.7 : 1
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "12px" }}>
                        #{player.jerseyNumber} {player.name}
                      </div>
                      <div style={{ 
                        fontSize: "10px", 
                        color: colors[player.position]
                      }}>
                        {player.position}
                      </div>
                    </div>
                    
                    {isInFormation ? (
                      <button
                        onClick={() => removePlayerFromFormation(player.id)}
                        style={{
                          padding: "2px 6px",
                          background: "#ef4444",
                          border: "none",
                          borderRadius: "4px",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "10px"
                        }}
                      >
                        Ta bort
                      </button>
                    ) : (
                      <button
                        onClick={() => addPlayerToFormation(player.id, player.position)}
                        style={{
                          padding: "2px 6px",
                          background: "#10b981",
                          border: "none",
                          borderRadius: "4px",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "10px"
                        }}
                      >
                        Lägg till
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Canvas och kontroller */}
        <div>
          {/* Formation info */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "16px",
            marginBottom: "16px"
          }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>
                Formationsnamn:
              </label>
              <input
                type="text"
                value={formationName}
                onChange={(e) => setFormationName(e.target.value)}
                placeholder="T.ex. Standard 5v5"
                disabled={readonly}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "#2d3748",
                  border: "1px solid #4a5568",
                  borderRadius: "6px",
                  color: "#fff"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>
                Typ:
              </label>
              <select
                value={formationType}
                onChange={(e) => setFormationType(e.target.value as any)}
                disabled={readonly}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "#2d3748",
                  border: "1px solid #4a5568",
                  borderRadius: "6px",
                  color: "#fff"
                }}
              >
                <option value="5v5">5v5 Jämnt spel</option>
                <option value="powerplay">Powerplay</option>
                <option value="penalty">Boxplay</option>
                <option value="faceoff">Faceoff</option>
              </select>
            </div>
          </div>

          {/* Canvas */}
          <div style={{ 
            textAlign: "center", 
            marginBottom: "16px",
            background: "#2d3748",
            padding: "16px",
            borderRadius: "8px"
          }}>
            <canvas
              ref={canvasRef}
              width={500}
              height={320}
              onClick={handleCanvasClick}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              style={{
                border: "2px solid #4a5568",
                borderRadius: "8px",
                cursor: draggedPlayer ? "grabbing" : "pointer",
                maxWidth: "100%"
              }}
            />
            <p style={{ 
              fontSize: "12px", 
              color: "#a0aec0", 
              margin: "8px 0 0 0" 
            }}>
              {readonly 
                ? "Formation i visningsläge" 
                : "Klicka för att välja, dra för att flytta spelare"
              }
            </p>
          </div>

          {/* Beskrivning */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>
              Beskrivning (valfri):
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beskriv taktiken eller specialinstruktioner..."
              disabled={readonly}
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "#2d3748",
                border: "1px solid #4a5568",
                borderRadius: "6px",
                color: "#fff",
                resize: "vertical"
              }}
            />
          </div>

          {/* Spelarlista per linje */}
          {formationPlayers.length > 0 && (
            <div style={{ 
              background: "#2d3748", 
              padding: "12px", 
              borderRadius: "8px",
              marginBottom: "16px"
            }}>
              <h5 style={{ margin: "0 0 8px 0" }}>Spelare i formation:</h5>
              {[1, 2, 3, 4].map(lineNum => {
                const linePlayers = formationPlayers.filter(fp => fp.line === lineNum);
                if (linePlayers.length === 0) return null;
                
                return (
                  <div key={lineNum} style={{ marginBottom: "8px" }}>
                    <strong style={{ fontSize: "12px" }}>Linje {lineNum}:</strong>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                      {linePlayers.map(fp => {
                        const player = players.find(p => p.id === fp.playerId);
                        if (!player) return null;
                        
                        return (
                          <div
                            key={fp.playerId}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 8px",
                              background: "#1a202c",
                              borderRadius: "4px",
                              fontSize: "12px"
                            }}
                          >
                            <span>#{player.jerseyNumber} {player.name}</span>
                            {!readonly && (
                              <select
                                value={fp.line}
                                onChange={(e) => updatePlayerLine(fp.playerId, Number(e.target.value))}
                                style={{
                                  padding: "2px",
                                  background: "#4a5568",
                                  border: "none",
                                  borderRadius: "2px",
                                  color: "#fff",
                                  fontSize: "10px"
                                }}
                              >
                                <option value={1}>L1</option>
                                <option value={2}>L2</option>
                                <option value={3}>L3</option>
                                <option value={4}>L4</option>
                              </select>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Kontrollknappar */}
          {!readonly && (
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={onCancel}
                style={{
                  padding: "8px 16px",
                  background: "#6b7280",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Avbryt
              </button>
              <button
                onClick={handleSave}
                disabled={!formationName.trim() || formationPlayers.length === 0}
                style={{
                  padding: "8px 16px",
                  background: (!formationName.trim() || formationPlayers.length === 0) ? "#4a5568" : "#10b981",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: (!formationName.trim() || formationPlayers.length === 0) ? "not-allowed" : "pointer"
                }}
              >
                💾 Spara formation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormationBuilder;
