import React, { useCallback, useState } from 'react';
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
//           output: canvasDatas: Object(id, price, data)
//     writing date: 2021/11/11
//           writer: 강대렬
const factoringForCanvasData = (upbitData) => {
  // console.log(typeof upbitData);
  // if(typeof upbitData !== "Array"){
  //   throw new Error("type error upbltData");
  // }
  const canvasDatas = {};
  upbitData.forEach((item, idx) => {
    const date = item.candle_date_time_utc.substr(2, 8);
    const price = item.trade_price;
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
  let canvasData = null;
  // console.log("remder");
  if(!isLoading){
    // console.log(allResult);
    // canvasData = factoringForCanvasData(allResult);
  }
  console.log(canvasData);
  const [index, setIndex] = useState(0);
  const shiftLeft = () => {
    setIndex(index + 1);
  }
  const shiftRight = () => {
    if(index <= 0) return;
    setIndex(index - 1);
  }
  // const canvasData = factoringForCanvasData(allResult);
  
  return (
    <div>
      <h1>{`${isLoading 
      ? "Loading" 
        :<Chart canvasData={canvasData} index={index} shiftLeft={shiftLeft} shiftRight={shiftRight}/>}`}</h1>
      {/* <h1>{`${allResult}`}</h1> */}
      <button onClick={() => reAxios()}>reAxios</button>
      
    </div>
  );
};

export default Main;
