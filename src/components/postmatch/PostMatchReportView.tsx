import React, { useState } from "react";
import styles from "./PostMatchReportView.module.css";
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
    <div className={styles["rapport-view"]}>
      <div className={styles.rubrik}>Matchrapport</div>
      <div className={styles.skapad}>
        Skapad av {report.createdBy} • {report.createdAt.split("T")[0]}
      </div>
      <div className={styles.section}><b>Sammanfattning:</b> {report.summary}</div>
      <div className={styles.section}>
        <b>Höjdpunkter:</b>
        <ul className={styles.list}>
          {report.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>
      {report.videoClips.length > 0 && (
        <div className={styles.section}>
          <b>Videoklipp:</b>
          <ul className={styles.list}>
            {report.videoClips.map(vc => (
              <li key={vc.id}>
                <a href={vc.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {vc.description || "Se klipp"} {vc.time && `(${vc.time})`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {report.playerFeedback.length > 0 && (
        <div className={styles.section}>
          <b>Spelarfeedback:</b>
          <ul className={styles.list}>
            {report.playerFeedback.map((fb, i) => (
              <li key={i}>
                #{fb.playerId}: Betyg {fb.rating} {fb.comment && <>– {fb.comment}</>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {report.notes && (
        <div className={styles.section}>
          <b>Anteckningar:</b> {report.notes}
        </div>
      )}
      <div className={styles.knapprad}>
        <button className={styles.knapp} onClick={() => setIsEditing(true)}>Redigera</button>
        <button className={`${styles.knapp} ${styles["knapp-ta-bort"]}`} onClick={() => deleteReport(report.id)}>Ta bort</button>
      </div>
    </div>
  );
};

export default PostMatchReportView;