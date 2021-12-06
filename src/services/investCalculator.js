import {} from "./investlogic.js";

class InvestManager {
  constructor(){ 
    this.upbit = null;
    this.investOption = null;
  }

  createCanvasData = (upbitData, investOption) => {
    const canvasData = {};
    this.investOption = investOption;
    this.cutArray(upbitData, investOption.date);
  }

  singleInvest = () => {
    // TO DO - single investment SEQ logic 
  }

  compoundInvest = () => {
    // TO DO - compound investment sequence logic 
  }
  

  // 투자 날짜에 맞춰서 fetch 데이터를 자르겠습니다.
  cutArray = (upbitData, date) => {
    // 몇일 전인지 확인하기
  }
}

const createToday = () => {
  // 밀리세컨드 단위를 통한 투자 날짜 계산하기
  const newDate = new Date();
}

export default InvestManager