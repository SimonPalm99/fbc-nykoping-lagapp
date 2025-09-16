import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

// Poängsystem: lista på alla sätt att få poäng
const pointsList = [
  { label: "Deltagit i träning", points: 5, auto: true },
  { label: "Deltagit i match", points: 10, auto: true },
  { label: "Gjort mål i match", points: 3, auto: true },
  { label: "Gjort assist i match", points: 2, auto: true },
  { label: "Registrerat träning i träningslogg", points: 5, auto: true },
  { label: "Tränat flera gånger i rad (streak)", points: 10, auto: true },
  { label: "Vunnit veckans utmaning", points: 15, auto: false },
  { label: "Fått specialbadge", points: 20, auto: false },
  { label: "Röstad till MVP", points: 25, auto: false },
];

const allChallenges = [
  { id: "challenge1", name: "Flest träningspass denna vecka", period: "vecka", type: "training" },
  { id: "challenge2", name: "Hattrick i match", period: "månad", type: "match" },
  { id: "challenge3", name: "Tränat extra utanför ordinarie träning", period: "vecka", type: "extra" },
  { id: "challenge4", name: "Veckans lagspelare (röstad av laget)", period: "vecka", type: "social" }
];

const seasonAwards = [
  { id: "award1", name: "Årets lagspelare", description: "Flest MVP-röster under säsongen" },
  { id: "award2", name: "Årets träningsmaskin", description: "Flest träningspass under säsongen" },
  { id: "award3", name: "Årets målskytt", description: "Flest gjorda mål under säsongen" },
  { id: "award4", name: "Årets assistkung", description: "Flest assist under säsongen" }
];

function getAwardWinner(users: any[]): string {
  return users[0]?.name ?? "Ingen";
}

const getRandomChallenge = () => {
  if (allChallenges.length === 0) return undefined;
  const idx = Math.floor(Math.random() * allChallenges.length);
  return allChallenges[idx];
};

// Demo: Alla poäng och statistik är noll, badges tomma, men namn och tröjnummer är riktiga
// Demo: Alla poäng är noll
const getTotalPoints = (_player: any) => 0;

