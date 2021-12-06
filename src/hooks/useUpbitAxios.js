import { useEffect, useState } from 'react';
import axios from 'axios';
import InvestManager from '../services/investCalculator';

// function name: factoringForCanvasData
// function explain: axios를 통해 받은 배열 데이터를 canvas에 호환되는 데이터로 만든다.
//            input: upbitData: Array
//           output: canvasDatas: Object(id, price, data)
//     writing date: 2021/11/11
//           writer: 강대렬

const manager = new InvestManager();

const factoringForCanvasData = (upbitData, options) => {
  const canvasDatas = {};
  // date 겹침 -> investDate로 투자한 날짜 변경

  upbitData.forEach((item, idx) => {
    const date = item.candle_date_time_utc.substr(2, 8);
    const price = item.trade_price;
    canvasDatas[idx + 1] = {
      id: idx + 1, // id - latest data
      price, // current price (현재 코인 가격)
      date, // current date (현재 날짜)
      // my investment value (내 투자 금액)
      // earning ratio (수익률)
    };
  });

  // 데이터 가공 -> simple / compound option 정보 가공 수행

  // canvas에게 그리는 데이터 전달.
  return canvasDatas;
};

// function name: useUpbitAxios
// function explain: upbit는 데이터를 200개까지만 반환하는 한계가 있어
//                   결과를 판단하고 재귀 반복적으로 url을 받아서 데이터를 모두 받아서 반환하고
//                   loading 상태를 나타내는 상태변수와
//                   트리거 함수 를 통해 다시 요청할 수 있음
//            input: axiosOption(method, data), upbitOption: StockOption, DateOption
//           output: data: Response, isloading: Boolean, trigger: Function
//     writing date: 2021/11/11
//           writer: 강대렬
const invManager = new InvestManager();

const useUpbitAxios = (option, upbitOption) => {
  // 받은 upbitOption으로 요청할 url 생성
  const [trigger, setTrigger] = useState(null);
  const [state, setState] = useState({
    data: null,
    isLoading: true,
  });
  const url = `https://api.upbit.com/v1/candles/${upbitOption.date}?market=${upbitOption.stock}&count=200`;

  const reAxios = () => {
    setState({
      ...state,
      data: null,
      isLoading: true,
    });
    setTrigger(Date.now());
  };

  useEffect(() => {
    if (!upbitOption) return;
    option.url = url;
    let result = [];
    let data = null;
    //Start Axios
    // setAllResult(null);

    console.log('OUTSIDE AXIOS START');
    axios(option)
      .then((response) => {
        console.log('INSIDE AXIOS START');
        data = response.data;
        result = [...data];
        let newSearchDateOption = null;

        // ---------- definition of recursive logic ---------
        const recursiveAxios = () => {
          newSearchDateOption = `${data[199].candle_date_time_utc}Z`;
          const newOption = {
            ...option,
            url: `https://api.upbit.com/v1/candles/${upbitOption.date}?market=${upbitOption.stock}&to=${newSearchDateOption}&count=200`,
          };
          axios(newOption)
            .then((response) => {
              data = response.data;
              // console.log(data);
              result = [...result, ...data];
              if (data.length === 200) {
                console.log('length === 200 ->recursiveAXIOS');
                return recursiveAxios();
              } else {
                const factoringData = factoringForCanvasData(
                  [...result],
                  upbitOption,
                );
                console.log('Set All Result');
                setState({
                  ...state,
                  data: factoringData,
                  isLoading: false,
                });
                return;
              }
            })
            .catch(console.log);
        };
        //  ------------ end definition RecurSiveAxios --------

        if (data.length === 200) {
          console.log('if length === 200');
          return recursiveAxios();
        } else {
          console.log('else length - 호출 ㄴㄴ');
          const factoringData = factoringForCanvasData([...result]);
          console.log(factoringData);
          setState({
            ...state,
            data: factoringData,
            isLoading: false,
          });
        }
        console.log('INSIDE AXIOS END');
      }) // end recursive logic, AXIOS
      .catch((e) => {
        console.log(e.message);
        setState({
          ...state,
          data: null,
          isLoading: false,
        });
      });
    console.log('OUTSIDE AXIOS END');
    // end Axios
  }, [trigger]);

  console.log('RETURN AXIOS');
  return { ...state, reAxios };
};

export default useUpbitAxios;
