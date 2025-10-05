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
    <div className="tabsRoot">
      <div className="tabsContainer">
        <div className="tabsRow">
          <button
            onClick={() => setTab('exercises')}
            className={`tabsButton${tab === 'exercises' ? ' tabsButtonActive' : ''}`}
          >Övningar</button>
          <button
            onClick={() => setTab('tactics')}
            className={`tabsButton${tab === 'tactics' ? ' tabsButtonActive' : ''}`}
          >Taktiker</button>
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
          {/* Redirect från / till /welcome */}
          <Route path="/" element={<Welcome />} />
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