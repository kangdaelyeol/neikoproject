import { compoundInterest, howMuchMyMoney } from './investlogic.js';

// 하루 밀리세컨드
const DAYMILLSECOND = 1000 * 3600 * 24;

class InvestManager {
  createCanvasData = (upbitData, investOption) => {
    let canvasData = null;

    // 배열의 길이는 날짜 차이 (DATEdiff) + 1
    const dateIndex = extractDate(investOption.date) + 1;
    const extractResult = {};

    // fetchData에서 추출할 정보 -> 날짜, 코인가격
    for (let i = 0; i < dateIndex; i++) {
      // substr -> yyyy-mm-dd
      const date = upbitData[i].candle_date_time_utc.substr(0, 10);
      const price = upbitData[i].trade_price;
      extractResult[i + 1] = {
        id: i + 1,
        date,
        price,
      };
    }
    // 투자한 옵션(단리, 복리)에 따라 작업 수행
    switch (investOption.investOption) {
      case 'compound':
        canvasData = compoundInvest(extractResult, investOption);
        break;
      case 'single':
        canvasData = singleInvest(extractResult, investOption);
        break;
      default:
        throw new Error('Whta fokin Type of investment option Error!');
    }

    return canvasData;
  };
  // 투자 날짜에 맞춰서 fetch 데이터를 자르겠습니다.
}

const singleInvest = (data, option) => {
  // data - id, date, price - Object
  // option - date, stock, investOption, investValue,
  //          intervalInvest, intervalDate

  const investData = {
    /*
    id:, // 식별자
    date:, // 날짜
    price:, // 코인 가치
    myPrice, // 내 자산 가치
    earningsRate, // 수익률
    avgUnitPrice // 평균 단가
    totalInvest // 나의 총 투자 금액
    */
  };

  // 투자했을 당시 코인 금액 받기 -> 마지막 요소의 가격
  const beforeStockValue = data[Object.keys(data).length].price;

  Object.keys(data).forEach((key) => {
    // key -> String 타입이기 때문에 정수로 바꿔줌.
    const idx = Number(key);

    const { currentMyMoney, earningsRate } = howMuchMyMoney(
      option.investValue,
      beforeStockValue,
      data[idx].price,
    );
    investData[idx] = {
      id: idx,
      date: data[idx].date,
      stockPrice: data[idx].price,
      price: currentMyMoney,
      earningsRate,
      // 평균 단가는 변하지 않는다.
      avgUnitPrice: beforeStockValue,
      totalInvest: option.investValue
    };
  });
  console.log(investData);
  return investData;
};

const compoundInvest = (data, option) => {
  // TO DO - compound investment sequence logic
  const investData = {
    /*
    id:, // 식별자
    date:, // 날짜
    price:, // 코인 가치
    myPrice, // 내 자산 가치
    earningsRate, // 수익률
    avgUnitPrice // 평균 단가
    */
  };
  const result = compoundInterest(
    option.investValue,
    option.intervalDate,
    option.intervalInvest,
    data,
    option.date,
  ).reverse();
  // console.log(result);
  result.forEach((item, idx) => {
    const id = idx + 1;
    investData[id] = {
      id,
      date: item.date,
      price: item.nowInvest,
      earningsRate: item.y,
      avgUnitPrice: item.averagePrice,
      stockPrice: item.stockPrice,
      totalInvest: item.totalInvestment
    };
  });
  // console.log(investData);
  return investData;
};

export const extractDate = (date) => {
  const tmp = new Date();
  const today = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
  const investDate = new Date(date);
  return Math.ceil((today.getTime() - investDate.getTime()) / DAYMILLSECOND);
};




export default InvestManager;
