import React from "react";
import { PostMatchSummary } from "../../types/postmatch";
import styles from "./PostMatchSummaryEdit.module.css";

const PostMatchSummaryView: React.FC<{ summary: PostMatchSummary }> = ({ summary }) => (
  <div className={styles["sammanfattning-container"]}>
    <div className={styles.falt}><b>Match-ID:</b> {summary.matchId}</div>
    <div className={styles.falt}><b>Sammanfattning:</b> {summary.summary}</div>
    <div className={styles.falt}><b>Positivt:</b> {summary.positives}</div>
    <div className={styles.falt}><b>Förbättringar:</b> {summary.improvements}</div>
    <div className={styles.falt}><b>Tränarens kommentar:</b> {summary.coachNotes}</div>
    <div className={styles.skapad}>Skapad: {new Date(summary.createdAt).toLocaleString()}</div>
  </div>
);

export default PostMatchSummaryView;