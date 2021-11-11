import { useEffect, useState } from 'react';
import axios from 'axios';

// function name: useUpbitAxios
// function explain: upbit는 데이터를 200개까지만 반환하는 한계가 있어
//                   결과를 판단하고 재귀 반복적으로 url을 받아서 데이터를 모두 받아서 반환하고
//                   loading 상태를 나타내는 상태변수와
//                   트리거 함수 를 통해 다시 요청할 수 있음
//            input: axiosOption(method, data), upbitOption: StockOption, DateOption
//           output: data: Response, isloading: Boolean, trigger: Function
//     writing date: 2021/11/11
//           writer: 강대렬
const useUpbitAxios = (option, upbitOption) => {
  // 받은 upbitOption으로 요청할 url 생성
  const [allResult, setAllResult] = useState(null);
  const [trigger, setTrigger] = useState(Date.now());
  const [isLoading, setLoading] = useState(false);
  const url = `https://api.upbit.com/v1/candles/${upbitOption.date}?market=${upbitOption.stock}&count=200`;

  useEffect(() => {
    option.url = url;
    let result = [];
    let data = null;
    //Start Axios
    setLoading(true);
    setAllResult(null);
    axios(option)
      .then((response) => {
        // console.log(response.data);
        data = response.data;
        result = [...data];
        let newSearchDateOption = null;

        // definition of recursive logic
        const recursiveAxios = () => {
          newSearchDateOption = `${data[199].candle_date_time_utc}Z`;
          const newOption = {
            ...option,
            url: `https://api.upbit.com/v1/candles/${upbitOption.date}?market=${upbitOption.stock}&to=${newSearchDateOption}&count=200`,
          };
          axios(newOption)
            .then((response) => {
              data = response.data;
              result = [...result, ...data];
              if (data.length === 200) {
                recursiveAxios();
              } else {
                setAllResult([...result]);
                setLoading(false);
              }
            })
            .catch(console.log);
        };
        if (data.length === 200){
          recursiveAxios();
        }
        else {
          setAllResult([...result]);
          setLoading(false);
        }
      }) // end recursive logic
      .catch((e) => {
        console.log(e.message);
        data = null;
        setLoading(false);
      });
    // end Axios
  }, [trigger]);

  const reAxios = () => {
    setTrigger(Date.now());
  };

  return { allResult, isLoading, reAxios };
};

export default useUpbitAxios;