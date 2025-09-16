import React, { useState } from "react";
import { Activity } from "../../types/activity";

interface Props {
  activity: Activity;
  currentUserId: string;
  onSubmitAbsence: (activityId: string, reason: string) => void;
  onCancelAbsence: (activityId: string) => void;
}

const AbsenceForm: React.FC<Props> = ({ 
  activity, 
  currentUserId, 
  onSubmitAbsence, 
  onCancelAbsence 
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentParticipation = activity.participants.find(p => p.userId === currentUserId);
  const isAbsent = currentParticipation?.status === "absent";
  const hasDeadlinePassed = activity.absenceDeadline ? 
    new Date() > new Date(activity.absenceDeadline) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitAbsence(activity.id, reason.trim());
      setReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setIsSubmitting(true);
    try {
      await onCancelAbsence(activity.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonReasons = [
    "Sjuk",
    "Skada",
    "Arbete",
    "Skola/studier",
    "Familjeförhållanden",
    "Semester",
    "Annat engagemang"
  ];

  if (hasDeadlinePassed && !isAbsent) {
    return (
      <div style={{
        background: "#fed7d7",
        color: "#c53030",
        padding: "12px",
        borderRadius: "8px",
        margin: "16px 0",
        textAlign: "center"
      }}>
        <div style={{ fontWeight: 600, marginBottom: "4px" }}>
          Anmälningstiden har gått ut
        </div>
        <div style={{ fontSize: "14px" }}>
          Du kan inte längre anmäla frånvaro för denna aktivitet. 
          Kontakta ledarna om du inte kan delta.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#2d3748",
      padding: "20px",
      borderRadius: "12px",
      margin: "16px 0",
      color: "#fff"
    }}>
      <h3 style={{ 
        margin: "0 0 16px 0", 
        color: isAbsent ? "#f56565" : "#b8f27c",
        fontSize: "18px"
      }}>
        {isAbsent ? "Du är anmäld som frånvarande" : "Anmäl frånvaro"}
      </h3>

      {activity.absenceDeadline && (
        <div style={{
          background: "#ed8936",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "14px",
          marginBottom: "16px",
          fontWeight: 500
        }}>
          ⏰ Sista anmälan: {new Date(activity.absenceDeadline).toLocaleDateString('sv-SE', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}

      {isAbsent ? (
        <div>
          <div style={{
            background: "#f56565",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center"
          }}>
            <span style={{ fontSize: "20px", marginRight: "8px" }}>❌</span>
            <div>
              <div style={{ fontWeight: 600 }}>Anmäld som frånvarande</div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                Anledning: {currentParticipation?.absenceReason || "Ingen anledning angiven"}
              </div>
              {currentParticipation?.absenceDate && (
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  Anmäld: {new Date(currentParticipation.absenceDate).toLocaleDateString('sv-SE')}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCancel}
            disabled={isSubmitting || hasDeadlinePassed}
            style={{
              background: hasDeadlinePassed ? "#4a5568" : "#48bb78",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: hasDeadlinePassed ? "not-allowed" : "pointer",
              fontWeight: 600,
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? "Uppdaterar..." : 
             hasDeadlinePassed ? "Anmälningstiden har gått ut" : "Ångra frånvaroanmälan"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: 500,
              fontSize: "14px"
            }}>
              Anledning till frånvaro *
            </label>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
              {commonReasons.map(commonReason => (
                <button
                  key={commonReason}
                  type="button"
                  onClick={() => setReason(commonReason)}
                  style={{
                    background: reason === commonReason ? "#3182ce" : "transparent",
                    color: "#fff",
                    border: "1px solid #4a5568",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {commonReason}
                </button>
              ))}
            </div>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ange anledning till frånvaro..."
              required
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                background: "#1a202c",
                border: "1px solid #4a5568",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </div>

          <div style={{
            background: "#fed7d7",
            color: "#c53030",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px"
          }}>
            <div style={{ fontWeight: 600, marginBottom: "4px" }}>
              ⚠️ Viktigt att komma ihåg:
            </div>
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              <li>Anmäl frånvaro i god tid</li>
              <li>Sen frånvaroanmälan kan medföra böter</li>
              <li>Kontakta ledarna vid akut sjukdom</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="submit"
              disabled={!reason.trim() || isSubmitting}
              style={{
                background: !reason.trim() ? "#4a5568" : "#f56565",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: !reason.trim() ? "not-allowed" : "pointer",
                fontWeight: 600,
                opacity: isSubmitting ? 0.7 : 1,
                flex: 1
              }}
            >
              {isSubmitting ? "Anmäler..." : "Anmäl frånvaro"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AbsenceForm;
