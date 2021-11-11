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


// function name: factoringForCanvasData
// function explain: axios를 통해 받은 배열 데이터를 canvas에 호환되는 데이터로 만든다.
//            input: upbitData: Array
//           output: canvasDatas: Object
//     writing date: 2021/11/11
//           writer: 강대렬
const factoringForCanvasData = (upbitData) => {
  if(typeof upbitData !== "Array"){
    throw new Error("type error upbltData");
  }
  const canvasDatas = {};
  upbitData.forEach((item, idx) => {
    const date = item[idx].candle_date_time_utc.substr(3, 7);
    const price = item[idx].trade_price;
    canvasDatas[idx + 1] = {
      id: idx + 1,
      price,
      date
    }
  });
  return canvasDatas;  
}

const Main = () => {
  const { allResult, isLoading, reAxios } = useUpbitAxios(options, upbitOption);
  console.log(allResult);
  console.log("render");
  const canvasData = factoringForCanvasData(allResult);
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
