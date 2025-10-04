import React, { useState, useEffect } from "react";
import styles from "./PostMatchReportEdit.module.css";
import { PostMatchReport } from "../../types/postmatch";
import { usePostMatch } from "../../context/PostMatchContext";

interface Props {
  initial?: PostMatchReport;
  isEdit?: boolean;
  onDone?: (report: Omit<PostMatchReport, "id" | "createdAt">) => void;
  onCancel?: () => void;
}

// ...existing code...

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
    <form onSubmit={handleSubmit} className={styles["rapport-form"]}>
      <input
        name="matchId"
        value={form.matchId}
        onChange={handleChange}
        className={styles.input}
        placeholder="Match-ID"
        required
      />
      <input
        name="teamId"
        value={form.teamId}
        onChange={handleChange}
        className={styles.input}
        placeholder="Team-ID"
        required
      />
      <input
        name="createdBy"
        value={form.createdBy}
        onChange={handleChange}
        className={styles.input}
        placeholder="Skapad av"
        required
      />
      <textarea
        name="summary"
        value={form.summary}
        onChange={handleChange}
        className={styles.textarea}
        placeholder="Sammanfattning av matchen"
        required
      />

  <div className={styles.section}>
        <b>Höjdpunkter</b>
  <div className={styles.flexHighlights}>
          <input
            value={highlightInput}
            onChange={e => setHighlightInput(e.target.value)}
            placeholder="Lägg till höjdpunkt"
            className={`${styles.input} ${styles.flex1} ${styles.noMargin}`}
          />
          <button type="button" className={`${styles.button} ${styles["button-small"]} ${styles.noMarginTop}`} onClick={handleAddHighlight}>
            +
          </button>
        </div>
  <ul className={styles["highlight-list"]}>
          {form.highlights.map((h, i) => (
            <li key={i}>
              {h}{" "}
              <button type="button" className={styles["remove-btn"]} onClick={() => handleRemoveHighlight(i)}>
                Ta bort
              </button>
            </li>
          ))}
        </ul>
      </div>

  <div className={styles.section}>
        <b>Videoklipp</b>
  <div className={styles.flexVideoClips}>
          <input value={videoClipUrl} onChange={e => setVideoClipUrl(e.target.value)} placeholder="URL" className={`${styles.input} ${styles.flex2} ${styles.noMargin}`} />
          <input value={videoClipDesc} onChange={e => setVideoClipDesc(e.target.value)} placeholder="Beskrivning" className={`${styles.input} ${styles.flex2} ${styles.noMargin}`} />
          <input value={videoClipTime} onChange={e => setVideoClipTime(e.target.value)} placeholder="Tid (t.ex. 12:30)" className={`${styles.input} ${styles.flex1} ${styles.noMargin}`} />
          <button type="button" className={`${styles.button} ${styles["button-small"]} ${styles.noMarginTop}`} onClick={handleAddVideoClip}>
            +
          </button>
        </div>
  <ul className={styles["highlight-list"]}>
          {form.videoClips.map(vc => (
            <li key={vc.id}>
              <a href={vc.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {vc.description || "Se klipp"} {vc.time && `(${vc.time})`}
              </a>{" "}
              <button type="button" className={styles["remove-btn"]} onClick={() => handleRemoveVideoClip(vc.id)}>
                Ta bort
              </button>
            </li>
          ))}
        </ul>
      </div>

  <div className={styles.section}>
        <b>Spelarfeedback</b>
  <div className={styles.flexFeedback}>
          <input value={feedbackPlayerId} onChange={e => setFeedbackPlayerId(e.target.value)} placeholder="Spelar-ID" className={`${styles.input} ${styles.flex1} ${styles.noMargin}`} />
          <input type="number" min={1} max={5} value={feedbackRating} onChange={e => setFeedbackRating(Number(e.target.value))} placeholder="Betyg 1-5" className={`${styles.input} ${styles.flex1} ${styles.noMargin}`} />
          <input value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} placeholder="Kommentar" className={`${styles.input} ${styles.flex2} ${styles.noMargin}`} />
          <button type="button" className={`${styles.button} ${styles["button-small"]} ${styles.noMarginTop}`} onClick={handleAddFeedback}>
            +
          </button>
        </div>
        <ul className={styles["highlight-list"]}>
          {form.playerFeedback.map((fb, i) => (
            <li key={i}>
              #{fb.playerId}: Betyg {fb.rating} {fb.comment && <>– {fb.comment}</>}
              <button type="button" className={styles["remove-btn"]} onClick={() => handleRemoveFeedback(i)}>
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
        className={styles.textarea}
        placeholder="Anteckningar"
      />
      <button type="submit" className={styles.button}>
        {isEdit ? "Spara ändringar" : "Spara rapport"}
      </button>
      {onCancel && isEdit && (
        <button
          type="button"
          className={`${styles.button} ${styles["button-cancel"]}`}
          onClick={onCancel}
        >
          Avbryt
        </button>
      )}
    </form>
  );
};

export default PostMatchReportEdit;