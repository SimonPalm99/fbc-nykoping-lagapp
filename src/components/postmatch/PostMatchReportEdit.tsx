import React, { useState, useEffect } from "react";
import { PostMatchReport } from "../../types/postmatch";
import { usePostMatch } from "../../context/PostMatchContext";

interface Props {
  initial?: PostMatchReport;
  isEdit?: boolean;
  onDone?: (report: Omit<PostMatchReport, "id" | "createdAt">) => void;
  onCancel?: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  margin: "6px 0 12px 0",
  borderRadius: 6,
  border: "1px solid #345",
  background: "#23272e",
  color: "#fff",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  background: "#b8f27c",
  color: "#222",
  border: "none",
  borderRadius: 6,
  padding: "10px",
  fontWeight: 700,
  fontSize: 17,
  marginTop: 10,
  cursor: "pointer",
};

const PostMatchReportEdit: React.FC<Props> = ({ initial, isEdit, onDone, onCancel }) => {
  const { addReport } = usePostMatch();
  const [form, setForm] = useState<Omit<PostMatchReport, "id" | "createdAt">>({
    matchId: initial?.matchId || "",
    teamId: initial?.teamId || "",
    createdBy: initial?.createdBy || "SimonPalm99",
    summary: initial?.summary || "",
    highlights: initial?.highlights || [],
    videoClips: initial?.videoClips || [],
    playerFeedback: initial?.playerFeedback || [],
    notes: initial?.notes || ""
  });

  const [highlightInput, setHighlightInput] = useState("");
  const [videoClipUrl, setVideoClipUrl] = useState("");
  const [videoClipDesc, setVideoClipDesc] = useState("");
  const [videoClipTime, setVideoClipTime] = useState("");
  const [feedbackPlayerId, setFeedbackPlayerId] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<number>(1);
  const [feedbackComment, setFeedbackComment] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        matchId: initial.matchId,
        teamId: initial.teamId,
        createdBy: initial.createdBy,
        summary: initial.summary,
        highlights: initial.highlights,
        videoClips: initial.videoClips,
        playerFeedback: initial.playerFeedback,
        notes: initial.notes || ""
      });
    }
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setForm(prev => ({ ...prev, highlights: [...prev.highlights, highlightInput.trim()] }));
      setHighlightInput("");
    }
  };

  const handleRemoveHighlight = (i: number) => {
    setForm(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== i)
    }));
  };

  const handleAddVideoClip = () => {
    if (videoClipUrl.trim()) {
      setForm(prev => ({
        ...prev,
        videoClips: [
          ...prev.videoClips,
          {
            id: (Math.random() * 1e9).toFixed(0),
            url: videoClipUrl,
            description: videoClipDesc,
            time: videoClipTime
          }
        ]
      }));
      setVideoClipUrl("");
      setVideoClipDesc("");
      setVideoClipTime("");
    }
  };

  const handleRemoveVideoClip = (id: string) => {
    setForm(prev => ({
      ...prev,
      videoClips: prev.videoClips.filter(vc => vc.id !== id)
    }));
  };

  const handleAddFeedback = () => {
    if (feedbackPlayerId.trim()) {
      setForm(prev => ({
        ...prev,
        playerFeedback: [
          ...prev.playerFeedback,
          {
            playerId: feedbackPlayerId,
            rating: feedbackRating,
            comment: feedbackComment
          }
        ]
      }));
      setFeedbackPlayerId("");
      setFeedbackRating(1);
      setFeedbackComment("");
    }
  };

  const handleRemoveFeedback = (i: number) => {
    setForm(prev => ({
      ...prev,
      playerFeedback: prev.playerFeedback.filter((_, idx) => idx !== i)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && onDone) {
      onDone(form);
    } else {
      addReport(form);
      setForm({
        matchId: "",
        teamId: "",
        createdBy: "SimonPalm99",
        summary: "",
        highlights: [],
        videoClips: [],
        playerFeedback: [],
        notes: ""
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "#23272e",
      borderRadius: 9,
      padding: 18,
      marginTop: 20,
      boxShadow: "0 2px 14px #0002",
      maxWidth: 480,
      marginLeft: "auto",
      marginRight: "auto"
    }}>
      <input
        name="matchId"
        value={form.matchId}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Match-ID"
        required
      />
      <input
        name="teamId"
        value={form.teamId}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Team-ID"
        required
      />
      <input
        name="createdBy"
        value={form.createdBy}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Skapad av"
        required
      />
      <textarea
        name="summary"
        value={form.summary}
        onChange={handleChange}
        style={{ ...inputStyle, minHeight: 40, resize: "vertical" }}
        placeholder="Sammanfattning av matchen"
        required
      />

      <div style={{ marginBottom: 10 }}>
        <b>Höjdpunkter</b>
        <div style={{ display: "flex", gap: 7, marginTop: 6 }}>
          <input
            value={highlightInput}
            onChange={e => setHighlightInput(e.target.value)}
            placeholder="Lägg till höjdpunkt"
            style={{ ...inputStyle, margin: 0, flex: 1 }}
          />
          <button type="button" style={{ ...buttonStyle, width: "auto", padding: "7px 12px", marginTop: 0 }} onClick={handleAddHighlight}>
            +
          </button>
        </div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {form.highlights.map((h, i) => (
            <li key={i}>
              {h}{" "}
              <button type="button" style={{ marginLeft: 7, color: "#e66", background: "none", border: "none", cursor: "pointer" }} onClick={() => handleRemoveHighlight(i)}>
                Ta bort
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: 10 }}>
        <b>Videoklipp</b>
        <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
          <input value={videoClipUrl} onChange={e => setVideoClipUrl(e.target.value)} placeholder="URL" style={{ ...inputStyle, margin: 0, flex: 2 }} />
          <input value={videoClipDesc} onChange={e => setVideoClipDesc(e.target.value)} placeholder="Beskrivning" style={{ ...inputStyle, margin: 0, flex: 2 }} />
          <input value={videoClipTime} onChange={e => setVideoClipTime(e.target.value)} placeholder="Tid (t.ex. 12:30)" style={{ ...inputStyle, margin: 0, flex: 1 }} />
          <button type="button" style={{ ...buttonStyle, width: "auto", padding: "7px 12px", marginTop: 0 }} onClick={handleAddVideoClip}>
            +
          </button>
        </div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {form.videoClips.map(vc => (
            <li key={vc.id}>
              <a href={vc.url} target="_blank" rel="noopener noreferrer" style={{ color: "#b8f27c" }}>
                {vc.description || "Se klipp"} {vc.time && `(${vc.time})`}
              </a>{" "}
              <button type="button" style={{ marginLeft: 7, color: "#e66", background: "none", border: "none", cursor: "pointer" }} onClick={() => handleRemoveVideoClip(vc.id)}>
                Ta bort
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: 10 }}>
        <b>Spelarfeedback</b>
        <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
          <input value={feedbackPlayerId} onChange={e => setFeedbackPlayerId(e.target.value)} placeholder="Spelar-ID" style={{ ...inputStyle, margin: 0, flex: 1 }} />
          <input type="number" min={1} max={5} value={feedbackRating} onChange={e => setFeedbackRating(Number(e.target.value))} placeholder="Betyg 1-5" style={{ ...inputStyle, margin: 0, flex: 1 }} />
          <input value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} placeholder="Kommentar" style={{ ...inputStyle, margin: 0, flex: 2 }} />
          <button type="button" style={{ ...buttonStyle, width: "auto", padding: "7px 12px", marginTop: 0 }} onClick={handleAddFeedback}>
            +
          </button>
        </div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {form.playerFeedback.map((fb, i) => (
            <li key={i}>
              #{fb.playerId}: Betyg {fb.rating} {fb.comment && <>– {fb.comment}</>}
              <button type="button" style={{ marginLeft: 7, color: "#e66", background: "none", border: "none", cursor: "pointer" }} onClick={() => handleRemoveFeedback(i)}>
                Ta bort
              </button>
            </li>
          ))}
        </ul>
      </div>

      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        style={{ ...inputStyle, minHeight: 30, resize: "vertical" }}
        placeholder="Anteckningar"
      />
      <button type="submit" style={buttonStyle}>
        {isEdit ? "Spara ändringar" : "Spara rapport"}
      </button>
      {onCancel && isEdit && (
        <button
          type="button"
          style={{
            ...buttonStyle,
            background: "#e66",
            color: "#fff",
            marginTop: 10,
          }}
          onClick={onCancel}
        >
          Avbryt
        </button>
      )}
      <style>{`
        @media (max-width: 600px) {
          form { padding: 8px !important; }
          input, textarea { font-size: 15px !important; }
          button { font-size: 15px !important; }
        }
      `}</style>
    </form>
  );
};

export default PostMatchReportEdit;