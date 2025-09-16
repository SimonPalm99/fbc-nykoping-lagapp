
import React, { useEffect, useState } from "react";
import { activitiesAPI, analysisAPI } from "../services/apiService";
import { Activity } from "../types/activity";
import { MatchAnalysis } from "../types/analysis";

const Matchanalys: React.FC = () => {
  const [matches, setMatches] = useState<Activity[]>([]);
  const [analyses, setAnalyses] = useState<MatchAnalysis[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      activitiesAPI.getAll(),
      analysisAPI.getAll()
    ]).then(([matchRes, analysisRes]) => {
      if (matchRes.success && Array.isArray(matchRes.data)) {
        setMatches(matchRes.data.filter((a: Activity) => a.type === "match"));
      }
      if (analysisRes.success && Array.isArray(analysisRes.data)) {
        setAnalyses(analysisRes.data);
      }
      setLoading(false);
    });
  }, []);

  // Sök/filter på ALLA matcher
  const filteredMatches = matches.filter(match =>
    match.title.toLowerCase().includes(search.toLowerCase()) ||
    match.date.includes(search)
  );


  // Formulär för att skapa/redigera analys
  const [editMatchId, setEditMatchId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<MatchAnalysis>>({});
  const [saving, setSaving] = useState(false);

  const openForm = (match: Activity, analysis?: MatchAnalysis) => {
    setEditMatchId(match.id);
    setForm(
      analysis
        ? { ...analysis }
        : {
            matchId: match.id,
            matchTitle: match.title,
            date: match.date,
            author: '',
            period1: '',
            period2: '',
            period3: '',
            summary: '',
            rating: 0,
            files: [],
            livestats: {},
          }
    );
  };

  const closeForm = () => {
    setEditMatchId(null);
    setForm({});
  };

  const handleFormChange = (field: keyof MatchAnalysis, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map(f => ({
      url: URL.createObjectURL(f),
      name: f.name,
      type: f.type.startsWith('image')
        ? 'image'
        : f.type.startsWith('video')
        ? 'video'
        : 'document' as 'image' | 'video' | 'document',
    }));
    setForm(f => ({ ...f, files: [...(f.files || []), ...newFiles] }));
  };

  const saveAnalysis = async () => {
    setSaving(true);
    try {
      if (form.id) {
        await analysisAPI.update(form.id, form);
      } else {
        await analysisAPI.create(form);
      }
      // Uppdatera analyser
      const res = await analysisAPI.getAll();
      if (res.success && Array.isArray(res.data)) setAnalyses(res.data);
      closeForm();
    } catch (err) {
      alert('Kunde inte spara analysen.');
    }
    setSaving(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #101a10 60%, #22c55e 100%)", padding: "2rem 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem", borderRadius: 32, boxShadow: "0 8px 32px #000a", background: "rgba(20,32,20,0.85)", border: "2px solid #22c55e" }}>
        <h1 style={{ color: "#22c55e", fontWeight: 900, fontSize: "2.3rem", marginBottom: "1.5rem", textShadow: "0 2px 8px #22c55e88" }}>Matchanalys</h1>
        <p style={{ color: "#d1fae5", fontSize: "1.15rem", marginBottom: "2rem", fontWeight: 500 }}>
          Det är här du skapar och sammanställer analyser för alla matcher du har spelat. Lägg in egna kommentarer, livestatistik, filmer, bilder och dokument. När du är klar kan du dela analysen med laget. Sidan är din samlingsplats för all matchinformation – perfekt inför returmöten!
        </p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Sök match eller datum..."
          style={{ width: "100%", maxWidth: 400, marginBottom: 32, padding: "0.7rem 1.2rem", borderRadius: 12, border: "2px solid #22c55e", fontSize: "1.1rem" }}
        />
        {editMatchId ? (
          <div style={{ background: '#181c18', borderRadius: 20, boxShadow: '0 4px 16px #22c55e22', border: '2px solid #22c55e', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ color: '#22c55e', fontWeight: 900, fontSize: '1.3rem', marginBottom: '1rem' }}>
              {form.matchTitle}
            </h2>
            <div style={{ color: '#d1fae5', fontWeight: 700, marginBottom: '0.7rem' }}>{form.date && new Date(form.date).toLocaleDateString('sv-SE')}</div>
            <label style={{ color: '#d1fae5', fontWeight: 700 }}>Analysförfattare:</label>
            <input type="text" value={form.author || ''} onChange={e => handleFormChange('author', e.target.value)} style={{ width: '100%', marginBottom: 12, padding: '0.5rem', borderRadius: 8 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ color: '#22c55e', fontWeight: 700 }}>Period 1:</label>
                <textarea value={form.period1 || ''} onChange={e => handleFormChange('period1', e.target.value)} style={{ width: '100%', marginBottom: 12, padding: '0.5rem', borderRadius: 8 }} />
                <label style={{ color: '#22c55e', fontWeight: 700 }}>Period 2:</label>
                <textarea value={form.period2 || ''} onChange={e => handleFormChange('period2', e.target.value)} style={{ width: '100%', marginBottom: 12, padding: '0.5rem', borderRadius: 8 }} />
                <label style={{ color: '#22c55e', fontWeight: 700 }}>Period 3:</label>
                <textarea value={form.period3 || ''} onChange={e => handleFormChange('period3', e.target.value)} style={{ width: '100%', marginBottom: 12, padding: '0.5rem', borderRadius: 8 }} />
                <label style={{ color: '#22c55e', fontWeight: 700 }}>Sammanfattning:</label>
                <textarea value={form.summary || ''} onChange={e => handleFormChange('summary', e.target.value)} style={{ width: '100%', marginBottom: 12, padding: '0.5rem', borderRadius: 8 }} />
                <label style={{ color: '#22c55e', fontWeight: 700 }}>Betyg (1-5):</label>
                <input type="number" min={1} max={5} value={form.rating || 0} onChange={e => handleFormChange('rating', Number(e.target.value))} style={{ width: 80, marginBottom: 12, padding: '0.5rem', borderRadius: 8 }} />
              </div>
              <div>
                <label style={{ color: '#22c55e', fontWeight: 700 }}>Taktiska punkter:</label>
                <textarea value={form.tactics || ''} onChange={e => handleFormChange('tactics', e.target.value)} style={{ width: '100%', marginBottom: 12, padding: '0.5rem', borderRadius: 8 }} placeholder="Styrkor, svagheter, förbättringar..." />
                <label style={{ color: '#22c55e', fontWeight: 700 }}>Kommentarer/notiser:</label>
                <textarea value={form.comments || ''} onChange={e => handleFormChange('comments', e.target.value)} style={{ width: '100%', marginBottom: 12, padding: '0.5rem', borderRadius: 8 }} placeholder="Ex: Bra insats av målvakten, viktigt byte i period 2..." />
                <label style={{ color: '#22c55e', fontWeight: 700 }}>Livestatistik (JSON):</label>
                <textarea value={JSON.stringify(form.livestats || {}, null, 2)} onChange={e => handleFormChange('livestats', JSON.parse(e.target.value))} style={{ width: '100%', marginBottom: 12, padding: '0.5rem', borderRadius: 8, fontFamily: 'monospace' }} />
              </div>
            </div>
            <label style={{ color: '#22c55e', fontWeight: 700 }}>Ladda upp filer (bild, video, dokument):</label>
            <input type="file" multiple onChange={handleFileUpload} style={{ marginBottom: 12 }} />
            <div style={{ marginBottom: 12, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {form.files && form.files.length > 0 && (
                form.files.map((f, i) => (
                  <div key={i} style={{ background: '#222', borderRadius: 8, padding: 8, color: '#d1fae5', minWidth: 120, textAlign: 'center' }}>
                    {f.type === 'image' ? (
                      <img src={f.url} alt={f.name} style={{ maxWidth: 100, maxHeight: 80, borderRadius: 6, marginBottom: 4 }} />
                    ) : f.type === 'video' ? (
                      <video src={f.url} controls style={{ maxWidth: 100, maxHeight: 80, borderRadius: 6, marginBottom: 4 }} />
                    ) : (
                      <span style={{ fontSize: 24 }}>📄</span>
                    )}
                    <div style={{ fontSize: 13 }}>{f.name}</div>
                  </div>
                ))
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={saveAnalysis} disabled={saving} style={{ background: '#22c55e', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}>
                Spara analys
              </button>
              <button onClick={closeForm} style={{ background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}>
                Avbryt
              </button>
            </div>
          </div>
        ) : loading ? (
          <div style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.2rem" }}>Laddar matcher och analyser...</div>
        ) : filteredMatches.length === 0 ? (
          <div style={{ color: "#ef4444", fontWeight: 700, fontSize: "1.2rem" }}>Inga matcher hittades.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            {filteredMatches.map(match => {
              const analysis = analyses.find(a => a.matchId === match.id);
              return (
                <div key={match.id} style={{ background: "#181c18", borderRadius: 20, boxShadow: "0 4px 16px #22c55e22", border: "2px solid #22c55e", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: match.canceled ? 0.5 : 1 }}>
                  <div>
                    <h2 style={{ color: "#22c55e", fontWeight: 900, fontSize: "1.3rem", marginBottom: "0.5rem" }}>{match.title}</h2>
                    <div style={{ color: "#d1fae5", fontWeight: 700, marginBottom: "0.7rem" }}>{new Date(match.date).toLocaleDateString("sv-SE")}</div>
                    <div style={{ color: "#fff", marginBottom: "1rem" }}>{match.description}</div>
                  </div>
                  <div style={{ marginTop: "1rem" }}>
                    {analysis ? (
                      <>
                        <div style={{ color: "#22c55e", fontWeight: 700, marginBottom: "0.5rem" }}>Analys av {analysis.author}</div>
                        <div style={{ color: "#fff", marginBottom: "0.5rem" }}>{analysis.summary?.slice(0, 120) || "Ingen sammanfattning"}{analysis.summary && analysis.summary.length > 120 ? "..." : ""}</div>
                        <div style={{ color: "#d1fae5", fontWeight: 700 }}>Betyg: {analysis.rating ?? "-"} / 5</div>
                      </>
                    ) : (
                      <div style={{ color: "#d1fae5", fontWeight: 700, marginBottom: "0.5rem" }}>Ingen analys sparad än</div>
                    )}
                  </div>
                  <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                    <button onClick={() => openForm(match, analysis)} style={{ background: analysis ? "#22c55e" : "#2563eb", color: "#fff", fontWeight: 700, border: "none", borderRadius: 8, padding: "0.7rem 1.5rem", fontSize: "1rem", cursor: "pointer" }}>
                      {analysis ? "Visa/redigera analys" : "Skapa analys"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matchanalys;
