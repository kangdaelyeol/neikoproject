import React, { useCallback, useState } from 'react';
import Chart from '../chart/Chart';
import useUpbitAxios from '../../hooks/useUpbitAxios';
import Loading from '../loading/Loading';
import { useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react/cjs/react.development';

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
  
  const { data, isLoading, reAxios } = useUpbitAxios(options, upbitOption);
  const [indexOption, setIndex] = useState({
    index: 1,
    interval: 1
  });
  useEffect(() => {
    if (!upbitOption) {
      navigate('/');
    }
  });
  const shiftLeft = () => {
    if(indexOption.index + 5 > Object.keys(data).length) return true;
    setIndex({
      ...indexOption,
    index: indexOption.index + 1
  });
  };

  const shiftRight = () => {
    if (indexOption.index <= 1) return true;
    setIndex({
      ...indexOption,
      index: indexOption.index - 1
    });
  };

  const onDateIntervalSet = (e) => {
    if(e.target.nodeName !== "BUTTON") return;
    const interval = Number(e.target.value);
    setIndex({
      ...indexOption,
      interval
    });
  }

  return (
    <div>
      <h1 className="title">result for {upbitOption.stock}</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <Chart
          canvasData={data}
          indexOption={indexOption}
          shiftLeft={shiftLeft}
          shiftRight={shiftRight}
        />
      )}
      {/* <h1>{`${data}`}</h1> */}
      <button onClick={() => reAxios()}>reAxios</button>
      <div onClick={onDateIntervalSet} className="selectButton">
        <button value="1">1일 간격</button>
        <button value="7">7일 간격</button>
        <button value="30">30일 간격</button>
      </div>
    </div>
  );
};

export default Main;
