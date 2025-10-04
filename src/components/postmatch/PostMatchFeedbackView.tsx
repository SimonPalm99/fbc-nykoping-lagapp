import React from "react";
import { PostMatchFeedback } from "../../types/postmatch";
import styles from "./PostMatchFeedbackView.module.css";

const PostMatchFeedbackView: React.FC<{ feedback: PostMatchFeedback }> = ({ feedback }) => (
  <div className={styles.feedbackContainer}>
    <div className={styles.field}><b>Spelar-ID:</b> {feedback.userId}</div>
    <div className={styles.field}><b>Match-ID:</b> {feedback.matchId}</div>
    <div className={styles.field}><b>Betyg:</b> {feedback.rating}</div>
    <div className={styles.field}><b>Kommentar:</b> {feedback.comment}</div>
    <div className={styles.created}>Skapad: {new Date(feedback.createdAt).toLocaleString()}</div>
  </div>
);

export default PostMatchFeedbackView;