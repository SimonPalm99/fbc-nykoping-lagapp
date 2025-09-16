import React, { useState } from "react";
import { Activity } from "../../types/activity";
import { useAuth } from "../../context/AuthContext";
import { useActivity } from "../../context/ActivityContext";
import { useUser } from "../../context/UserContext";
import { LoadingButton } from "../ui/LoadingButton";
import { useToast } from "../ui/Toast";
import "./ActivityResponseCard.css";

interface Props {
  activity: Activity;
  onClose?: () => void;
}

const ActivityResponseCard: React.FC<Props> = ({ activity, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { respondToActivity, addComment } = useActivity();
  const { addTrainingLog } = useUser();
  const { success, error: showError } = useToast();
  
  const [responseLoading, setResponseLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("");
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="activity-response-card">
        <p>Du måste vara inloggad för att svara på aktiviteter.</p>
      </div>
    );
  }

  const currentUserResponse = activity.participants.find(p => p.userId === user.id);
  const attendingCount = activity.participants.filter(p => p.status === "attending").length;
  const absentCount = activity.participants.filter(p => p.status === "absent").length;
  
  const isUpcoming = new Date(activity.date) > new Date();
  const isPastDeadline = activity.absenceDeadline ? new Date(activity.absenceDeadline) < new Date() : false;

  const handleResponse = async (status: "attending" | "absent" | "maybe") => {
    if (!user) return;
    
    setResponseLoading(true);
    try {
      if (status === "absent" && !absenceReason && isUpcoming) {
        setShowAbsenceForm(true);
        setResponseLoading(false);
        return;
      }

      // Callback to handle training log creation
      const onTrainingAttend = (trainingData: any) => {
        if (addTrainingLog) {
          addTrainingLog(user.id, trainingData);
          success(`Träningslogg skapad automatiskt för ${activity.title}`);
        }
      };

      respondToActivity(
        activity.id, 
        user.id, 
        status, 
        status === "absent" ? absenceReason : undefined,
        onTrainingAttend
      );
      
      const statusText = {
        attending: "anmält dig",
        absent: "avanmält dig",
        maybe: "markerat kanske"
      }[status];
      
      success(`Du har ${statusText} för ${activity.title}`);
      setShowAbsenceForm(false);
      setAbsenceReason("");
    } catch (err) {
      showError("Något gick fel när du svarade på aktiviteten");
    }
    setResponseLoading(false);
  };

  const handleAddComment = async () => {
    if (!user || !commentText.trim()) return;
    
    setCommentLoading(true);
    try {
      addComment(activity.id, user.id, commentText.trim());
      setCommentText("");
      success("Kommentar tillagd");
    } catch (err) {
      showError("Kunde inte lägga till kommentar");
    }
    setCommentLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "attending": return "✅";
      case "absent": return "❌"; 
      case "maybe": return "❓";
      default: return "⏳";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "attending": return "Kommer";
      case "absent": return "Kommer ej";
      case "maybe": return "Kanske";
      default: return "Inte svarat";
    }
  };

  return (
    <div className="activity-response-card">
      {/* Aktivitetshuvud */}
      <div className="activity-header">
        <div className="activity-title-section">
          <h2 className="activity-title">
            {activity.title}
            {activity.important && <span className="important-badge">Viktigt!</span>}
            {activity.canceled && <span className="canceled-badge">Inställt</span>}
          </h2>
          <span className="activity-type">{activity.type}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        )}
      </div>

      {/* Aktivitetsinfo */}
      <div className="activity-info">
        <div className="info-row">
          <span className="info-label">📅 Datum:</span>
          <span className="info-value">
            {new Date(activity.date).toLocaleDateString('sv-SE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        
        {activity.startTime && (
          <div className="info-row">
            <span className="info-label">🕐 Tid:</span>
            <span className="info-value">
              {activity.startTime}{activity.endTime && ` - ${activity.endTime}`}
            </span>
          </div>
        )}
        
        {activity.location && (
          <div className="info-row">
            <span className="info-label">📍 Plats:</span>
            <span className="info-value">
              {activity.location}
              {activity.mapUrl && (
                <a 
                  href={activity.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  🗺️ Karta
                </a>
              )}
            </span>
          </div>
        )}

        {activity.description && (
          <div className="info-row">
            <span className="info-label">📝 Beskrivning:</span>
            <span className="info-value">{activity.description}</span>
          </div>
        )}

        {activity.absenceDeadline && isUpcoming && (
          <div className="info-row">
            <span className="info-label">⏰ Sista dag att avanmäla:</span>
            <span className={`info-value ${isPastDeadline ? 'deadline-passed' : ''}`}>
              {new Date(activity.absenceDeadline).toLocaleDateString('sv-SE')}
              {isPastDeadline && " (Passerad)"}
            </span>
          </div>
        )}
      </div>

      {/* Nuvarande svar */}
      {currentUserResponse && (
        <div className="current-response">
          <h3>Ditt svar:</h3>
          <div className="response-status">
            {getStatusIcon(currentUserResponse.status)} {getStatusText(currentUserResponse.status)}
            {currentUserResponse.absenceReason && (
              <div className="absence-reason">
                <strong>Anledning:</strong> {currentUserResponse.absenceReason}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Svarsalternativ */}
      {isUpcoming && !activity.canceled && (
        <div className="response-section">
          <h3>Kommer du?</h3>
          
          {showAbsenceForm ? (
            <div className="absence-form">
              <label htmlFor="absence-reason">Anledning till frånvaro:</label>
              <textarea
                id="absence-reason"
                value={absenceReason}
                onChange={(e) => setAbsenceReason(e.target.value)}
                placeholder="T.ex. sjuk, jobbar, semester..."
                rows={3}
              />
              <div className="absence-form-buttons">
                <LoadingButton
                  onClick={() => handleResponse("absent")}
                  variant="outline"
                  loading={responseLoading}
                >
                  Avanmäl med anledning
                </LoadingButton>
                <button 
                  onClick={() => setShowAbsenceForm(false)}
                  className="cancel-button"
                >
                  Avbryt
                </button>
              </div>
            </div>
          ) : (
            <div className="response-buttons">
              <LoadingButton
                onClick={() => handleResponse("attending")}
                variant={currentUserResponse?.status === "attending" ? "primary" : "outline"}
                loading={responseLoading}
                disabled={isPastDeadline}
              >
                ✅ Kommer
              </LoadingButton>
              
              <LoadingButton
                onClick={() => handleResponse("maybe")}
                variant={currentUserResponse?.status === "maybe" ? "primary" : "outline"}
                loading={responseLoading}
                disabled={isPastDeadline}
              >
                ❓ Kanske
              </LoadingButton>
              
              <LoadingButton
                onClick={() => handleResponse("absent")}
                variant={currentUserResponse?.status === "absent" ? "primary" : "outline"}
                loading={responseLoading}
                disabled={isPastDeadline}
              >
                ❌ Kommer ej
              </LoadingButton>
            </div>
          )}
          
          {isPastDeadline && (
            <p className="deadline-warning">
              ⚠️ Deadline för svar har passerat
            </p>
          )}
        </div>
      )}

      {/* Närvaroöversikt */}
      <div className="attendance-overview">
        <h3>Närvaroöversikt ({activity.participants.length} svar)</h3>
        <div className="attendance-stats">
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span className="stat-text">Kommer: {attendingCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">❌</span>
            <span className="stat-text">Kommer ej: {absentCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">❓</span>
            <span className="stat-text">Kanske: {activity.participants.filter(p => p.status === "maybe").length}</span>
          </div>
        </div>
      </div>

      {/* Kommentarer */}
      <div className="comments-section">
        <h3>Kommentarer ({activity.comments.length})</h3>
        
        {/* Lägg till kommentar */}
        <div className="add-comment">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Skriv en kommentar..."
            rows={2}
          />
          <LoadingButton
            onClick={handleAddComment}
            disabled={!commentText.trim()}
            loading={commentLoading}
            variant="primary"
          >
            Skicka kommentar
          </LoadingButton>
        </div>

        {/* Kommentarlista */}
        <div className="comments-list">
          {activity.comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-author">
                  {comment.userId === user.id ? "Du" : comment.userId}
                </span>
                <span className="comment-time">
                  {new Date(comment.timestamp).toLocaleString('sv-SE')}
                </span>
                {comment.isLeaderOnly && (
                  <span className="leader-only-badge">Ledare</span>
                )}
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))}
          
          {activity.comments.length === 0 && (
            <p className="no-comments">Inga kommentarer än</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityResponseCard;
