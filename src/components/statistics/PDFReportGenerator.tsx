import React, { useState, useEffect } from 'react';

interface PDFReport {
  id: string;
  type: 'player_personal' | 'team_season' | 'match_analysis' | 'opponent_scouting' | 'custom';
  title: string;
  description: string;
  period: string;
  generatedDate: string;
  fileSize: string;
  pages: number;
  isRecent?: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  canCustomize: boolean;
}

interface ReportRequest {
  templateId: string;
  period: string;
  playerId?: string;
  includeSections: string[];
  customTitle?: string;
  format: 'pdf' | 'excel' | 'json';
}

const PDFReportGenerator: React.FC = () => {
  
  const [selectedTab, setSelectedTab] = useState<'generate' | 'history' | 'templates'>('generate');
  const [reportHistory, setReportHistory] = useState<PDFReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [currentRequest, setCurrentRequest] = useState<ReportRequest>({
    templateId: '',
    period: 'season',
    includeSections: [],
    format: 'pdf'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    // Mock templates
    setTemplates([
      {
        id: 'player_personal',
        name: 'Personlig Spelarrapport',
        description: 'Detaljerad rapport för en enskild spelare med all statistik, trender och utveckling',
        sections: [
          'Grundstatistik',
          'Prestationstrend',
          'Jämförelse med lag',
          'Formationsstatus',
          'Milstolpar & Rekord',
          'Matchhistorik',
          'Förbättringsområden'
        ],
        canCustomize: true
      },
      {
        id: 'team_season',
        name: 'Säsongsrapport för Laget',
        description: 'Komplett översikt över lagets prestation under säsongen',
        sections: [
          'Säsongsöversikt',
          'Topprestationer',
          'Lagstatistik',
          'Spelarranking',
          'Utvecklingstrend',
          'Motståndaranalys',
          'Rekord & Milstolpar'
        ],
        canCustomize: true
      },
      {
        id: 'match_analysis',
        name: 'Matchanalys',
        description: 'Detaljerad analys av en specifik match med statistik och insikter',
        sections: [
          'Matchöversikt',
          'Målöversikt',
          'Spelarstatistik',
          'Formationsanalys',
          'Videohöjdpunkter',
          'Post-match kommentarer'
        ],
        canCustomize: false
      },
      {
        id: 'opponent_scouting',
        name: 'Motståndarrapport',
        description: 'Scoutingrapport för kommande motståndare',
        sections: [
          'Grundinformation',
          'Statistik & Form',
          'Nyckelspelare',
          'Taktisk analys',
          'Styrkor & Svagheter',
          'Historik mot oss',
          'Rekommendationer'
        ],
        canCustomize: true
      }
    ]);

    // Mock report history
    setReportHistory([
      {
        id: 'r1',
        type: 'player_personal',
        title: 'Simon Andersson - Personlig Rapport Juni 2025',
        description: 'Komplett spelarrapport för Juni månad',
        period: 'Juni 2025',
        generatedDate: '2025-06-28',
        fileSize: '2.4 MB',
        pages: 12,
        isRecent: true
      },
      {
        id: 'r2',
        type: 'team_season',
        title: 'FBC Nyköping - Säsongsrapport 2024/25',
        description: 'Helhetsbild av lagets prestation denna säsong',
        period: 'Säsong 2024/25',
        generatedDate: '2025-06-25',
        fileSize: '5.8 MB',
        pages: 28,
        isRecent: true
      },
      {
        id: 'r3',
        type: 'match_analysis',
        title: 'Matchanalys: FBC Nyköping vs Västerås IBK',
        description: 'Detaljerad analys av hemmamatchen 4-2',
        period: '2025-06-20',
        generatedDate: '2025-06-21',
        fileSize: '1.9 MB',
        pages: 8
      },
      {
        id: 'r4',
        type: 'opponent_scouting',
        title: 'Scoutingrapport: Stockholm IBF',
        description: 'Förberedelser inför nästa bortamatch',
        period: 'Före match 2025-07-05',
        generatedDate: '2025-06-24',
        fileSize: '3.2 MB',
        pages: 15
      }
    ]);
  }, []);

  const generateReport = async () => {
    if (!currentRequest.templateId) {
      alert('Välj en rapportmall först!');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulera report generation med progress
    const progressSteps = [
      { step: 'Samlar data...', progress: 20 },
      { step: 'Analyserar statistik...', progress: 40 },
      { step: 'Genererar grafer...', progress: 60 },
      { step: 'Skapar layout...', progress: 80 },
      { step: 'Färdigställer PDF...', progress: 100 }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(step.progress);
    }

    // Lägg till ny rapport till historik
    const template = templates.find(t => t.id === currentRequest.templateId);
    const newReport: PDFReport = {
      id: `r${Date.now()}`,
      type: currentRequest.templateId as any,
      title: currentRequest.customTitle || `${template?.name ?? 'Rapport'} - ${new Date().toLocaleDateString('sv-SE')}`,
      description: `Genererad rapport för ${currentRequest.period}`,
      period: currentRequest.period,
      generatedDate: new Date().toISOString().split('T')[0] || '',
      fileSize: '2.1 MB',
      pages: Math.floor(Math.random() * 15) + 8,
      isRecent: true
    };

    setReportHistory(prev => [newReport, ...prev]);
    setIsGenerating(false);
    setGenerationProgress(0);
    
    // Simulera nedladdning
    setTimeout(() => {
      alert(`✅ Rapport "${newReport.title}" har genererats och laddats ner!`);
    }, 500);
  };

  const downloadReport = (reportId: string) => {
    const report = reportHistory.find(r => r.id === reportId);
    alert(`📄 Laddar ner: ${report?.title}`);
  };

  const deleteReport = (reportId: string) => {
    setReportHistory(prev => prev.filter(r => r.id !== reportId));
  };

  const toggleSection = (section: string) => {
    setCurrentRequest(prev => ({
      ...prev,
      includeSections: prev.includeSections.includes(section)
        ? prev.includeSections.filter(s => s !== section)
        : [...prev.includeSections, section]
    }));
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'player_personal': return '👤';
      case 'team_season': return '🏆';
      case 'match_analysis': return '⚽';
      case 'opponent_scouting': return '🔍';
      default: return '📄';
    }
  };

  const tabs = [
    { id: 'generate', name: 'Skapa Rapport', icon: '📝' },
    { id: 'history', name: 'Mina Rapporter', icon: '📁' },
    { id: 'templates', name: 'Mallar', icon: '📋' }
  ];

  const selectedTemplate = templates.find(t => t.id === currentRequest.templateId);

  return (
    <div className="root">
      {/* Header */}
      <div className="header">
        <h2 className="headerTitle">
          📄 PDF Rapportgenerator
        </h2>
        <p className="headerSubtitle">
          Skapa professionella rapporter för spelare, lag och matcher
        </p>
      </div>
      {/* Tabs */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`tabButton${selectedTab === tab.id ? ' tabButtonActive' : ''}`}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {selectedTab === 'generate' && (
        <div>
          <div className="configCard">
            <h3 className="headerTitle sectionTitle">1. Välj Rapportmall</h3>
            <div className="templateGrid">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setCurrentRequest(prev => ({ 
                    ...prev, 
                    templateId: template.id,
                    includeSections: template.sections 
                  }))}
                  className={`templateButton${currentRequest.templateId === template.id ? ' templateButtonActive' : ''}`}
                >
                  <div className="templateName">
                    {template.name}
                  </div>
                  <div className="templateDesc">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {selectedTemplate && (
            <div className="configCard">
              <h3 className="headerTitle sectionTitle">2. Konfigurera Rapport</h3>
              <div className="configGrid">
                <div>
                  <label className="label">Tidsperiod</label>
                  <select
                    value={currentRequest.period}
                    onChange={(e) => setCurrentRequest(prev => ({ ...prev, period: e.target.value }))}
                    className="select"
                    aria-label="Välj tidsperiod"
                  >
                    <option value="season">Hela säsongen</option>
                    <option value="month">Senaste månaden</option>
                    <option value="week">Senaste veckan</option>
                    <option value="last5">Senaste 5 matcherna</option>
                    <option value="custom">Anpassad period</option>
                  </select>
                </div>
                {selectedTemplate.id === 'player_personal' && (
                  <div>
                    <label className="label">Spelare</label>
                    <select
                      value={currentRequest.playerId || ''}
                      onChange={(e) => setCurrentRequest(prev => ({ ...prev, playerId: e.target.value }))}
                      className="select"
                      aria-label="Välj spelare"
                    >
                      <option value="">Välj spelare...</option>
                      <option value="1">Simon Andersson</option>
                      <option value="2">Anna Svensson</option>
                      <option value="3">Erik Nilsson</option>
                      <option value="4">Lisa Johansson</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="label">Format</label>
                  <select
                    value={currentRequest.format}
                    onChange={(e) => setCurrentRequest(prev => ({ ...prev, format: e.target.value as any }))}
                    className="select"
                    aria-label="Välj format"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="json">JSON Data</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label labelMargin">Anpassad titel (valfritt)</label>
                <input
                  type="text"
                  value={currentRequest.customTitle || ''}
                  onChange={(e) => setCurrentRequest(prev => ({ ...prev, customTitle: e.target.value }))}
                  placeholder={`${selectedTemplate.name} - ${new Date().toLocaleDateString('sv-SE')}`}
                  className="input"
                />
              </div>
            </div>
          )}
          {selectedTemplate?.canCustomize && (
            <div className="sectionsCard">
              <h3 className="headerTitle sectionTitle">3. Välj Sektioner</h3>
              <div className="sectionsGrid">
                {selectedTemplate.sections.map(section => (
                  <label
                    key={section}
                    className="sectionLabel"
                  >
                    <input
                      type="checkbox"
                      checked={currentRequest.includeSections.includes(section)}
                      onChange={() => toggleSection(section)}
                      className="sectionCheckbox"
                    />
                    <span className="sectionText">{section}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="generateBtnContainer">
            <button
              onClick={generateReport}
              disabled={isGenerating || !selectedTemplate}
              className={`generateBtn${isGenerating ? ' generateBtnDisabled' : ''}`}
            >
              {isGenerating ? `⏳ Genererar... ${generationProgress}%` : "🚀 Generera Rapport"}
            </button>
          </div>
          {isGenerating && (
            <div className="progressBarWrapper">
              <div className="progressBar">
                <div className={`progressBarFill progress-${generationProgress}`} />
              </div>
            </div>
          )}
        </div>
      )}
      {selectedTab === 'history' && (
        <div>
          <h3 className="historyTitle">📁 Tidigare Rapporter</h3>
          <div className="historyGrid">
            {reportHistory.map(report => (
              <div 
                key={report.id}
                className={`reportCard${report.isRecent ? ' reportCardRecent' : ''}`}
              >
                <div className="reportCardHeader">
                  <span className="reportIcon">
                    {getReportIcon(report.type)}
                  </span>
                  <div className="reportCardInfo">
                    <h4 className="reportCardTitle">
                      {report.title}
                    </h4>
                    <p className="reportCardDesc">
                      {report.description}
                    </p>
                    <div className="reportCardMeta">
                      <span>📅 {new Date(report.generatedDate).toLocaleDateString('sv-SE')}</span>
                      <span>📄 {report.pages} sidor</span>
                      <span>💾 {report.fileSize}</span>
                    </div>
                  </div>
                  {report.isRecent && (
                    <div className="reportCardNew">
                      NY
                    </div>
                  )}
                </div>
                <div className="reportCardActions">
                  <button
                    onClick={() => downloadReport(report.id)}
                    className="downloadBtn"
                  >
                    📥 Ladda ner
                  </button>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="deleteBtn"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedTab === 'templates' && (
        <div>
          <h3 className="templatesTitle">📋 Rapportmallar</h3>
          <div className="templatesGrid">
            {templates.map(template => (
              <div 
                key={template.id}
                className="templateCard"
              >
                <h4 className="templateCardTitle">
                  {template.name}
                </h4>
                <p className="templateCardDesc">
                  {template.description}
                </p>
                <div className="templateSections">
                  <div className="templateSectionsLabel">
                    Inkluderade sektioner:
                  </div>
                  <div className="templateSectionsList">
                    {template.sections.slice(0, 4).map(section => (
                      <span
                        key={section}
                        className="templateSection"
                      >
                        {section}
                      </span>
                    ))}
                    {template.sections.length > 4 && (
                      <span className="templateSectionMore">
                        +{template.sections.length - 4} till
                      </span>
                    )}
                  </div>
                </div>
                <div className="templateCardFooter">
                  <span className={`templateCardStatus ${template.canCustomize ? 'statusGreen' : 'statusYellow'}`}> 
                    {template.canCustomize ? "✅ Anpassningsbar" : "⚠️ Fast mall"}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTab('generate');
                      setCurrentRequest(prev => ({ 
                        ...prev, 
                        templateId: template.id,
                        includeSections: template.sections 
                      }));
                    }}
                    className="useTemplateBtn"
                  >
                    Använd mall
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFReportGenerator;
