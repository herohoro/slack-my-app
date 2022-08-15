import React from "react";
import ReactLoading from "react-loading";
import styles from "../styles/Home.module.css";

const Loading = () => (
  <ReactLoading
    type="bubbles"
    color="rgba(255 199 120)"
    height={200}
    width={200}
    className={styles.loading}
  />
);

export default Loading;
