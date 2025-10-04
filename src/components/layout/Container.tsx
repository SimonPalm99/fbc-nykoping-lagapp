
import React from "react";
import styles from "./Container.module.css";

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.container}>
    {children}
  </div>
);

export default Container;