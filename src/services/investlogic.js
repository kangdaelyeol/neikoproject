// simple / compound interest calculate logic 

import { MakeDataObj } from "../components/chart/MakeDataObj";


// function    name: simpleInterest
// function explain: 투자 금액과 그 당시 stockValue, 현재 stockValue를 인자로 받아 
//                   수익을 내었는지 판단하고 현재 투자 가치와 수익률을 소수점 2자리까지 반환한다.
//            input: investment: Int, currentPrice: Int
//           output: {currentInvestmentValue: Int, earningRate: String, isEarning: Boolean}
//     writing date: 2021/11/10
//           writer: 강대렬
export const simpleInterest = (investment, beforeStockValue, currentStockValue) => {
  const { currentInvestmentValue, earningRate } = howMuchMyMoney(investment, beforeStockValue, currentStockValue);
  const isEarning = earningRate > 0 ;
  return { currentInvestmentValue, earningRate, isEarning };
}


// function    name: compoundInterest
// function explain: 초기 투자 금액과, 투자 간격과 투자 할 때마다 정기적인 투자금 값을 받아
//                   모든 투자 간격마다 수익을 내었는지 판단하고 투자 금액과 수익률을 소수점 2자리까지 반환한다.
//            input: startInvestment: int, intervalInvestment: Int, investDate:Array[...String] 
//           output: { id: Int: { id: Int, date: String, currnetValue: Int, earningRate: String, isEarning}}
//     writing date: 2021/11/10
//           writer: 강대렬



// function    name: howMuchMyMoney
// function explain: 투자 금액과 투자 했을 당시 stockValue와 현재 stockValue를 받아
//                   현재 자신의 투자 금액과 수익률을 반환한다.
//            input: investment: Int, beforeStockValue: Int, currentStockValue: Int
//           output: currentInvestmentValue: Int, earningRate: Double 
//     writing date: 2021/11/10
//           writer: 강대렬
const howMuchMyMoney = (investment, beforeStockValue, currentStockValue) => {
  const currentInvestmentValue = Math.round(investment * currentStockValue / beforeStockValue * 100);
  const earningRate = ((currentInvestmentValue - investment) / investment * 100).toFixed(2);
  return { currentInvestmentValue, earningRate };
}


// function    name: compoundInterest
// function explain: 초기 투자 금액과, 투자 간격과 투자 할 때마다 정기적인 투자금 값을 받아
//                   모든 투자 간격마다 수익을 내었는지 판단하고 투자 금액과 수익률을 소수점 2자리까지 반환한다.
//            input: 초기투자금액, 투자간격, 정기적 투자금액, 코인모든날가격데이터, 투자시기
//            inputType: startInvestment: int, intervalInvestment: Int, investDate:Array[...String], coinObejctArr:Array[...Object], startInvest: String
//           output: 
//     writing date: 2021/11/30
//           writer: 김현수
export const compoundInterest = (startInvestment, intervalInvestment, investDate, coinObject, startInvest) => {

  let nowDate = new Date();
  let nowYear = nowDate.getFullYear();
  let nowMonth = nowDate.getMonth() + 1;
  let nowDay = nowDate.getDate();

  let startDate = '20' + startInvest;
  let startDate_arr = startDate.split("-");

  let stDate = new Date(startDate_arr[0], startDate_arr[1], startDate_arr[2]);
  let endDate = new Date(nowYear, nowMonth, nowDay);

  let btDay = (endDate.getTime() - stDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
  //총 코인갯수
  let coinCount = 0;
  //코인구매가격*코인갯수
  let priceXcount = 0;
  // 하루코인구매갯수 인데 처음 투자할때 값 먼저 넣어줬음
  let daySellCoins = startInvestment / coinObject[btDay].price;

  coinCount += daySellCoins;
  console.log("coincount", coinCount)
  priceXcount += daySellCoins * coinObject[btDay].price;
  let totalInvestment = startInvestment;
  let priceAverage = priceXcount / coinCount;
  // console.log("priceAverage", priceAverage, coinObject[1].price);
  let nowProfit = priceAverage * coinCount + (coinObject[1].price - priceAverage) * coinCount;
  let y = ((coinObject[1].price / priceAverage * 100) - 100).toFixed(2) + "% "
  let resultData = [];
  let dataObj = {};
  //평단가: (코인1구매가격*코인1갯수)+(코인2구매가격*코인2갯수)/총 코인갯수
  //{ 날짜, 총 투자금액, 현재 자산 가치, 현재평단가,코인갯수,수익률 }
  dataObj = new MakeDataObj(coinObject[btDay].date, totalInvestment, nowProfit, priceAverage, coinCount,
      y);
  resultData.push(dataObj);
  for (let i = btDay - intervalInvestment; i > 0; i -= intervalInvestment) {
      daySellCoins = investDate / coinObject[i].price;
      priceXcount += daySellCoins * coinObject[i].price;
      coinCount += daySellCoins;
      totalInvestment += investDate;
      priceAverage = priceXcount / coinCount;
      nowProfit = priceAverage * coinCount + (coinObject[1].price - priceAverage) * coinCount;
      y = ((coinObject[1].price / priceAverage * 100) - 100).toFixed(2) + "% "
      dataObj = new MakeDataObj(coinObject[i].date, totalInvestment, nowProfit, priceAverage, coinCount,
          y);
      resultData.push(dataObj);
  }


  console.log("평단, 수익", priceAverage, nowProfit);
  //수익,평단,현재평가금액,투자금액,코인갯수,총투자금액,수익률
  const result = resultData;
  console.log(result);
  return result;
}