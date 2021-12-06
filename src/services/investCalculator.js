import {} from "./investlogic.js";

// 하루 밀리세컨드
const DAYMILLSECOND = 1000 * 3600 * 24;

class InvestManager {

  createCanvasData = (upbitData, investOption) => {
    // 배열의 길이는 날짜 차이 (DATEdiff) + 1
    let canvasData = null;

    const dateIndex = extractDate(investOption.date) + 1;
    const extractResult = {};
    // fetchData에서 추출할 정보 -> 날짜, 코인가격
    for(let i = 0; i<dateIndex; i++){
      // substr -> yyyy-mm-dd 
      const date = upbitData[0].candle_data_time_utc.substr(0, 9);
      console.log(date);
      const price = upbitData[0].trade_price;
      extractResult[i + 1] = {
        id: i + 1,
        date, price
      };
    }


    // 투자한 옵션(단리, 복리)에 따라 작업 수행
    switch(investOption.investOpiton){
      case "compound":
        canvasData = compoundInvest(extractResult, investOption);
        break;
      case "single":
        canvasData = singleInvest(extractResult, investOption);
        break;
      default:
        throw new Error("Whta fokin Type of investment option Error!");
    }

    return canvasData;
  };

  // 투자 날짜에 맞춰서 fetch 데이터를 자르겠습니다.
}
const singleInvest = (data, option) => {
  // TO DO - single investment SEQ logic 
};

const compoundInvest = (data, option) => {
  // TO DO - compound investment sequence logic 
};

export const extractDate = (date) => {
  const tmp = new Date();
  const today = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
  const investDate = new Date(date);
  return Math.ceil((today.getTime() - investDate.getTime()) / DAYMILLSECOND);
};

export default InvestManager