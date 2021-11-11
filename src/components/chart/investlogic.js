// simple / compound interest calculate logic 


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
export const compoundInterest = (startInvestment, intervalInvestment, investDate) => {
    const result = {};
    return result;
}


// function    name: howMuchMyMoney
// function explain: 투자 금액과 투자 했을 당시 stockValue와 현재 stockValue를 받아
//                   현재 자신의 투자 금액과 수익률을 반환한다.
//            input: investment: Int, beforeStockValue: Int, currentStockValue: Int
//           output: currentInvestmentValue: Int, earningRate: Double 
//     writing date: 2021/11/10
//           writer: 강대렬
const howMuchMyMoney = (investment, beforeStockValue, currentStockValue) => {
  const currentInvestmentValue = Math.round(investment * currentStockValue / beforeStockValue * 100);
  const earningRate = toFixed((currentInvestmentValue - investment) / investment * 100, 2);
  return { currentInvestmentValue, earningRate };
}