const Gamification: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUser();
  const [search, setSearch] = useState("");
  const [weeklyVote, setWeeklyVote] = useState<string>("");
  const handleWeeklyVote = (id: string) => setWeeklyVote(id);

  // Filtrera och visa endast godkända användare
  const approvedUsers = users.filter(u => u.isApproved);
  const leaderboard = approvedUsers
    .map(p => ({ ...p, points: getTotalPoints(p) }))
    .sort((a, b) => b.points - a.points);
  const currentUser = leaderboard.find(p => p.id === user?.id);
  const todaysChallenge = getRandomChallenge();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f8fafc", fontFamily: "inherit", padding: "1.2rem 0", position: "relative" }}>
      {/* Rubrik och förklaring */}
      <div style={{ maxWidth: 700, margin: "0 auto", marginBottom: "2.2rem", textAlign: "center" }}>
        <h1 style={{ color: "#22c55e", fontWeight: 900, fontSize: "2.1rem", marginBottom: "0.5rem" }}>FBC Gamification</h1>
        <div style={{ color: "#cbd5e1", fontSize: "1.15rem", fontWeight: 400 }}>
          Samla poäng, utmana dig själv och laget, rösta på veckans spelare och följ din utveckling. Allt sker automatiskt – du fokuserar på att ha kul och bli bättre!
        </div>
      </div>
      {/* Personlig översikt */}
      {currentUser && (
        <div style={{ maxWidth: 700, margin: "0 auto", background: "rgba(34,197,94,0.10)", borderRadius: 18, boxShadow: "0 4px 15px #22c55e22", padding: "2rem 1.5rem", marginBottom: "2.5rem" }}>
          <h2 style={{ color: "#22c55e", fontWeight: 800, fontSize: "1.5rem", marginBottom: "1.2rem" }}>Din profil</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
            <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "1.25rem" }}>{currentUser.name} <span style={{ color: "#a3e635", fontWeight: 600, fontSize: "1rem" }}>#{currentUser.id}</span></div>
            <div style={{ color: "#22c55e", fontWeight: 800, fontSize: "1.18rem" }}>{currentUser.points} poäng</div>
          </div>
        </div>
      )}
      {/* Sök/filter */}
      <div style={{ maxWidth: 700, margin: "0 auto", marginBottom: "2rem" }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Sök spelare eller utmärkelse..." style={{ width: "100%", padding: "0.7rem", borderRadius: 8, border: "1px solid #22c55e", fontSize: "1rem", background: "#181f2a", color: "#F1F8E9", marginBottom: "0.7rem" }} />
      </div>
      {/* Topplista: Endast de 5 bästa */}
      <div style={{ maxWidth: 700, margin: "0 auto", background: "rgba(34,197,94,0.10)", borderRadius: 18, boxShadow: "0 4px 15px #22c55e22", padding: "2rem 1.5rem", marginBottom: "2.5rem" }}>
        <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.3rem", marginBottom: "1.2rem" }}>Topplista</h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {leaderboard.slice(0, 5).map((player, i) => (
            <li key={player.id} style={{ display: "flex", alignItems: "center", gap: "1.2rem", background: i === 0 ? "#22c55e22" : "#181f2a", borderRadius: 12, marginBottom: 10, padding: "1rem 1.2rem", fontWeight: 700, fontSize: "1.15rem", boxShadow: i === 0 ? "0 4px 15px #22c55e44" : "none", transition: "background 0.3s" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: i === 0 ? "#22c55e" : "#cbd5e1", minWidth: 32 }}>{i + 1}</span>
              <span style={{ fontWeight: 700, color: "#f8fafc", minWidth: 120 }}>{player.name} <span style={{ color: "#a3e635", fontWeight: 600, fontSize: "1rem" }}>#{player.id}</span></span>
              <span style={{ color: "#22c55e", fontWeight: 800, fontSize: "1.18rem", marginLeft: "auto" }}>{player.points} poäng</span>
            </li>
          ))}
        </ol>
      </div>
      {/* Poängsystem: lista på alla sätt att få poäng */}
      <div style={{ maxWidth: 700, margin: "0 auto", background: "rgba(16,32,16,0.97)", borderRadius: "1.2rem", boxShadow: "0 4px 15px #22c55e22", padding: "1.2rem 1.5rem", marginBottom: "2.5rem" }}>
        <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.7rem" }}>Så här får du poäng</h2>
        <ul style={{ color: "#cbd5e1", fontSize: "1.08rem", paddingLeft: "1.2rem", margin: 0 }}>
          {pointsList.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>
              <span style={{ color: item.auto ? "#22c55e" : "#a3e635", fontWeight: 700 }}>{item.label}</span>
              <span style={{ marginLeft: 8, color: "#fff" }}>+{item.points} poäng</span>
              {item.auto && <span style={{ marginLeft: 8, color: "#38bdf8", fontSize: "0.95rem" }}>(automatiskt)</span>}
            </li>
          ))}
        </ul>
      </div>
      {/* Veckans spelare-röstning */}
      <div style={{ maxWidth: 700, margin: "0 auto", background: "rgba(34,197,94,0.10)", borderRadius: 18, boxShadow: "0 4px 15px #22c55e22", padding: "1.2rem 1.5rem", marginBottom: "2.5rem" }}>
        <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.7rem" }}>Rösta på Veckans spelare</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem" }}>
          {leaderboard.map((player) => (
            <button
              key={player.id}
              onClick={() => handleWeeklyVote(player.id)}
              style={{
                background: weeklyVote === player.id ? "#22c55e" : "#181f2a",
                fontWeight: 700,
                fontSize: "1.08rem",
                boxShadow: "0 2px 8px #22c55e22",
                border: "none",
                cursor: "pointer"
              }}
            >
              {player.name} <span style={{ color: "#a3e635", fontWeight: 600, fontSize: "1rem" }}>#{player.jerseyNumber || player.id}</span>
            </button>
          ))}
        </div>
        {weeklyVote && (
          <div style={{ marginTop: 12, color: "#22c55e", fontWeight: 700 }}>
            Du har röstat på <span style={{ color: "#fff" }}>{leaderboard.find((p) => p.id === weeklyVote)?.name}</span> som Veckans spelare!
          </div>
        )}
      </div>
      {/* Dagens utmaning */}
      <div style={{ maxWidth: 700, margin: "0 auto", background: "rgba(16,32,16,0.97)", borderRadius: "1.2rem", boxShadow: "0 4px 15px #22c55e22", padding: "1.2rem 1.5rem", marginBottom: "2.5rem" }}>
        <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.3rem", marginBottom: "1.2rem" }}>Dagens utmaning</h2>
        <div style={{ background: "#181f2a", borderRadius: 10, padding: "0.7rem 1.1rem", color: "#22c55e", fontWeight: 700, fontSize: "1.08rem", boxShadow: "0 2px 8px #22c55e22", marginBottom: "0.7rem" }}>
          <span style={{ fontSize: "1.15rem", marginRight: 8 }}>🔥</span>
          {todaysChallenge ? (
            <>
              {todaysChallenge.name} <span style={{ fontWeight: 400, fontSize: "0.95rem", color: "#a3e635" }}>({todaysChallenge.period})</span>
            </>
          ) : (
            <span>Ingen utmaning idag</span>
          )}
        </div>
      </div>
      {/* Säsongspriser */}
      <div style={{ maxWidth: 700, margin: "0 auto", background: "rgba(34,197,94,0.10)", borderRadius: 18, boxShadow: "0 4px 15px #22c55e22", padding: "1.2rem 1.5rem", marginBottom: "2.5rem" }}>
        <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.7rem" }}>Säsongspriser</h2>
        <ul style={{ color: "#cbd5e1", fontSize: "1.08rem", paddingLeft: "1.2rem", margin: 0 }}>
          <li>🏆 {seasonAwards?.[0]?.name ?? ""}: <span style={{ color: "#22c55e", fontWeight: 700 }}>{getAwardWinner(leaderboard)}</span> <span style={{ color: "#a3e635" }}>({seasonAwards?.[0]?.description ?? ""})</span></li>
          <li>💪 {seasonAwards?.[1]?.name ?? ""}: <span style={{ color: "#22c55e", fontWeight: 700 }}>{getAwardWinner(leaderboard)}</span> <span style={{ color: "#a3e635" }}>({seasonAwards?.[1]?.description ?? ""})</span></li>
          <li>⚽ {seasonAwards?.[2]?.name ?? ""}: <span style={{ color: "#22c55e", fontWeight: 700 }}>{getAwardWinner(leaderboard)}</span> <span style={{ color: "#a3e635" }}>({seasonAwards?.[2]?.description ?? ""})</span></li>
          <li>🅰️ {seasonAwards?.[3]?.name ?? ""}: <span style={{ color: "#22c55e", fontWeight: 700 }}>{getAwardWinner(leaderboard)}</span> <span style={{ color: "#a3e635" }}>({seasonAwards?.[3]?.description ?? ""})</span></li>
        </ul>
      </div>
      {/* Automatisk poängsättning: demo-info */}
      <div style={{ maxWidth: 700, margin: "0 auto", background: "rgba(16,32,16,0.97)", borderRadius: "1.2rem", boxShadow: "0 4px 15px #22c55e22", padding: "1.2rem 1.5rem", marginBottom: "2.5rem" }}>
        <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.7rem" }}>Automatiska poäng</h2>
        <ul style={{ color: "#cbd5e1", fontSize: "1.08rem", paddingLeft: "1.2rem", margin: 0 }}>
          <li>Antal träningar hämtas automatiskt från träningslogg</li>
          <li>Poäng på matcher hämtas automatiskt från matchstatistik</li>
          <li>Registrerade träningar ger automatiskt poäng</li>
          <li>Streaks (antal träningar i rad) räknas automatiskt</li>
        </ul>
        <div style={{ color: "#a3e635", fontSize: "0.95rem", marginTop: 8 }}>
          (Integration med träningslogg och matchstatistik kan aktiveras när data finns)
        </div>
      </div>
      {/* Poängförklaring */}
      <div style={{ maxWidth: 700, margin: "0 auto", background: "rgba(34,197,94,0.10)", borderRadius: 18, boxShadow: "0 4px 15px #22c55e22", padding: "1.2rem 1.5rem", marginBottom: "2.5rem" }}>
        <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.7rem" }}>Hur får man poäng?</h2>
        <ul style={{ color: "#cbd5e1", fontSize: "1.08rem", paddingLeft: "1.2rem", margin: 0 }}>
          <li>Deltagit i träning eller match</li>
          <li>Gjort mål, assist, räddning, block</li>
          <li>Vunnit "Veckans spelare" eller MVP</li>
          <li>Genomfört utmaningar eller milstolpar</li>
          <li>Fått utmärkelser eller badges</li>
          <li>Tränat extra utanför ordinarie träning</li>
          <li>Bidragit till lagkänsla och "fair play"</li>
        </ul>
      </div>
    </div>
  );
};

export default Gamification;
