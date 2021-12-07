import drawServices from './drawService';

const ELEMENT_RADIUS = 10;

const CHART = Object.freeze({
  fillX: 120,
  fillY: 100,
  fillWidth: 800,
  fillHeight: 450,
  x: 130,
  y: 110,
  width: 780,
  height: 430,
});
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;

class canvasService {
  constructor(canvas, fetchData, DOM) {
    this.ctx = canvas.getContext('2d');
    this.drawServices = new drawServices(this.ctx);
    // console.log(fetchData);
    this.elements = [];
    this.fetchData = fetchData;
    this.canvas = canvas;
    this.elementRadius = 10;
    this.Dev_LineConstruction();
    this.addClickListener((e) => {
      this.checkIndex(e.offsetX, e.offsetY);
    });
  }

  addMousemoveListener = (func) => {
    func && this.canvas.addEventListener('mousemove', func);
    this.canvas.addEventListener('ccccc', () => {
      this.canvas.removeListener('mousemove', func);
    });
  };

  addClickListener = (func) => {
    func && this.canvas.addEventListener('click', func);
    this.canvas.addEventListener('ccccc', () => {
      this.canvas.removeEventListener('click', func);
    });
  };

  clearCanvas = () => {
    const event = new Event('ccccc');
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.canvas.dispatchEvent(event);
  };

  // main canvas init aciton
  // data - upbitData(5), option: single / compound interest
  drawCanvas = (indexOption, option) => {
    const { index, interval } = indexOption;

    // 데이터 인덱스 추출
    const drawData = [];
    let ticks = null;
    for (let i = index; i < index + 5; i++) {
      drawData.push(this.fetchData[i * interval]);
    }
    // console.log(drawData);
    drawData.reverse();

    this.drawTickLines();

    switch (option) {
      case 'single':
        ticks = extractTickValue(drawData);
        this.drawTickValues(ticks, this.ctx);
        this.drawElements(ticks, drawData, this.elements);
        break;
      default:
        throw new Error('drawCanvas option type error');
    }

    this.drawDate(drawData);
    this.drawElementLine();
  };

  canvasClick = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const radius = 30;
    this.checkIndex(x, y);
  };

  canvasMove = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
  };

  checkIndex = (x, y) => {
    this.elements.forEach((e) => {
      if (this.ctx.isPointInPath(e.element, x, y)) {
        this.ctx.save();
        setTimeout(() => {
          this.ctx.save();
          this.ctx.fill(e.element);
          this.ctx.restore();
        }, 200);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill(e.element);
      } else {
        this.ctx.fillStyle = '#9D9E9F';
        this.ctx.fill(e.element);
      }
    });
    this.ctx.restore();
  };

  drawDate = (drawData) => {
    const revisedFillWidth = CHART.fillWidth - this.elementRadius * 2;
    const revisedFillX = CHART.fillX + this.elementRadius;
    const drawIntervalX = revisedFillWidth / 4;

    drawData.forEach((e, idx) => {
      // option - x, y, textAlign, fontSize, fontFamily, text : Object
      this.drawServices.drawText({
        x: revisedFillX + drawIntervalX * idx,
        y: CHART.fillY + CHART.fillHeight,
        textAlign: 'center',
        fontSize: '12px',
        text: e.date,
        fontFamily: 'serif',
        baseLine: 'hanging',
      });
    });
  };

  drawElements = (ticks, fetchData) => {
    // revise FillX Range for element_Radius
    const revisedFillWidth = CHART.fillWidth - this.elementRadius * 2;
    const revisedFillX = CHART.fillX + this.elementRadius;
    // console.log(revisedFillWidth, revisedFillX);

    const elementPositions = [];
    const tickInterval = Number(ticks[4]) - Number(ticks[0]);
    const minTick = Number(ticks[0]);
    const chartIntervalX = revisedFillWidth / 4;
    Object.keys(fetchData).forEach((i, idx) => {
      const absolutePrice = fetchData[i].price;
      const relativePrice = absolutePrice - minTick;
      const elementPositionX = revisedFillX + chartIntervalX * idx;
      const elementPositionY =
        CHART.fillY +
        CHART.fillHeight -
        Math.floor((relativePrice / tickInterval) * CHART.fillHeight);
      const elementPosition = {
        x: elementPositionX,
        y: elementPositionY,
        price: absolutePrice,
      };
      elementPositions.push(elementPosition);
    });
    // console.log(elementPositions);
    elementPositions.forEach((p) => {
      this.drawServices.drawCircle(
        {
          x: p.x,
          y: p.y,
          radius: this.elementRadius,
          color: '9D9E9F',
        },
        this.elements,
      );

      // option - x, y, textAlign, fontSize, fontFamily, text : Object
      this.drawServices.drawText({
        x: p.x,
        y: p.y + ELEMENT_RADIUS * 2,
        textAlign: 'center',
        fontSize: '12px',
        fontFamily: 'serif',
        text: p.price,
      });
    });
  };
  drawTickValues = (ticks) => {
    const tickInterval = CHART.fillHeight / 4;
    const textIntervalX = 2;
    const textIntervalY = 3;
    for (let i = 0; i < 5; i++) {
      this.drawServices.drawText({
        x: CHART.fillX - textIntervalX,
        y: CHART.fillY + CHART.fillHeight - tickInterval * i + textIntervalY,
        fontFamily: 'serif',
        fontSize: '10px',
        textAlign: 'right',
        text: ticks[i],
        baseLine: 'hanging',
      });
    }
  };

  drawTickLines = () => {
    const tickInterval = CHART.fillHeight / 4;
    for (let i = 0; i < 5; i++) {
      let dash = null;
      if (i === 0 || i === 4) dash = false;
      else dash = true;
      this.drawServices.drawLine({
        moveX: CHART.fillX,
        moveY: CHART.fillY + tickInterval * i,
        lineX: CHART.fillX + CHART.fillWidth,
        lineY: CHART.fillY + tickInterval * i,
        lineWidth: 1,
        strokeStyle: 'black',
        dash,
      });
    }
  };

  // Dev function
  Dev_LineConstruction = () => {
    // option - moveX/Y, lineX/Y, strokeStyle, lineWidth, dash
    this.drawServices.drawLine({
      // FillY
      moveX: CHART.fillX,
      moveY: 0,
      lineX: CHART.fillX,
      lineY: CHART.fillY,
      lineWidth: 5,
    });

    this.drawServices.drawLine({
      // FillX
      moveX: 0,
      moveY: CHART.fillY,
      lineX: CHART.fillX,
      lineY: CHART.fillY,
      lineWidth: 5,
    });

    this.drawServices.drawLine({
      // FillX -> FIllwidth
      moveX: CHART.fillX,
      moveY: CHART.fillY,
      lineX: CHART.fillX + CHART.fillWidth,
      lineY: CHART.fillY,
      lineWidth: 5,
      strokeStyle: 'red',
    });

    this.drawServices.drawLine({
      // FillY -> FIllheight
      moveX: CHART.fillX,
      moveY: CHART.fillY,
      lineX: CHART.fillX,
      lineY: CHART.fillY + CHART.fillHeight,
      lineWidth: 5,
      strokeStyle: 'red',
    });
  };

  drawElementLine = () => {
    const lineUpRate = [];
    for (let i = 0; i < 4; i++) {
      const upRate = {};
      // upRates는 50으로 나눈다.
      upRate.x = Math.abs(this.elements[i].x - this.elements[i + 1].x) / 50;
      upRate.y = -(this.elements[i].y - this.elements[i + 1].y) / 50;
      lineUpRate[i] = upRate;
    }
    for(let j = 0; j<4; j++){
      // console.log(`draw`, this.elements[j]);
      for (let i = 0; i < 50; i++) {
        const colorR = (((i * 1) + (j * 50)) % 256).toString(16);
        const colorG = (100).toString(16);
        const colorB = (220).toString(16);
        setTimeout(() => {
          this.drawServices.drawLine({
            moveX: this.elements[j].x + lineUpRate[j].x * i,
            moveY: this.elements[j].y + lineUpRate[j].y * i,
            lineX: this.elements[j].x + lineUpRate[j].x * (i + 1),
            lineY: this.elements[j].y + lineUpRate[j].y * (i + 1),
            strokeStyle: `#${colorR}${colorG}${colorB}`,
            lineWidth: 1.5,
          });
        }, (i * 1) + (j * 50));
      }
    }
  };
}
// end define Class

