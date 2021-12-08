//객체생성 { 날짜, 총 투자금액, 현재 자산 가치, 현재평단가,코인갯수,수익률 }
export class MakeDataObj {
  constructor(
    date,
    totalInvestment,
    nowInvest,
    averagePrice,
    coinCount,
    y,
    stockPrice,
  ) {
    this.date = date;
    this.totalInvestment = totalInvestment;
    this.nowInvest = nowInvest;
    this.coinCount = coinCount;
    this.averagePrice = averagePrice;
    this.y = y;
    this.stockPrice = stockPrice;
  }
}
