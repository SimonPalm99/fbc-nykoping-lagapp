import React, { useState } from "react";
import { PostMatchReport } from "../../types/postmatch";
import { usePostMatch } from "../../context/PostMatchContext";
import PostMatchReportEdit from "./PostMatchReportEdit";

interface Props {
  report: PostMatchReport;
}

const PostMatchReportView: React.FC<Props> = ({ report }) => {
  const { editReport, deleteReport } = usePostMatch();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <PostMatchReportEdit
        initial={report}
        isEdit
        onDone={r => {
          editReport(report.id, r);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div style={{
      background: "#23272e",
      borderRadius: 9,
      marginBottom: 18,
      padding: 16,
      boxShadow: "0 2px 14px #0002",
      maxWidth: 480,
      marginLeft: "auto",
      marginRight: "auto"
    }}>
      <div style={{color: "#b8f27c", fontWeight: 600, fontSize: 18, marginBottom: 5}}>
        Matchrapport
      </div>
      <div style={{color: "#bbb", fontSize: 13, marginBottom: 8}}>
        Skapad av {report.createdBy} • {report.createdAt.split("T")[0]}
      </div>
      <div style={{ marginBottom: 8 }}><b>Sammanfattning:</b> {report.summary}</div>
      <div style={{ marginBottom: 8 }}>
        <b>Höjdpunkter:</b>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {report.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>
      {report.videoClips.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <b>Videoklipp:</b>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {report.videoClips.map(vc => (
              <li key={vc.id}>
                <a href={vc.url} target="_blank" rel="noopener noreferrer" style={{ color: "#b8f27c" }}>
                  {vc.description || "Se klipp"} {vc.time && `(${vc.time})`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {report.playerFeedback.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <b>Spelarfeedback:</b>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {report.playerFeedback.map((fb, i) => (
              <li key={i}>
                #{fb.playerId}: Betyg {fb.rating} {fb.comment && <>– {fb.comment}</>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {report.notes && (
        <div style={{ marginBottom: 8 }}>
          <b>Anteckningar:</b> {report.notes}
        </div>
      )}
      <div style={{display: "flex", gap: 10, marginTop: 10}}>
        <button style={{
          background: "#b8f27c",
          color: "#23272e",
          border: "none",
          borderRadius: 6,
          fontWeight: 700,
          padding: "6px 24px",
          cursor: "pointer"
        }} onClick={() => setIsEditing(true)}>Redigera</button>
        <button style={{
          background: "#e66",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: 700,
          padding: "6px 24px",
          cursor: "pointer"
        }} onClick={() => deleteReport(report.id)}>Ta bort</button>
      </div>
      <style>{`
        @media (max-width: 600px) {
          div { font-size: 15px !important; }
          button { font-size: 14px !important; padding: 6px 10px !important; }
        }
      `}</style>
    </div>
  );
};

export default PostMatchReportView;