// 값을 받아 해당 최대 자리 반자리수 까지 올림 내림 하는 기능
const ceilNumber = (input) => {
  // 여백을 위해 1% 값 보정
  const num = input + Math.round(input / 100);
  const numLength = String(num).length;
  const divCount = Math.floor(numLength / 2);
  const mulCount = Math.ceil(numLength / 2);
  const divisionNumber = Math.pow(10, divCount);
  const mulNumber = Math.pow(10, mulCount);
  const maxNumberPosition = Math.ceil(num / divisionNumber);
  const result = maxNumberPosition * mulNumber;
  return result;
};

const floorNumber = (input) => {
  const num = input - Math.round(input / 100);
  const numLength = String(num).length;
  const divCount = Math.floor(numLength / 2);
  const mulCount = Math.ceil(numLength / 2);
  const divisionNumber = Math.pow(10, divCount);
  const mulNumber = Math.pow(10, mulCount);
  const minNumberPosition = Math.floor(num / divisionNumber);
  const result = minNumberPosition * mulNumber;
  return result;
};

// function name: extractTickValue
// function explain: 데이터의 price정보 5개를 받아 라인의 VALUE를
//                    적절하게 계산하여 리턴
// input: drawData: Object(5)
// output: tickValues: Array[5]
// writer: 강대렬
// writing Date: 2021/11/21
const extractTickValue = (drawData) => {
  // console.log(drawData);
  const prices = [];
  const TICK_COUNT = 4;
  const newTicks = [];
  Object.keys(drawData).forEach((key) => {
    prices.push(drawData[key].price);
  });
  let minprice = prices[0];
  let maxprice = prices[0];

  // 최소 최댓값 구하기
  prices.forEach((price) => {
    if (price > maxprice) maxprice = price;
    if (price < minprice) minprice = price;
  });

  // 최소 최대 tick값 구하기
  const maxTick = ceilNumber(maxprice);
  const minTick = floorNumber(minprice);
  const priceInterval = (maxTick - minTick) / TICK_COUNT;
  for (let i = 0; i < 5; i++) {
    newTicks.push(String(minTick + priceInterval * i));
  }
  return newTicks;
};

const checkIndexElement = (x, y, elements) => {
  return;
};

export default canvasService;
