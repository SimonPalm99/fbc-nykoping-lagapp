import React from "react";
import { PostMatchFeedback } from "../../types/postmatch";

const fieldStyle: React.CSSProperties = {
  marginBottom: 10,
  color: "#fff",
  background: "#20242a",
  padding: "8px 12px",
  borderRadius: 6,
};

const PostMatchFeedbackView: React.FC<{ feedback: PostMatchFeedback }> = ({ feedback }) => (
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
    <div style={fieldStyle}><b>Spelar-ID:</b> {feedback.userId}</div>
    <div style={fieldStyle}><b>Match-ID:</b> {feedback.matchId}</div>
    <div style={fieldStyle}><b>Betyg:</b> {feedback.rating}</div>
    <div style={fieldStyle}><b>Kommentar:</b> {feedback.comment}</div>
    <div style={{ color: "#aaa", fontSize: 13, marginTop: 8 }}>Skapad: {new Date(feedback.createdAt).toLocaleString()}</div>
    <style>{`
      @media (max-width: 600px) {
        div { font-size: 15px !important; }
      }
    `}</style>
  </div>
);

export default PostMatchFeedbackView;