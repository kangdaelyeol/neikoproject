import React from "react";
import styles from "./loading.module.css";

const Loading = () => {

  return (<div className={styles.main}>
    <div className={styles.loader}>Loading...</div>
  </div>)
}


export default Loading;