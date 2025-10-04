import { useState } from "react";
import styles from "./ActivityCalendar.module.css";
import { Activity } from "../../types/activity";

// Define the ViewMode type
type ViewMode = 'month' | 'week' | 'day';

interface Props {
  activities: Activity[];
  onActivityClick?: (activity: Activity) => void;
  onDateClick?: (date: string) => void;
  showFilters?: boolean;
  // ...existing code...
  // Placera huvudreturn sist i komponenten
}

function ActivityCalendar({
  activities,
  onActivityClick,
  onDateClick,
  showFilters = true,
}: Props) {
  // Define the FilterType type
  type FilterType = 'all' | 'träning' | 'match' | 'cup' | 'annat';

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Helper to format a date for display (e.g. "Måndag 3 juni 2024")
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Returns an array of Date objects for the current week (Monday-Sunday) of the given date
  const getWeekDates = (date: Date): Date[] => {
    const week: Date[] = [];
    const dayOfWeek = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    const monday = new Date(date);
    monday.setDate(date.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const isSameMonth = (date: Date, referenceDate: Date) => {
    return date.getMonth() === referenceDate.getMonth() && 
           date.getFullYear() === referenceDate.getFullYear();
  };


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

  // Dummy implementations for missing helpers
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  const isLeader = () => true; // Replace with actual logic
  const getMonthDates = (date: Date) => {
    // Returns all dates to display in the month view (including leading/trailing days)
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
    const endDay = (lastDayOfMonth.getDay() + 6) % 7; // Monday = 0

    const days: Date[] = [];
    // Previous month's trailing days
    for (let i = startDay; i > 0; i--) {
      const d = new Date(firstDayOfMonth);
      d.setDate(firstDayOfMonth.getDate() - i);
      days.push(d);
    }
    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    // Next month's leading days
    for (let i = 1; i < 7 - endDay; i++) {
      const d = new Date(lastDayOfMonth);
      d.setDate(lastDayOfMonth.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Filter activities
  const filteredActivities = activities.filter(a => {
    const matchesType = filterType === 'all' || a.type === filterType;
    const matchesSearch = searchTerm === '' || a.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Group activities by date string
  const byDate: { [date: string]: Activity[] } = {};
  filteredActivities.forEach(a => {
    const dateObj = new Date(a.date);
    const dateStr = formatDate(dateObj);
    if (dateStr) {
      byDate[dateStr] = byDate[dateStr] || [];
      byDate[dateStr].push(a);
    }
  });

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
                      className={`${styles.activityDot}${activity.important ? ' ' + styles.important : ''}${activity.color ? ' ' + styles[`activityColor_${activity.color.replace('#', '')}`] : ''}`}
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
                {dayActivities.map((activity: Activity) => {
                  // Generate a CSS class for the color if present
                  const colorClass = activity.color ? styles[`activityColor_${activity.color.replace('#', '')}`] : '';
                  return (
                    <div
                      key={activity.id}
                      className={`${styles.weekActivity}${activity.important ? ' ' + styles.important : ''}${colorClass ? ' ' + colorClass : ''}`}
                      onClick={() => onActivityClick?.(activity)}
                    >
                      <div className={styles.activityTime}>
                        {activity.startTime || 'Hela dagen'}
                      </div>
                      <div className={styles.activityTitle}>{activity.title}</div>
                      {activity.location && (
                        <div className={styles.activityLocation}>📍 {activity.location}</div>
                      )}
                    </div>
                  );
                })}
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
      <div className={styles.dayView}>
        <div className={styles.dayHeader}>
          <h3>{formatDisplayDate(selectedDate)}</h3>
          {isToday(selectedDate) && <span className={styles.todayBadge}>Idag</span>}
        </div>
        <div className={styles.dayActivities}>
          {dayActivities.length === 0 ? (
            <div className={styles.noActivities}>
              <div className={styles.noActivitiesIcon}>📅</div>
              <p>Inga aktiviteter planerade för denna dag</p>
              {isLeader() && (
                <button 
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
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
                className={styles.dayActivity}
                onClick={() => onActivityClick?.(activity)}
              >
                <div
                  className={`${styles.activityTimeBar}${activity.color ? ' ' + styles[`activityColor_${activity.color.replace('#', '')}`] : ''}`}
                />
                <div className={styles.activityContent}>
                  <div className={styles.activityHeader}>
                    <h4 className={styles.activityTitle}>
                      {activity.important && <span className={styles.importantIndicator}>⭐</span>}
                      {activity.title}
                    </h4>
                    <span className={styles.activityType}>{activity.type}</span>
                  </div>
                  <div className={styles.activityDetails}>
                    <div className={styles.activityTime}>
                      🕐 {activity.startTime && activity.endTime 
                        ? `${activity.startTime} - ${activity.endTime}` 
                        : activity.startTime || 'Hela dagen'}
                    </div>
                    {activity.location && (
                      <div className={styles.activityLocation}>
                        📍 {activity.location}
                        {activity.mapUrl && (
                          <a href={activity.mapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                            (karta)
                          </a>
                        )}
                      </div>
                    )}
                    {activity.description && (
                      <div className={styles.activityDescription}>{activity.description}</div>
                    )}
                    {activity.tags && activity.tags.length > 0 && (
                      <div className={styles.activityTags}>
                        {activity.tags.map((tag: string) => (
                          <span key={tag} className={styles.activityTag}>{tag}</span>
                        ))}
                      </div>
                    )}
                    {activity.absenceDeadline && (
                      <div className={styles.absenceDeadline}>
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
    <section className={styles.activityCalendar}>
      {/* Kalender Header */}
      <div className={styles.calendarHeader}>
        <div className={styles.calendarTitle}>
          <h3>📅 Aktivitetskalender</h3>
        </div>
        {/* Vy-växlare */}
        <div className={styles.viewSwitcher}>
          {(['month', 'week', 'day'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              className={`${styles.viewButton} ${viewMode === mode ? styles.active : ''}`}
              onClick={() => setViewMode(mode)}
            >
              {mode === 'month' ? 'Månad' : mode === 'week' ? 'Vecka' : 'Dag'}
            </button>
          ))}
        </div>
      </div>
      {/* Navigation och datum */}
      <div className={styles.calendarNavigation}>
        <button className={styles.navButton} onClick={() => navigateDate('prev')}>
          ‹
        </button>
        <div className={styles.currentPeriod}>
          {viewMode === 'month' && selectedDate.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' })}
          {viewMode === 'week' && (() => {
            const weekDates = getWeekDates(selectedDate);
            return `Vecka ${weekDates[0]?.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} - ${weekDates[6]?.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}`;
          })()}
          {viewMode === 'day' && formatDisplayDate(selectedDate)}
        </div>
        <button className={styles.navButton} onClick={() => navigateDate('next')}>
          ›
        </button>
      </div>
      {/* Filter och sökning */}
      {showFilters && (
        <div className={styles.calendarFilters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Sök aktiviteter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.typeFilters}>
            {(['all', 'träning', 'match', 'cup', 'annat'] as FilterType[]).map(type => (
              <button
                key={type}
                className={`${styles.filterButton} ${filterType === type ? styles.active : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? 'Alla' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Kalender innehåll */}
      <div className={styles.calendarContent}>
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>
      {/* Statistik footer */}
      <div className={styles.calendarStats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{filteredActivities.length}</span>
          <span className={styles.statLabel}>Aktiviteter</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{filteredActivities.filter(a => a.type === 'träning').length}</span>
          <span className={styles.statLabel}>Träningar</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{filteredActivities.filter(a => a.type === 'match').length}</span>
          <span className={styles.statLabel}>Matcher</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{filteredActivities.filter(a => a.important).length}</span>
          <span className={styles.statLabel}>Viktiga</span>
        </div>
      </div>
    </section>
  );
}

export default ActivityCalendar;