import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import css from "./Gamification.module.css";

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
    <div className={css.root}>
      <div className={css.backBtnWrap}>
        <button
          className={css.backBtn}
          onClick={() => window.location.href = '/'}
        >
          Tillbaka
        </button>
      </div>
      {/* Rubrik och förklaring */}
      <div className={css.center}>
        <h1 className={css.heading}>FBC Gamification</h1>
        <div className={css.subheading}>
          Samla poäng, utmana dig själv och laget, rösta på veckans spelare och följ din utveckling. Allt sker automatiskt – du fokuserar på att ha kul och bli bättre!
        </div>
      </div>
      {/* Personlig översikt */}
      {currentUser && (
        <div className={css.card}>
          <h2 className={css.sectionTitle}>Din profil</h2>
          <div className={css.profileRow}>
            <div className={css.profileName}>{currentUser.name} <span className={css.profileId}>#{currentUser.id}</span></div>
            <div className={css.profilePoints}>{currentUser.points} poäng</div>
          </div>
        </div>
      )}
      {/* Sök/filter */}
      <div className={css.inputRow}>
        <input className={css.inputField} type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Sök spelare eller utmärkelse..." />
      </div>
      {/* Topplista: Endast de 5 bästa */}
      <div className={css.card}>
        <h2 className={css.sectionTitle}>Topplista</h2>
        <ol className={css.leaderboardList}>
          {leaderboard.slice(0, 5).map((player, i) => (
            <li key={player.id} className={i === 0 ? `${css.leaderboardItem} ${css.first}` : css.leaderboardItem}>
              <span className={i === 0 ? css.leaderboardRank : `${css.leaderboardRank} ${css.other}`}>{i + 1}</span>
              <span className={css.leaderboardName}>{player.name} <span className={css.leaderboardId}>#{player.id}</span></span>
              <span className={css.leaderboardPoints}>{player.points} poäng</span>
            </li>
          ))}
        </ol>
      </div>
      {/* Poängsystem: lista på alla sätt att få poäng */}
      <div className={css.cardDark}>
        <h2 className={css.sectionTitle}>Så här får du poäng</h2>
        <ul className={css.pointsList}>
          {pointsList.map((item, idx) => (
            <li key={idx} className={css.pointsItem}>
              <span className={item.auto ? css.pointsLabel : `${css.pointsLabel} ${css.manual}`}>{item.label}</span>
              <span className={css.pointsValue}>+{item.points} poäng</span>
              {item.auto && <span className={css.pointsAuto}>(automatiskt)</span>}
            </li>
          ))}
        </ul>
      </div>
      {/* Veckans spelare-röstning */}
      <div className={css.card}>
        <h2 className={css.sectionTitle}>Rösta på Veckans spelare</h2>
        <div className={css.voteRow}>
          {leaderboard.map((player) => (
            <button
              key={player.id}
              onClick={() => handleWeeklyVote(player.id)}
              className={weeklyVote === player.id ? `${css.voteBtn} ${css.selected}` : css.voteBtn}
            >
              {player.name} <span className={css.leaderboardId}>#{player.jerseyNumber || player.id}</span>
            </button>
          ))}
        </div>
        {weeklyVote && (
          <div className={css.voteResult}>
            Du har röstat på <span className={css.voteName}>{leaderboard.find((p) => p.id === weeklyVote)?.name}</span> som Veckans spelare!
          </div>
        )}
      </div>
      {/* Dagens utmaning */}
      <div className={css.cardDark}>
        <h2 className={css.sectionTitle}>Dagens utmaning</h2>
        <div className={css.challengeCard}>
          <span className={css.challengeIcon}>🔥</span>
          {todaysChallenge ? (
            <>
              {todaysChallenge.name} <span className={css.challengePeriod}>({todaysChallenge.period})</span>
            </>
          ) : (
            <span>Ingen utmaning idag</span>
          )}
        </div>
      </div>
      {/* Säsongspriser */}
      <div className={css.card}>
        <h2 className={css.sectionTitle}>Säsongspriser</h2>
        <ul className={css.seasonAwards}>
          <li>🏆 {seasonAwards?.[0]?.name ?? ""}: <span className={css.seasonAwardName}>{getAwardWinner(leaderboard)}</span> <span className={css.seasonAwardDesc}>({seasonAwards?.[0]?.description ?? ""})</span></li>
          <li>💪 {seasonAwards?.[1]?.name ?? ""}: <span className={css.seasonAwardName}>{getAwardWinner(leaderboard)}</span> <span className={css.seasonAwardDesc}>({seasonAwards?.[1]?.description ?? ""})</span></li>
          <li>⚽ {seasonAwards?.[2]?.name ?? ""}: <span className={css.seasonAwardName}>{getAwardWinner(leaderboard)}</span> <span className={css.seasonAwardDesc}>({seasonAwards?.[2]?.description ?? ""})</span></li>
          <li>🅰️ {seasonAwards?.[3]?.name ?? ""}: <span className={css.seasonAwardName}>{getAwardWinner(leaderboard)}</span> <span className={css.seasonAwardDesc}>({seasonAwards?.[3]?.description ?? ""})</span></li>
        </ul>
      </div>
      {/* Automatisk poängsättning: demo-info */}
      <div className={css.cardDark}>
        <h2 className={css.sectionTitle}>Automatiska poäng</h2>
        <ul className={css.pointsList}>
          <li>Antal träningar hämtas automatiskt från träningslogg</li>
          <li>Poäng på matcher hämtas automatiskt från matchstatistik</li>
          <li>Registrerade träningar ger automatiskt poäng</li>
          <li>Streaks (antal träningar i rad) räknas automatiskt</li>
        </ul>
        <div className={css.automaticInfo}>
          (Integration med träningslogg och matchstatistik kan aktiveras när data finns)
        </div>
      </div>
      {/* Poängförklaring */}
      <div className={css.card}>
        <h2 className={css.sectionTitle}>Hur får man poäng?</h2>
        <ul className={css.pointsList}>
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
