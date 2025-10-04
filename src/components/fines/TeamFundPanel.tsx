import React from "react";
import styles from "./TeamFundPanel.module.css";
import { Fine } from "../../types/fine";

interface Props {
  fines: Fine[];
}

const TeamFundPanel: React.FC<Props> = ({ fines }) => {
  const total = fines.reduce((sum, fine) => sum + fine.amount, 0);

  return (
    <section className={styles.teamFundPanel}>
      <h3 className={styles.teamFundPanel__title}>Totalt i lagkassan</h3>
      <div className={styles.teamFundPanel__total}>{total} kr</div>
      <div className={styles.teamFundPanel__desc}>Summering av alla utdelade böter</div>
    </section>
  );
};

export default TeamFundPanel;