import React, { useCallback, useState } from 'react';
import Chart from '../chart/Chart';
import useUpbitAxios from '../../hooks/useUpbitAxios';
import Loading from '../loading/Loading';

const upbitOption = {
  date: "days",
  stock: "KRW-BTC"
}

const options = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};




const Main = () => {
  const { data, isLoading, reAxios } = useUpbitAxios(options, upbitOption);
  const [index, setIndex] = useState(1);

  const shiftLeft = () => {
    console.log("shift Left", index);
    setIndex(index + 1);
  }

  const shiftRight = () => {
    if(index <= 1) return true;
    setIndex(index - 1);
  }
  
  return (
    <div>
      {isLoading ? <Loading /> : <Chart canvasData={data} index={index} shiftLeft={shiftLeft} shiftRight={shiftRight}/>}
      {/* <h1>{`${data}`}</h1> */}
      <button onClick={() => reAxios()}>reAxios</button>
      
    </div>
  );
};

export default Main;
