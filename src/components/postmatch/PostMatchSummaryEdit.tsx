import React from "react";
import { PostMatchSummary } from "../../types/postmatch";

const fieldStyle: React.CSSProperties = {
  marginBottom: 10,
  color: "#fff",
  background: "#20242a",
  padding: "8px 12px",
  borderRadius: 6,
};

const PostMatchSummaryView: React.FC<{ summary: PostMatchSummary }> = ({ summary }) => (
  <div style={{
    background: "#23272e",
    borderRadius: 9,
    padding: 18,
    marginTop: 20,
    boxShadow: "0 2px 14px #0002",
    maxWidth: 480,
    marginLeft: "auto",
    marginRight: "auto"
  }}>
    <div style={fieldStyle}><b>Match-ID:</b> {summary.matchId}</div>
    <div style={fieldStyle}><b>Sammanfattning:</b> {summary.summary}</div>
    <div style={fieldStyle}><b>Positivt:</b> {summary.positives}</div>
    <div style={fieldStyle}><b>Förbättringar:</b> {summary.improvements}</div>
    <div style={fieldStyle}><b>Tränarens kommentar:</b> {summary.coachNotes}</div>
    <div style={{ color: "#aaa", fontSize: 13, marginTop: 8 }}>Skapad: {new Date(summary.createdAt).toLocaleString()}</div>
    <style>{`
      @media (max-width: 600px) {
        div { font-size: 15px !important; }
      }
    `}</style>
  </div>
);

export default PostMatchSummaryView;