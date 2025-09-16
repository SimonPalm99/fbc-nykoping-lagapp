import React, { useState } from "react";
import { Activity } from "../../types/activity";

interface Props {
  activities: Activity[];
  selectedDate?: Date;
  dateRange?: { start: Date; end: Date };
}

const ActivityExport: React.FC<Props> = ({ activities, selectedDate, dateRange }) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'ical' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const filterActivitiesForExport = () => {
    if (dateRange) {
      return activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= dateRange.start && activityDate <= dateRange.end;
      });
    }
    
    if (selectedDate) {
      const targetDate = selectedDate.toISOString().split('T')[0];
      return activities.filter(activity => activity.date === targetDate);
    }
    
    return activities;
  };

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      const filteredActivities = filterActivitiesForExport();
      
      // Simple PDF generation (in a real app, use a proper PDF library like jsPDF)
      const content = `
FBC Nyköping - Aktivitetsschema
${selectedDate ? `Datum: ${selectedDate.toLocaleDateString('sv-SE')}` : ''}
${dateRange ? `Period: ${dateRange.start.toLocaleDateString('sv-SE')} - ${dateRange.end.toLocaleDateString('sv-SE')}` : ''}

Aktiviteter (${filteredActivities.length} st):
${filteredActivities.map(activity => `
${activity.date} ${activity.startTime || ''} - ${activity.title}
${activity.type.toUpperCase()}${activity.location ? ` | ${activity.location}` : ''}
${activity.description ? `Beskrivning: ${activity.description}` : ''}
${activity.leader ? `Ledare: ${activity.leader}` : ''}
---
`).join('')}

Genererat: ${new Date().toLocaleString('sv-SE')}
      `.trim();

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aktivitetsschema-${selectedDate?.toISOString().split('T')[0] || 'alla'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Kunde inte generera PDF. Försök igen.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateICalendar = () => {
    setIsExporting(true);
    try {
      const filteredActivities = filterActivitiesForExport();
      
      let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FBC Nyköping//Lagapp//SV
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:FBC Nyköping Aktiviteter
X-WR-TIMEZONE:Europe/Stockholm
X-WR-CALDESC:Aktivitetsschema för FBC Nyköping
`;

      filteredActivities.forEach(activity => {
        const startDate = new Date(`${activity.date}T${activity.startTime || '00:00'}:00`);
        const endDate = new Date(startDate.getTime() + (activity.duration || 120) * 60000); // Default 2h
        
        const formatDate = (date: Date) => {
          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        icalContent += `
BEGIN:VEVENT
UID:${activity.id}@fbc-nykoping.se
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${activity.title}
DESCRIPTION:${activity.description || ''}${activity.leader ? `\\nLedare: ${activity.leader}` : ''}
LOCATION:${activity.location || ''}
STATUS:CONFIRMED
TRANSP:OPAQUE
CATEGORIES:${activity.type.toUpperCase()}
${activity.important ? 'PRIORITY:1' : 'PRIORITY:5'}
END:VEVENT`;
      });

      icalContent += `
END:VCALENDAR`;

      const blob = new Blob([icalContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fbc-nykoping-aktiviteter.ics`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating iCalendar:', error);
      alert('Kunde inte generera kalender. Försök igen.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateJSON = () => {
    const filteredActivities = filterActivitiesForExport();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredActivities, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `aktiviteter-${selectedDate?.toISOString().split('T')[0] || 'alla'}.json`);
    dlAnchorElem.click();
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'pdf':
        generatePDF();
        break;
      case 'ical':
        generateICalendar();
        break;
      case 'json':
        generateJSON();
        break;
    }
  };

  const filteredCount = filterActivitiesForExport().length;

  return (
    <div className="activity-export">
      <div className="export-options">
        <label htmlFor="export-format">Exportformat:</label>
        <select 
          id="export-format"
          value={exportFormat} 
          onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'ical' | 'json')}
          className="form-select"
        >
          <option value="pdf">📄 PDF Schema</option>
          <option value="ical">📅 Kalender (.ics)</option>
          <option value="json">💾 JSON Data</option>
        </select>
      </div>

      <div className="export-info">
        <p>
          {filteredCount} aktiviteter kommer att exporteras
          {selectedDate && ` för ${selectedDate.toLocaleDateString('sv-SE')}`}
          {dateRange && ` för perioden ${dateRange.start.toLocaleDateString('sv-SE')} - ${dateRange.end.toLocaleDateString('sv-SE')}`}
        </p>
        
        {exportFormat === 'ical' && (
          <div className="export-tip">
            💡 <strong>Tips:</strong> Kalender-filen (.ics) kan importeras till Google Calendar, Outlook, Apple Calendar och andra kalenderprogram.
          </div>
        )}
      </div>

      <button 
        onClick={handleExport}
        disabled={isExporting || filteredCount === 0}
        className="btn btn-primary"
      >
        {isExporting ? (
          <>
            <span className="spinner" />
            Exporterar...
          </>
        ) : (
          <>
            📤 Exportera {exportFormat.toUpperCase()}
          </>
        )}
      </button>

      <style>{`
        .activity-export {
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
        }

        .export-options {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .form-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: white;
        }

        .export-info {
          margin-bottom: 16px;
          font-size: 14px;
          color: #6b7280;
        }

        .export-tip {
          margin-top: 8px;
          padding: 8px 12px;
          background: #f0f9ff;
          border-left: 3px solid #0ea5e9;
          border-radius: 4px;
          font-size: 13px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ActivityExport;