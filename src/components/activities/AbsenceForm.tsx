import React, { useState } from "react";
import styles from "./AbsenceForm.module.css";
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
      <div className={styles.absenceDeadlinePassed}>
        <div className={styles.absenceDeadlinePassedTitle}>
          Anmälningstiden har gått ut
        </div>
        <div className={styles.absenceDeadlinePassedText}>
          Du kan inte längre anmäla frånvaro för denna aktivitet. 
          Kontakta ledarna om du inte kan delta.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.absenceForm}>
      <h3 className={isAbsent ? `${styles.absenceFormTitle} ${styles.absenceFormTitleAbsent}` : `${styles.absenceFormTitle} ${styles.absenceFormTitlePresent}`}>
        {isAbsent ? "Du är anmäld som frånvarande" : "Anmäl frånvaro"}
      </h3>

      {activity.absenceDeadline && (
        <div className={styles.absenceDeadline}>
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
          <div className={styles.absenceInfo}>
            <span className={styles.absenceInfoIcon}>❌</span>
            <div>
              <div className={styles.absenceInfoText}>Anmäld som frånvarande</div>
              <div className={styles.absenceInfoReason}>
                Anledning: {currentParticipation?.absenceReason || "Ingen anledning angiven"}
              </div>
              {currentParticipation?.absenceDate && (
                <div className={styles.absenceInfoDate}>
                  Anmäld: {new Date(currentParticipation.absenceDate).toLocaleDateString('sv-SE')}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCancel}
            disabled={isSubmitting || hasDeadlinePassed}
            className={styles.absenceCancelBtn}
          >
            {isSubmitting ? "Uppdaterar..." : 
             hasDeadlinePassed ? "Anmälningstiden har gått ut" : "Ångra frånvaroanmälan"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.absenceFormField}>
            <label className={styles.absenceFormLabel}>
              Anledning till frånvaro *
            </label>
            <div className={styles.absenceCommonReasons}>
              {commonReasons.map(commonReason => (
                <button
                  key={commonReason}
                  type="button"
                  onClick={() => setReason(commonReason)}
                  className={reason === commonReason ? `${styles.absenceCommonReasonBtn} ${styles.selected}` : styles.absenceCommonReasonBtn}
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
              className={styles.absenceTextarea}
            />
          </div>

          <div className={styles.absenceWarning}>
            <div className={styles.absenceWarningTitle}>⚠️ Viktigt att komma ihåg:</div>
            <ul className={styles.absenceWarningList}>
              <li>Anmäl frånvaro i god tid</li>
              <li>Sen frånvaroanmälan kan medföra böter</li>
              <li>Kontakta ledarna vid akut sjukdom</li>
            </ul>
          </div>

          <div className={styles.absenceSubmitWrapper}>
            <button
              type="submit"
              disabled={!reason.trim() || isSubmitting}
              className={styles.absenceSubmitBtn}
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
