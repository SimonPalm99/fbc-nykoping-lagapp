import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Providers from "./Providers";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import TermsOfService from "./pages/TermsOfService";
import Profile from "./pages/Profile";
import Matchverktyg from "./pages/Matchverktyg";
import Matchanalys from "./pages/Matchanalys";
import Forum from "./pages/Forum";
import Fines from "./pages/Fines";
import Activities from "./pages/Activities";
import Chat from "./pages/Chat";
import Tactics from "./pages/Tactics";
import Gamification from "./pages/Gamification";
import AdminUsers from "./pages/AdminUsers";
import Settings from "./pages/Settings";
import Whiteboard from "./pages/Whiteboard";
import LiveStatistik from "./pages/LiveStatistik";
import Laguppstallning from "./pages/Laguppstallning";
import ExercisesOverview from "./pages/ExercisesOverview";
import TacticsOverview from "./pages/TacticsOverview";
import Ledarportal from "./pages/Ledarportal";

const ExercisesTacticsTabs: React.FC = () => {
  const [tab, setTab] = React.useState<'exercises' | 'tactics'>('exercises');
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #101a10 60%, #22c55e 100%)", padding: "2rem 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem", borderRadius: 32, boxShadow: "0 8px 32px #000a", background: "rgba(20,32,20,0.85)", border: "2px solid #22c55e" }}>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 32 }}>
          <button onClick={() => setTab('exercises')} style={{ background: tab === 'exercises' ? '#22c55e' : '#101a10', color: tab === 'exercises' ? '#fff' : '#22c55e', border: '2px solid #22c55e', borderRadius: 12, padding: '10px 32px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: tab === 'exercises' ? '0 2px 8px #22c55e88' : 'none', transition: 'all 0.2s' }}>Övningar</button>
          <button onClick={() => setTab('tactics')} style={{ background: tab === 'tactics' ? '#22c55e' : '#101a10', color: tab === 'tactics' ? '#fff' : '#22c55e', border: '2px solid #22c55e', borderRadius: 12, padding: '10px 32px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: tab === 'tactics' ? '0 2px 8px #22c55e88' : 'none', transition: 'all 0.2s' }}>Taktiker</button>
        </div>
        {tab === 'exercises' ? <ExercisesOverview /> : <TacticsOverview />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Providers>
  <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/matchverktyg" element={<ProtectedRoute><Matchverktyg /></ProtectedRoute>} />
          <Route path="/matchanalys" element={<ProtectedRoute><Matchanalys /></ProtectedRoute>} />
          <Route path="/laguppstallning" element={<ProtectedRoute><Laguppstallning /></ProtectedRoute>} />
          <Route path="/whiteboard" element={<ProtectedRoute><Whiteboard /></ProtectedRoute>} />
          <Route path="/livestatistik" element={<ProtectedRoute><LiveStatistik /></ProtectedRoute>} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/fines" element={<Fines />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tactics" element={<Tactics />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* Opponents, PostMatch och MatchPlan borttagna - används ej */}
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ovningar-taktiker" element={<ProtectedRoute><ExercisesTacticsTabs /></ProtectedRoute>} />
          <Route path="/ledarportal" element={<ProtectedRoute><Ledarportal /></ProtectedRoute>} />
        </Routes>
      </Providers>
    </ThemeProvider>
  );
};

export default App;