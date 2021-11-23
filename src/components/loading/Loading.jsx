import React from "react";
import styles from "./loading.module.css";

const Loading = () => {

  return (<div className={styles.main}>
    <div className={styles.spinner}>
      <div className={styles.background}></div>
    </div>
    <div className={styles.circle}>

    </div>
    <div className={styles.content}>
      Loading
    </div>
  </div>)
}


export default Loading;