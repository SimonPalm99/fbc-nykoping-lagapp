import React from "react";
import styles from "./PostMatchReportList.module.css";
import { usePostMatch } from "../../context/PostMatchContext";
import PostMatchReportView from "./PostMatchReportView";

const PostMatchReportList: React.FC = () => {
  const { reports } = usePostMatch();

  if (!reports.length) {
    return <div className={styles["rapport-list-tom"]}>Inga rapporter än.</div>;
  }

  return (
    <div>
      {reports.map(report => (
        <PostMatchReportView key={report.id} report={report} />
      ))}
    </div>
  );
};

export default PostMatchReportList;