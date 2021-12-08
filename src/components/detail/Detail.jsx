import React from 'react';
import styles from './detail.module.css';

const Detail = ({ data, isDetail, closeDetail, stock }) => {
  const {
    date,
    price, // 나의 자산
    stockPrice, // 코인의 가치
    earningsRate,
    avgUnitPrice,
    totalInvest,
    coinCount,
  } = data;
  console.log(data);
  const onCloseClick = () => {
    closeDetail();
  };
  // 수익이 났는지 -> 수익률 STYLE
  let isEarning = Number(earningsRate) >= 0;

  return (
    <div
      className={`${styles.detail} ${isDetail.active ? styles.moveRight : ''}`}
    >
      <div className={styles.contents}>
        <div className={styles.topContents}>
          <span className={styles.title}>{stock} / <span className={styles.stockPrice}>{stockPrice}</span></span>
          <span className={styles.date}>{date}</span>
        </div>
        <div className={styles.mainContents}>
          <span className={styles.content}>평균 단가: {avgUnitPrice}</span>
          <span className={styles.content}>현재 단가: {stockPrice}</span>
          <span className={styles.content}>잔고 수량: {coinCount}</span>
          <span className={styles.content}>총 투자 자산: {totalInvest}</span>
          <span className={styles.content}>현재 자산: {price} / <span className={`${styles.earningsRate} ${isEarning ? styles.red : styles.blue}`}>{earningsRate}%</span></span>
          
        </div>
      </div>
      <div onClick={onCloseClick} className={styles.activeClose}>
        closeBtn!
      </div>
    </div>
  );
};

export default Detail;
