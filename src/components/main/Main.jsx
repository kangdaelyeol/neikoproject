import React, { useState, useEffect, useRef } from 'react';
import Chart from '../chart/Chart';
import useUpbitAxios from '../../hooks/useUpbitAxios';
import Loading from '../loading/Loading';
import { useNavigate, useLocation } from 'react-router';
import Detail from '../detail/Detail';
import styles from './main.module.css';

// const upbitOption = {
//   date: "days",
//   stock: "KRW-BTC"
// }

const options = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const upbitOption = location.state?.upbitOption ?? false;
  const dateIntervalRef = useRef();
  const chartContainerRef = useRef();

  const { data, isLoading, reAxios } = useUpbitAxios(options, upbitOption);
  const [isDetail, setDetail] = useState({
    data: false,
    active: false,
  });
  const [indexOption, setIndex] = useState({
    index: 1,
    interval: 1,
  });
  const closeDetail = () => {
    setDetail({
      ...isDetail,
      active: false,
    });
  };

  const onResearch = () => {
    navigate("/");
  }
  useEffect(() => {
    if (!upbitOption) {
      navigate('/');
    }
  });

  // detail component 반환
  const showDetail = (inform) => {
    console.log(inform);
    setDetail({
      ...isDetail,
      active: true,
      data: inform,
    });
  };

  // 왼쪽으로 옮기기
  const shiftLeft = () => {
    // index검사
    if (
      (indexOption.index + 5) * indexOption.interval >
      Object.keys(data).length
    )
      return true;
    setIndex({
      ...indexOption,
      index: indexOption.index + 1,
    });
  };

  // 오른쪽으로 옮기기
  const shiftRight = () => {
    // index검사
    if (indexOption.index <= 1) return true;
    setIndex({
      ...indexOption,
      index: indexOption.index - 1,
    });
  };

  // custom 날짜 간격 세팅
  const cDateIntervalSet = () => {
    const value = dateIntervalRef.current.value;
    if (value <= 0) {
      console.log(value);
      return;
    }
    setInterval(Math.ceil(dateIntervalRef.current.value));
  };

  // 날짜 간격 세팅 -> 1, 7, 30
  const dateIntervalSet = (e) => {
    if (e.target.nodeName !== 'BUTTON') return;
    const interval = Number(e.target.value);
    setInterval(interval);
  };

  const setInterval = (interval) => {
    if (1 + interval * 5 > Object.keys(data).length) return;
    setIndex({
      ...indexOption,
      interval,
      index: 1,
    });
  };
  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <h1 className={styles.title}>result for {upbitOption.stock}</h1>
      </div>
      <div className={styles.main__wrapper}>
        <div className={`${styles.main__chart}`} ref={chartContainerRef}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Chart
                canvasData={data}
                indexOption={indexOption}
                shiftLeft={shiftLeft}
                shiftRight={shiftRight}
                showDetail={showDetail}
                isDetail={isDetail}
              />
              <Detail
                data={isDetail.data}
                isDetail={isDetail}
                closeDetail={closeDetail}
                stock={upbitOption.stock}
              />
            </>
          )}
        </div>
      </div>
      <div className={styles.main__option}>
        <div onClick={dateIntervalSet} className={styles.buttonFrg}>
          <button className={styles.button} value='1'>
            1day
          </button>
          <button className={styles.button} value='7'>
            7days
          </button>
          <button className={styles.button} value='30'>
            30days
          </button>
        </div>
        <div className={styles.buttonFrg}>
          <input min='1' ref={dateIntervalRef} type='number' />
          <button onClick={cDateIntervalSet} className={styles.button}>days</button>
        </div>
        <button onClick={onResearch} className={styles.button}>다시 조회</button>
      </div>
    </div>
  );
};

export default Main;
