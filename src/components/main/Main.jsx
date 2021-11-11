import React from 'react';
import Chart from '../chart/Chart';
import useUpbitAxios from '../../hooks/useUpbitAxios';

const upbitOption = {
  date: "days",
  stock: "KRW-BTC"
}

const options = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

const Main = () => {
  const { allResult, isLoading, reAxios } = useUpbitAxios(options, upbitOption);
  console.log(allResult);
  console.log("render");

  return (
    <div>
      <h1>{`${isLoading ? "Loading" : "no_Loading"}`}</h1>
      {/* <h1>{`${allResult}`}</h1> */}
      <button onClick={() => reAxios()}>reAxios</button>
      <Chart />
    </div>
  );
};

export default Main;
