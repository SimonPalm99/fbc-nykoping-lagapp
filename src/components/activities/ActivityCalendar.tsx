import React, { useState } from "react";
import { Activity } from "../../types/activity";
import { useAuth } from "../../context/AuthContext";

interface Props {
  activities: Activity[];
  onActivityClick?: (activity: Activity) => void;
  onDateClick?: (date: string) => void;
  showFilters?: boolean;
}

type ViewMode = 'month' | 'week' | 'day';
type FilterType = 'all' | 'träning' | 'match' | 'cup' | 'annat';

const ActivityCalendar: React.FC<Props> = ({ 
  activities, 
  onActivityClick, 
  onDateClick, 
  showFilters = true 
}) => {
  const { isLeader } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrera aktiviteter
  const filteredActivities = activities.filter(activity => {
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesSearch = !searchTerm || 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  // Gruppera aktiviteter per datum
  const byDate: Record<string, Activity[]> = {};
  filteredActivities.forEach(a => {
    if (!byDate[a.date]) byDate[a.date] = [];
    byDate[a.date]?.push(a);
  });

  // Sortera aktiviteter inom varje datum efter starttid
  Object.keys(byDate).forEach(date => {
    const activities = byDate[date];
    if (activities) {
      activities.sort((a, b) => {
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
      });
    }
  });

  const getWeekDates = (date: Date): Date[] => {
    const week: Date[] = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Måndag som första dag
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getMonthDates = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates: Date[] = [];
    
    // Lägg till dagar från föregående månad för att fylla ut veckan
    const startWeekDay = firstDay.getDay() || 7; // Måndag = 1
    for (let i = startWeekDay - 1; i > 0; i--) {
      const prevDate = new Date(firstDay);
      prevDate.setDate(firstDay.getDate() - i);
      dates.push(prevDate);
    }
    
    // Lägg till alla dagar i månaden
    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push(new Date(year, month, day));
    }
    
    // Lägg till dagar från nästa månad för att fylla ut veckan
    const remainingDays = 42 - dates.length; // 6 veckor * 7 dagar
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(lastDay);
      nextDate.setDate(lastDay.getDate() + i);
      dates.push(nextDate);
    }
    
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date, referenceDate: Date) => {
    return date.getMonth() === referenceDate.getMonth() && 
           date.getFullYear() === referenceDate.getFullYear();
  };

  const getActivityStyle = (activity: Activity) => ({
    backgroundColor: activity.color || '#22c55e',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    marginBottom: '2px',
    cursor: 'pointer',
    border: activity.important ? '2px solid #fbbf24' : 'none',
    fontWeight: activity.important ? '700' : '500'
  });

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    switch (viewMode) {
      case 'month':
        newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setSelectedDate(newDate);
  };

  const renderMonthView = () => {
    const monthDates = getMonthDates(selectedDate);
    const weekDays = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
    
    return (
      <div className="month-view">
        <div className="weekday-headers">
          {weekDays.map(day => (
            <div key={day} className="weekday-header">{day}</div>
          ))}
        </div>
        
        <div className="month-grid">
          {monthDates.map((date, index) => {
            const dateStr = formatDate(date);
            const dayActivities = dateStr ? (byDate[dateStr] || []) : [];
            const isCurrentMonth = isSameMonth(date, selectedDate);
            
            return (
              <div
                key={index}
                className={`calendar-day ${isToday(date) ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                onClick={() => dateStr && onDateClick?.(dateStr)}
              >
                <div className="day-number">{date.getDate()}</div>
                <div className="day-activities">
                  {dayActivities.slice(0, 2).map((activity: Activity) => (
                    <div
                      key={activity.id}
                      className="activity-dot"
                      style={getActivityStyle(activity)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivityClick?.(activity);
                      }}
                      title={`${activity.title} ${activity.startTime ? `kl ${activity.startTime}` : ''}`}
                    >
                      {activity.title.substring(0, 12)}
                      {activity.title.length > 12 ? '...' : ''}
                    </div>
                  ))}
                  {dayActivities.length > 2 && (
                    <div className="more-activities">
                      +{dayActivities.length - 2} till
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(selectedDate);
    
    return (
      <div className="week-view">
        {weekDates.map(date => {
          const dateStr = formatDate(date);
          const dayActivities = dateStr ? (byDate[dateStr] || []) : [];
          
          return (
            <div key={dateStr || date.toISOString()} className={`week-day ${isToday(date) ? 'today' : ''}`}>
              <div className="week-day-header">
                <div className="week-day-name">
                  {date.toLocaleDateString('sv-SE', { weekday: 'short' })}
                </div>
                <div className="week-day-number">{date.getDate()}</div>
              </div>
              
              <div className="week-day-activities">
                {dayActivities.map((activity: Activity) => (
                  <div
                    key={activity.id}
                    className="week-activity"
                    style={getActivityStyle(activity)}
                    onClick={() => onActivityClick?.(activity)}
                  >
                    <div className="activity-time">
                      {activity.startTime || 'Hela dagen'}
                    </div>
                    <div className="activity-title">{activity.title}</div>
                    {activity.location && (
                      <div className="activity-location">📍 {activity.location}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = formatDate(selectedDate);
    const dayActivities = dateStr ? (byDate[dateStr] || []) : [];
    
    return (
      <div className="day-view">
        <div className="day-header">
          <h3>{formatDisplayDate(selectedDate)}</h3>
          {isToday(selectedDate) && <span className="today-badge">Idag</span>}
        </div>
        
        <div className="day-activities">
          {dayActivities.length === 0 ? (
            <div className="no-activities">
              <div className="no-activities-icon">📅</div>
              <p>Inga aktiviteter planerade för denna dag</p>
              {isLeader() && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onDateClick?.(dateStr!)}
                >
                  Lägg till aktivitet
                </button>
              )}
            </div>
          ) : (
            dayActivities.map((activity: Activity) => (
              <div
                key={activity.id}
                className="day-activity"
                onClick={() => onActivityClick?.(activity)}
              >
                <div className="activity-time-bar" style={{ backgroundColor: activity.color || '#22c55e' }} />
                <div className="activity-content">
                  <div className="activity-header">
                    <h4 className="activity-title">
                      {activity.important && <span className="important-indicator">⭐</span>}
                      {activity.title}
                    </h4>
                    <span className="activity-type">{activity.type}</span>
                  </div>
                  
                  <div className="activity-details">
                    <div className="activity-time">
                      🕐 {activity.startTime && activity.endTime 
                        ? `${activity.startTime} - ${activity.endTime}` 
                        : activity.startTime || 'Hela dagen'}
                    </div>
                    
                    {activity.location && (
                      <div className="activity-location">
                        📍 {activity.location}
                        {activity.mapUrl && (
                          <a href={activity.mapUrl} target="_blank" rel="noopener noreferrer" className="map-link">
                            (karta)
                          </a>
                        )}
                      </div>
                    )}
                    
                    {activity.description && (
                      <div className="activity-description">{activity.description}</div>
                    )}
                    
                    {activity.tags && activity.tags.length > 0 && (
                      <div className="activity-tags">
                        {activity.tags.map((tag: string) => (
                          <span key={tag} className="activity-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    
                    {activity.absenceDeadline && (
                      <div className="absence-deadline">
                        ⏰ Anmäl frånvaro senast: {new Date(activity.absenceDeadline).toLocaleString('sv-SE')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="activity-calendar">
      {/* Kalender Header */}
      <div className="calendar-header">
        <div className="calendar-title">
          <h3>📅 Aktivitetskalender</h3>
        </div>
        
        {/* Vy-växlare */}
        <div className="view-switcher">
          {(['month', 'week', 'day'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              className={`view-button ${viewMode === mode ? 'active' : ''}`}
              onClick={() => setViewMode(mode)}
            >
              {mode === 'month' ? 'Månad' : mode === 'week' ? 'Vecka' : 'Dag'}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation och datum */}
      <div className="calendar-navigation">
        <button className="nav-button" onClick={() => navigateDate('prev')}>
          ‹
        </button>
        
        <div className="current-period">
          {viewMode === 'month' && selectedDate.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' })}
          {viewMode === 'week' && (() => {
            const weekDates = getWeekDates(selectedDate);
            return `Vecka ${weekDates[0]?.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} - ${weekDates[6]?.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}`;
          })()}
          {viewMode === 'day' && formatDisplayDate(selectedDate)}
        </div>
        
        <button className="nav-button" onClick={() => navigateDate('next')}>
          ›
        </button>
      </div>

      {/* Filter och sökning */}
      {showFilters && (
        <div className="calendar-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Sök aktiviteter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="type-filters">
            {(['all', 'träning', 'match', 'cup', 'annat'] as FilterType[]).map(type => (
              <button
                key={type}
                className={`filter-button ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? 'Alla' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Kalender innehåll */}
      <div className="calendar-content">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>

      {/* Statistik footer */}
      <div className="calendar-stats">
        <div className="stat-item">
          <span className="stat-number">{filteredActivities.length}</span>
          <span className="stat-label">Aktiviteter</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredActivities.filter(a => a.type === 'träning').length}</span>
          <span className="stat-label">Träningar</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredActivities.filter(a => a.type === 'match').length}</span>
          <span className="stat-label">Matcher</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredActivities.filter(a => a.important).length}</span>
          <span className="stat-label">Viktiga</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          section {
            padding: 8px;
            border-radius: 0;
            max-width: 99vw;
          }
          h3 {
            font-size: 16px;
          }
          li {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
};

export default ActivityCalendar;