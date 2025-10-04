import React, { useState, useEffect } from "react";
import { tacticsAPI, exercisesAPI, analysisAPI } from "../services/apiService";


interface Tactic {
  id: string;
  title: string;
  description: string;
  updated?: string;
  tags?: string[];
  category?: string;
}
interface Exercise {
  id: string;
  title: string;
  description: string;
  updated?: string;
  tags?: string[];
  level?: string;
  image?: string;
}
interface Analysis {
  id: string;
  match: string;
  date: string;
  summary: string;
  keyMoments?: string[];
}


const Tactics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'taktiker'|'ovningar'|'analyser'>('taktiker');

  // Riktig data från API
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  // Laddar data vid sidstart
  useEffect(() => {
    tacticsAPI.getAll().then((res: { success: boolean; data?: Tactic[] }) => {
      if (res.success && res.data) setTactics(res.data);
    });
    exercisesAPI.getAll().then((res: { success: boolean; data?: Exercise[] }) => {
      if (res.success && res.data) setExercises(res.data);
    });
    analysisAPI.getAll().then((res: { success: boolean; data?: Analysis[] }) => {
      if (res.success && res.data) setAnalyses(res.data);
    });
  }, []);

  return (
    <div className="tacticsRoot">
      <div className="tacticsHeaderGradient" />
      <header className="tacticsHeader">
        Taktik & Övningar
        <div className="tacticsHeaderSub">
          Här hittar du lagets taktiker, övningar och analyser från matcherna. Ledarna publicerar allt viktigt material här!
        </div>
      </header>
      <div className="tacticsTabs">
        <button
          onClick={() => setActiveTab('taktiker')}
          className={`tacticsTabButton${activeTab==='taktiker' ? '' : ' tacticsTabButtonInactive'}`}
        >Taktiker</button>
        <button
          onClick={() => setActiveTab('ovningar')}
          className={`tacticsTabButton${activeTab==='ovningar' ? '' : ' tacticsTabButtonInactive'}`}
        >Övningar</button>
        <button
          onClick={() => setActiveTab('analyser')}
          className={`tacticsTabButton${activeTab==='analyser' ? '' : ' tacticsTabButtonInactive'}`}
        >Analyser</button>
      </div>
      <section className="tacticsSection">
        {activeTab === 'taktiker' && (
          <div className="tacticsList">
            {tactics.length === 0 ? (
              <div className="tacticsEmpty">Inga taktiker ännu.</div>
            ) : (
              tactics.map((t) => (
                <div key={t.id} className="tacticsCard">
                  <div className="tacticsCardTitle">{t.title}</div>
                  <div className="tacticsCardDesc">{t.description}</div>
                  <div className="tacticsCardMeta">Senast uppdaterad: {t.updated}</div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'ovningar' && (
          <div className="tacticsList">
            {exercises.length === 0 ? (
              <div className="tacticsEmpty">Inga övningar ännu.</div>
            ) : (
              exercises.map((e) => (
                <div key={e.id} className="tacticsCard">
                  <div className="tacticsCardTitle">{e.title}</div>
                  <div className="tacticsCardDesc">{e.description}</div>
                  <div className="tacticsCardMeta">Senast uppdaterad: {e.updated}</div>
                  {e.image && <img src={e.image} alt={e.title} className="tacticsCardImage" />}
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'analyser' && (
          <div className="tacticsList">
            {analyses.length === 0 ? (
              <div className="tacticsEmpty">Inga analyser ännu.</div>
            ) : (
              analyses.map((a) => (
                <div key={a.id} className="tacticsCard">
                  <div className="tacticsCardTitle">{a.match}</div>
                  <div className="tacticsCardDesc">{a.summary}</div>
                  <div className="tacticsCardMeta">Datum: {a.date}</div>
                  <div className="tacticsCardMeta tacticsCardMetaKeySituation">
                    <div className="tacticsKeyTitle">Nyckelsituationer:</div>
                    <ul className="tacticsKeyList">
                      {a.keyMoments?.map((m, idx) => <li key={idx}>{m}</li>)}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
      <footer className="tacticsFooter">
        <div className="tacticsFooterText">
          &copy; {new Date().getFullYear()} FBC - Alla rättigheter förbehållna.
        </div>
        <div className="tacticsFooterLinks">
          <a href="/privacy-policy" className="tacticsFooterLink">Policy för personuppgifter</a>
          <a href="/terms-of-service" className="tacticsFooterLink">Användarvillkor</a>
          <a href="/cookie-policy" className="tacticsFooterLink">Cookiepolicy</a>
        </div>
      </footer>
    </div>
  );
};

export default Tactics;
