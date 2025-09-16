import React from "react";
import { usePostMatch } from "../../context/PostMatchContext";
import PostMatchReportView from "./PostMatchReportView";

const PostMatchReportList: React.FC = () => {
  const { reports } = usePostMatch();

  if (!reports.length) {
    return <div style={{ color: "#bbb", textAlign: "center", marginTop: 20 }}>Inga rapporter än.</div>;
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