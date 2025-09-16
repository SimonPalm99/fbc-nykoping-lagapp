import React, { useState, useMemo } from "react";
import { Activity, ActivityType } from "../../types/activity";
import ActivityItem from "./ActivityItem";
import { useTheme } from "../../context/ThemeContext";

interface ActivityListProps {
  activities: Activity[];
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string;
  isLeader: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  onActivityClick?: (activity: Activity) => void;
  isLoading?: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  activities, 
  setSelected, 
  userId, 
  isLeader: _isLeader,
  showFilters = true,
  showSearch = true,
  onActivityClick,
  isLoading = false
}) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [dateFilter, setDateFilter] = useState<"all" | "upcoming" | "past">("upcoming");
  const [sortBy, setSortBy] = useState<"date" | "title" | "type">("date");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const activityTypes: { type: ActivityType; label: string; icon: string; color: string }[] = [
    { type: "träning", label: "Träning", icon: "🏃", color: "#4CAF50" },
    { type: "match", label: "Match", icon: "🏒", color: "#FF5722" },
    { type: "cup", label: "Cup", icon: "🏆", color: "#FFC107" },
    { type: "lagfest", label: "Lagfest", icon: "🎉", color: "#E91E63" },
    { type: "möte", label: "Möte", icon: "👥", color: "#9C27B0" },
    { type: "annat", label: "Annat", icon: "📋", color: "#607D8B" }
  ];

  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Textsökning med förbättrad matching
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchTermLower) ||
        activity.description?.toLowerCase().includes(searchTermLower) ||
        activity.location?.toLowerCase().includes(searchTermLower) ||
        activity.tags?.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }

    // Typfilter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(activity => selectedTypes.includes(activity.type));
    }

    // Datumfilter
    const now = new Date();
    const today = now.toISOString().split('T')[0]!;
    
    if (dateFilter === "upcoming") {
      filtered = filtered.filter(activity => activity.date >= today);
    } else if (dateFilter === "past") {
      filtered = filtered.filter(activity => activity.date < today);
    }

    // Sortering med förbättrad logik
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
        const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
        return dateA.getTime() - dateB.getTime();
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title, 'sv');
      } else if (sortBy === "type") {
        return a.type.localeCompare(b.type, 'sv');
      }
      return 0;
    });

    return filtered;
  }, [activities, searchTerm, selectedTypes, dateFilter, sortBy]);

  const toggleTypeFilter = (type: ActivityType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setDateFilter("upcoming");
    setSortBy("date");
  };

  const getResultsText = () => {
    const total = activities.length;
    const filtered = filteredActivities.length;
    
    if (total === 0) return "Inga aktiviteter";
    if (filtered === total) return `${total} aktiviteter`;
    return `${filtered} av ${total} aktiviteter`;
  };

  if (isLoading) {
    return (
      <div className="activity-list">
        <div className="activity-list-loading">
          <div className="loading-spinner"></div>
          <p>Laddar aktiviteter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`activity-list ${isDark ? 'dark' : ''}`}>
      {(showSearch || showFilters) && (
        <div className="activity-list-header">
          {showSearch && (
            <div className="search-container">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Sök aktiviteter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                    aria-label="Rensa sökning"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {showFilters && (
            <div className="filters-container">
              <button 
                className={`filters-toggle ${showFiltersPanel ? 'active' : ''}`}
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              >
                <span className="filters-icon">⚙️</span>
                <span>Filter</span>
                {(selectedTypes.length > 0 || dateFilter !== "upcoming" || sortBy !== "date") && (
                  <span className="filter-indicator"></span>
                )}
              </button>
              
              <div className="results-text">
                {getResultsText()}
              </div>
            </div>
          )}
        </div>
      )}

      {showFiltersPanel && (
        <div className="filters-panel">
          <div className="filter-section">
            <h4>Aktivitetstyp</h4>
            <div className="type-filters">
              {activityTypes.map(({ type, label, icon, color }) => (
                <button
                  key={type}
                  className={`type-filter ${selectedTypes.includes(type) ? 'active' : ''}`}
                  onClick={() => toggleTypeFilter(type)}
                  style={{ '--type-color': color } as React.CSSProperties}
                >
                  <span className="type-icon">{icon}</span>
                  <span className="type-label">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Datum</h4>
            <div className="date-filters">
              {[
                { value: "all", label: "Alla", icon: "📅" },
                { value: "upcoming", label: "Kommande", icon: "⏰" },
                { value: "past", label: "Tidigare", icon: "📋" }
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  className={`date-filter ${dateFilter === value ? 'active' : ''}`}
                  onClick={() => setDateFilter(value as typeof dateFilter)}
                >
                  <span className="filter-icon">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Sortering</h4>
            <div className="sort-options">
              {[
                { value: "date", label: "Datum", icon: "📅" },
                { value: "title", label: "Titel", icon: "🔤" },
                { value: "type", label: "Typ", icon: "📋" }
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  className={`sort-option ${sortBy === value ? 'active' : ''}`}
                  onClick={() => setSortBy(value as typeof sortBy)}
                >
                  <span className="sort-icon">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-actions">
            <button 
              className="clear-filters"
              onClick={clearFilters}
            >
              Rensa filter
            </button>
          </div>
        </div>
      )}

      <div className="activity-list-content">
        {filteredActivities.length === 0 ? (
          <div className="no-activities">
            <div className="no-activities-icon">📅</div>
            <h3>Inga aktiviteter hittades</h3>
            <p>
              {searchTerm || selectedTypes.length > 0 || dateFilter !== "upcoming" 
                ? "Prova att ändra dina filter eller sökkriterier."
                : "Det finns inga aktiviteter att visa just nu."
              }
            </p>
            {(searchTerm || selectedTypes.length > 0 || dateFilter !== "upcoming") && (
              <button 
                className="clear-filters-button"
                onClick={clearFilters}
              >
                Rensa alla filter
              </button>
            )}
          </div>
        ) : (
          <div className="activities-grid">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="activity-item-wrapper">
                <ActivityItem
                  activity={activity}
                  userId={userId}
                  onClick={() => {
                    setSelected(activity.id);
                    onActivityClick?.(activity);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
