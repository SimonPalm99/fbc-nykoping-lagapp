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
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{type: 'tactic'|'exercise'|'analysis', item: any}|null>(null);

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
      <div className="backBtnWrap">
        <button
          className="backBtn"
          onClick={() => window.location.href = '/'}
        >
          Tillbaka
        </button>
      </div>
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
        >🧠 Taktiker</button>
        <button
          onClick={() => setActiveTab('ovningar')}
          className={`tacticsTabButton${activeTab==='ovningar' ? '' : ' tacticsTabButtonInactive'}`}
        >🏃‍♂️ Övningar</button>
        <button
          onClick={() => setActiveTab('analyser')}
          className={`tacticsTabButton${activeTab==='analyser' ? '' : ' tacticsTabButtonInactive'}`}
        >📊 Analyser</button>
      </div>
      <div className="tacticsSearchRow">
        <input
          className="tacticsSearchInput"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Sök titel, tagg eller beskrivning..."
        />
      </div>
      <section className="tacticsSection">
        {activeTab === 'taktiker' && (
          <div className="tacticsList">
            {tactics.length === 0 ? (
              <div className="tacticsEmpty">
                <span role="img" aria-label="empty">🧠</span> Inga taktiker ännu.
              </div>
            ) : (
              tactics.filter(t =>
                t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.description.toLowerCase().includes(search.toLowerCase()) ||
                (t.tags && t.tags.join(" ").toLowerCase().includes(search.toLowerCase()))
              ).map((t) => (
                <div key={t.id} className="tacticsCard" tabIndex={0} role="button" onClick={() => setModal({type: 'tactic', item: t})}>
                  <div className="tacticsCardTitle">🧠 {t.title}</div>
                  <div className="tacticsCardDesc">{t.description}</div>
                  {t.tags && <div className="tacticsCardTags">{t.tags.map((tag, i) => <span key={i} className="tacticsTag">#{tag}</span>)}</div>}
                  <div className="tacticsCardMeta">Senast uppdaterad: {t.updated || "-"}</div>
                  <div className="tacticsCardMeta tacticsCardLeader">Skapad av: Ledare</div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'ovningar' && (
          <div className="tacticsList">
            {exercises.length === 0 ? (
              <div className="tacticsEmpty">
                <span role="img" aria-label="empty">🏃‍♂️</span> Inga övningar ännu.
              </div>
            ) : (
              exercises.filter(e =>
                e.title.toLowerCase().includes(search.toLowerCase()) ||
                e.description.toLowerCase().includes(search.toLowerCase()) ||
                (e.tags && e.tags.join(" ").toLowerCase().includes(search.toLowerCase()))
              ).map((e) => (
                <div key={e.id} className="tacticsCard" tabIndex={0} role="button" onClick={() => setModal({type: 'exercise', item: e})}>
                  <div className="tacticsCardTitle">🏃‍♂️ {e.title}</div>
                  <div className="tacticsCardDesc">{e.description}</div>
                  {e.tags && <div className="tacticsCardTags">{e.tags.map((tag, i) => <span key={i} className="tacticsTag">#{tag}</span>)}</div>}
                  <div className="tacticsCardMeta">Senast uppdaterad: {e.updated || "-"}</div>
                  <div className="tacticsCardMeta tacticsCardLeader">Skapad av: Ledare</div>
                  {e.image && <img src={e.image} alt={e.title} className="tacticsCardImage" />}
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'analyser' && (
          <div className="tacticsList">
            {analyses.length === 0 ? (
              <div className="tacticsEmpty">
                <span role="img" aria-label="empty">📊</span> Inga analyser ännu.
              </div>
            ) : (
              analyses.filter(a =>
                a.match.toLowerCase().includes(search.toLowerCase()) ||
                a.summary.toLowerCase().includes(search.toLowerCase())
              ).map((a) => (
                <div key={a.id} className="tacticsCard" tabIndex={0} role="button" onClick={() => setModal({type: 'analysis', item: a})}>
                  <div className="tacticsCardTitle">📊 {a.match}</div>
                  <div className="tacticsCardDesc">{a.summary}</div>
                  <div className="tacticsCardMeta">Datum: {a.date}</div>
                  <div className="tacticsCardMeta tacticsCardLeader">Skapad av: Ledare</div>
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
      {/* Modal for detail view */}
      {modal && (
        <div className="tacticsModalOverlay" onClick={() => setModal(null)}>
          <div className="tacticsModal" onClick={e => e.stopPropagation()}>
            <button className="tacticsModalClose" onClick={() => setModal(null)} aria-label="Stäng">×</button>
            {modal.type === 'tactic' && (
              <>
                <h2 className="tacticsModalTitle">🧠 {modal.item.title}</h2>
                <div className="tacticsModalDesc">{modal.item.description}</div>
                {modal.item.tags && <div className="tacticsCardTags">{modal.item.tags.map((tag: string, i: number) => <span key={i} className="tacticsTag">#{tag}</span>)}</div>}
                <div className="tacticsCardMeta">Senast uppdaterad: {modal.item.updated || "-"}</div>
                <div className="tacticsCardMeta tacticsCardLeader">Skapad av: Ledare</div>
              </>
            )}
            {modal.type === 'exercise' && (
              <>
                <h2 className="tacticsModalTitle">🏃‍♂️ {modal.item.title}</h2>
                <div className="tacticsModalDesc">{modal.item.description}</div>
                {modal.item.tags && <div className="tacticsCardTags">{modal.item.tags.map((tag: string, i: number) => <span key={i} className="tacticsTag">#{tag}</span>)}</div>}
                <div className="tacticsCardMeta">Senast uppdaterad: {modal.item.updated || "-"}</div>
                <div className="tacticsCardMeta tacticsCardLeader">Skapad av: Ledare</div>
                {modal.item.image && <img src={modal.item.image} alt={modal.item.title} className="tacticsModalImage" />}
              </>
            )}
            {modal.type === 'analysis' && (
              <>
                <h2 className="tacticsModalTitle">📊 {modal.item.match}</h2>
                <div className="tacticsModalDesc">{modal.item.summary}</div>
                <div className="tacticsCardMeta">Datum: {modal.item.date}</div>
                <div className="tacticsCardMeta tacticsCardLeader">Skapad av: Ledare</div>
                <div className="tacticsCardMeta tacticsCardMetaKeySituation">
                  <div className="tacticsKeyTitle">Nyckelsituationer:</div>
                  <ul className="tacticsKeyList">
                    {modal.item.keyMoments?.map((m: string, idx: number) => <li key={idx}>{m}</li>)}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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
