import React from "react";
import styles from "./League.module.css";

const teams = [
  "Djurgårdens IF IBS",
  "Farsta IBK",
  "FBC Nyköping",
  "FBC Sollentuna",
  "Huddinge IBS",
  "Hässelby SK IBK",
  "Nacka IBK",
  "Nykvarns IF Utveckling",
  "Rosersberg Arlanda IBK",
  "Värmdö IF",
  "Åkersberga IBF",
  "Älvsjö AIK IBF",
];

const columns = ["Lag", "S", "V", "O (SDV)", "F", "GM-IM", "+/-", "P", "Senaste 5"];

const League: React.FC = () => {
  return (
    <div className={styles.leagueRoot}>
      <div className={styles.leagueContainer}>
        <h1 className={styles.leagueTitle}>Liga & Tabell</h1>
        <div className={styles.leagueInfo}>
          Vi väntar på rättigheter att få visa tabellen live från Svensk Innebandy. Tills vidare visas en demo-version.
        </div>
        <div className={styles.leagueTableWrapper}>
          <table className={styles.leagueTable}>
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={col}
                    className={i === 0 ? `${styles.leagueTh} ${styles.leagueThFirst}` : styles.leagueTh}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => (
                <tr
                  key={team}
                  className={
                    idx % 2 === 0
                      ? `${styles.leagueTr} ${styles.leagueTrEven}`
                      : `${styles.leagueTr} ${styles.leagueTrOdd}`
                  }
                >
                  <td className={styles.leagueTd}>{team}</td>
                  <td className={styles.leagueTdCenter}>0</td>
                  <td className={styles.leagueTdCenter}>0</td>
                  <td className={styles.leagueTdCenter}>0 (0)</td>
                  <td className={styles.leagueTdCenter}>0</td>
                  <td className={styles.leagueTdCenter}>0 - 0</td>
                  <td className={styles.leagueTdCenter}>0</td>
                  <td className={styles.leagueTdCenter}>0</td>
                  <td className={styles.leagueTdLast}>saknas</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default League;
