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
    <div style={{
      background: "#1a202c",
      padding: "20px",
      borderRadius: "12px",
      color: "#fff"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
          📄 PDF Rapportgenerator
        </h2>
        <p style={{ margin: "4px 0 0 0", color: "#a0aec0" }}>
          Skapa professionella rapporter för spelare, lag och matcher
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "20px",
        borderBottom: "1px solid #4a5568",
        paddingBottom: "12px"
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            style={{
              padding: "8px 16px",
              background: selectedTab === tab.id ? "#3b82f6" : "transparent",
              border: "none",
              borderRadius: "6px",
              color: selectedTab === tab.id ? "#fff" : "#a0aec0",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Generate Report Tab */}
      {selectedTab === 'generate' && (
        <div>
          {/* Template Selection */}
          <div style={{
            background: "#2d3748",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0" }}>1. Välj Rapportmall</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "12px"
            }}>
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setCurrentRequest(prev => ({ 
                    ...prev, 
                    templateId: template.id,
                    includeSections: template.sections 
                  }))}
                  style={{
                    padding: "16px",
                    background: currentRequest.templateId === template.id ? "#3b82f6" : "#1a202c",
                    border: currentRequest.templateId === template.id ? "2px solid #60a5fa" : "1px solid #4a5568",
                    borderRadius: "8px",
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                    {template.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#a0aec0", lineHeight: "1.4" }}>
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          {selectedTemplate && (
            <div style={{
              background: "#2d3748",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px"
            }}>
              <h3 style={{ margin: "0 0 12px 0" }}>2. Konfigurera Rapport</h3>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "16px"
              }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                    Tidsperiod
                  </label>
                  <select
                    value={currentRequest.period}
                    onChange={(e) => setCurrentRequest(prev => ({ ...prev, period: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#1a202c",
                      border: "1px solid #4a5568",
                      borderRadius: "4px",
                      color: "#fff"
                    }}
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
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                      Spelare
                    </label>
                    <select
                      value={currentRequest.playerId || ''}
                      onChange={(e) => setCurrentRequest(prev => ({ ...prev, playerId: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "8px",
                        background: "#1a202c",
                        border: "1px solid #4a5568",
                        borderRadius: "4px",
                        color: "#fff"
                      }}
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
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                    Format
                  </label>
                  <select
                    value={currentRequest.format}
                    onChange={(e) => setCurrentRequest(prev => ({ ...prev, format: e.target.value as any }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#1a202c",
                      border: "1px solid #4a5568",
                      borderRadius: "4px",
                      color: "#fff"
                    }}
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="json">JSON Data</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#a0aec0" }}>
                  Anpassad titel (valfritt)
                </label>
                <input
                  type="text"
                  value={currentRequest.customTitle || ''}
                  onChange={(e) => setCurrentRequest(prev => ({ ...prev, customTitle: e.target.value }))}
                  placeholder={`${selectedTemplate.name} - ${new Date().toLocaleDateString('sv-SE')}`}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#1a202c",
                    border: "1px solid #4a5568",
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                />
              </div>
            </div>
          )}

          {/* Sections Selection */}
          {selectedTemplate?.canCustomize && (
            <div style={{
              background: "#2d3748",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px"
            }}>
              <h3 style={{ margin: "0 0 12px 0" }}>3. Välj Sektioner</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px"
              }}>
                {selectedTemplate.sections.map(section => (
                  <label
                    key={section}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px",
                      background: "#1a202c",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={currentRequest.includeSections.includes(section)}
                      onChange={() => toggleSection(section)}
                      style={{ margin: 0 }}
                    />
                    <span style={{ fontSize: "14px" }}>{section}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={generateReport}
              disabled={isGenerating || !selectedTemplate}
              style={{
                padding: "12px 24px",
                background: isGenerating ? "#4a5568" : "#10b981",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                cursor: isGenerating ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "16px"
              }}
            >
              {isGenerating ? `⏳ Genererar... ${generationProgress}%` : "🚀 Generera Rapport"}
            </button>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div style={{ marginTop: "16px" }}>
              <div style={{
                background: "#4a5568",
                borderRadius: "4px",
                height: "8px",
                overflow: "hidden"
              }}>
                <div style={{
                  background: "#10b981",
                  height: "100%",
                  width: `${generationProgress}%`,
                  transition: "width 0.3s ease"
                }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report History Tab */}
      {selectedTab === 'history' && (
        <div>
          <h3 style={{ margin: "0 0 16px 0" }}>📁 Tidigare Rapporter</h3>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "16px"
          }}>
            {reportHistory.map(report => (
              <div 
                key={report.id}
                style={{
                  background: "#2d3748",
                  padding: "16px",
                  borderRadius: "8px",
                  border: report.isRecent ? "2px solid #10b981" : "1px solid #4a5568"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "12px"
                }}>
                  <span style={{ fontSize: "24px" }}>
                    {getReportIcon(report.type)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 4px 0", fontWeight: "600" }}>
                      {report.title}
                    </h4>
                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#a0aec0" }}>
                      {report.description}
                    </p>
                    <div style={{
                      display: "flex",
                      gap: "12px",
                      fontSize: "11px",
                      color: "#718096"
                    }}>
                      <span>📅 {new Date(report.generatedDate).toLocaleDateString('sv-SE')}</span>
                      <span>📄 {report.pages} sidor</span>
                      <span>💾 {report.fileSize}</span>
                    </div>
                  </div>
                  {report.isRecent && (
                    <div style={{
                      background: "#10b981",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "600"
                    }}>
                      NY
                    </div>
                  )}
                </div>

                <div style={{
                  display: "flex",
                  gap: "8px"
                }}>
                  <button
                    onClick={() => downloadReport(report.id)}
                    style={{
                      flex: 1,
                      padding: "6px 12px",
                      background: "#3b82f6",
                      border: "none",
                      borderRadius: "4px",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    📥 Ladda ner
                  </button>
                  <button
                    onClick={() => deleteReport(report.id)}
                    style={{
                      padding: "6px 12px",
                      background: "#ef4444",
                      border: "none",
                      borderRadius: "4px",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {selectedTab === 'templates' && (
        <div>
          <h3 style={{ margin: "0 0 16px 0" }}>📋 Rapportmallar</h3>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px"
          }}>
            {templates.map(template => (
              <div 
                key={template.id}
                style={{
                  background: "#2d3748",
                  padding: "16px",
                  borderRadius: "8px"
                }}
              >
                <h4 style={{ margin: "0 0 8px 0", fontWeight: "600" }}>
                  {template.name}
                </h4>
                <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#a0aec0" }}>
                  {template.description}
                </p>
                
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#a0aec0", marginBottom: "4px" }}>
                    Inkluderade sektioner:
                  </div>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px"
                  }}>
                    {template.sections.slice(0, 4).map(section => (
                      <span
                        key={section}
                        style={{
                          background: "#1a202c",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          color: "#a0aec0"
                        }}
                      >
                        {section}
                      </span>
                    ))}
                    {template.sections.length > 4 && (
                      <span style={{ fontSize: "10px", color: "#718096" }}>
                        +{template.sections.length - 4} till
                      </span>
                    )}
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{
                    fontSize: "11px",
                    color: template.canCustomize ? "#10b981" : "#f59e0b"
                  }}>
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
                    style={{
                      padding: "4px 8px",
                      background: "#3b82f6",
                      border: "none",
                      borderRadius: "4px",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: "600"
                    }}
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
