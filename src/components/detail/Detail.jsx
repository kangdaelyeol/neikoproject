import React from 'react';
import styles from './detail.module.css';

const Detail = ({ inform }) => {
  const { date, price, myPrice, earningsRate, avgUnitPrice, totalInvest } =
    inform;

  return (
    <div className={styles.detail}>
      <h1 className={styles.title}></h1>
    </div>
  );
};

export default Detail;
