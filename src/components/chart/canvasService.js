let id = 0;
const ELEMENT_RADIUS = 10;

const elements = [];
const CHART = Object.freeze({
  fillX: 120,
  fillY: 100,
  fillWidth: 800,
  fillHeight: 450,
  x: 130,
  y: 110,
  width: 780,
  height: 430,
})
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const CANVAS_PADDING = 10;


const drawElements = (ticks, fetchData) => {
  const elementPositions = [];
  const tickInterval = Number(ticks[4]) - Number(ticks[0]);
  const minTick = Number(ticks[0]);
  const chartIntervalX = CHART.width / 4;
  Object.keys(fetchData).forEach(i => {
    const absolutePrice = fetchData[i].price;
    const relativePrice = absolutePrice - minTick;
    const elementPositionX = CHART.x + chartIntervalX * (i-1);
    const elementPositionY = Math.floor(relativePrice / tickInterval * CHART.height);
    const elementPosition = {
      x: elementPositionX,
      y: elementPositionY + CHART.y
    };
    elementPositions.push(elementPosition);
  });
  console.log(elementPositions);
  elementPositions.forEach(p => {
    drawCircle({
      x: p.x,
      y: p.y,
      radius: ELEMENT_RADIUS,
      color: "9D9E9F"
    });
  })
}

const extractTickValue = (drawData) => {
  const prices = [];
  const TICK_COUNT = 4;
  const newTicks = [];
  Object.keys(drawData).forEach( key => {
    prices.push(drawData[key].price);
  })
  let minprice = prices[0];
  let maxprice = prices[0];
  
  // 최소 최댓값 구하기
  prices.forEach(price => {
    if(price > maxprice) maxprice = price;
    if(price < minprice) minprice = price;
  });
  console.log(minprice, maxprice);
  
  // 최소 최대 tick값 구하기
  const maxTick = ceilNumber(maxprice);
  const minTick = floorNumber(minprice);
  const priceInterval = (maxTick - minTick) / TICK_COUNT;
  for(let i=0; i<5; i++){
    newTicks.push(String(minTick + priceInterval * i));
  }
  return newTicks;
}



const drawTickValues = (ticks) => {
  const tickInterval = CHART.fillHeight / 4;
  const textIntervalX = 2;
  const textIntervalY = 3;
  for(let i=0; i<5; i++){
    drawText({
      x: CHART.fillX - textIntervalX,
      y: CHART.fillY + CHART.fillHeight - tickInterval * i + textIntervalY,
      fontFamily: "serif",
      fontSize: "10px",
      textAlign:"right",
      text: ticks[i]
    })
  }
}

const drawTickLines = () => {
  const tickInterval = CHART.fillHeight / 4;
  for(let i=0; i<5; i++){
    let dash = null;
    if(i === 0 || i === 4) 
      dash = false;
    else
       dash = true;
    drawLine({
      moveX: CHART.fillX,
      moveY: CHART.fillY + tickInterval * i,
      lineX: CHART.fillX + CHART.fillWidth,
      lineY: CHART.fillY + tickInterval * i,
      lineWidth: 1,
      strokeStyle: "black",
      dash
    })
  }
}


class canvasService {
  constructor(canvas, fetchData) {
    console.log(fetchData);
    this.fetchData = fetchData;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  } 
  
  // main canvas init aciton
  // data - upbitData(5), option: single / compound interest
  drawCanvas = (index, option) => {
    // 데이터 인덱스 추출
    console.log(this.fetchData)
    const drawData = [];
    let ticks = null;
    for(let i=index; i<index + 5; i++){
      drawData.push(this.fetchData[i]);
    }

    drawTickLines();
    switch(option){
      case "single":
        ticks = extractTickValue(drawData);
        drawTickValues(ticks);
        drawElements(ticks, drawData);
      default:
        throw new Error("drawCanvas option type error")
    }
  }

  addMousemoveListener = (func) => {
    func && this.canvas.addEventListener("mousemove", func)
  }

  addClickListener = (func) =>{
    func && this.canvas.addEventListener("click", func);
  }


  
  
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
    elements.forEach((e) => {
      if (this.ctx.isPointInPath(e.element, x, y)) {
        this.ctx.save();
        setTimeout(() => {
          this.ctx.save();
          this.ctx.fill(e.element);
          this.ctx.restore()
        }, 200);

        this.ctx.fillStyle="blue";
        this.ctx.fill(e.element);
        console.log(e.x, e.y);
      } else{
        this.ctx.fillStyle="#9D9E9F";
        this.ctx.fill(e.element);
      }
    });
    this.ctx.restore();
  };
}

const drawRect = (option) => {
  this.ctx.save();
  const rect = new Path2D();
  rect.rect(option.x, option.y, option.width, option.height);
  this.ctx.fillStyle = "wheat";
  this.ctx.fill(rect);
  this.ctx.restore();
}


// option - x, y, textAlign, fontSize, fontFamily, text : Object
const drawText = (option) => {
  this.ctx.save();
  this.ctx.font = `${option.fontSize} ${option.fontFamily}`;
  this.ctx.strokeStyle = "black";
  this.ctx.textAlign = option.textAlign;
  this.ctx.strokeText(option.text, option.x, option.y);
  this.ctx.restore();
}

// option - moveX/Y, lineX/Y, strokeStyle, lineWidth, dash
const drawLine = (option) => {
  this.ctx.save();
  this.ctx.beginPath();
  this.ctx.lineWidth = option.lineWidth;
  this.ctx.moveTo(option.moveX, option.moveY);
  this.ctx.lineTo(option.lineX, option.lineY);
  this.ctx.strokeStyle = option.strokeStyle;
  if(option.dash) this.ctx.setLineDash([5, 5]);
  this.ctx.stroke();
  this.ctx.restore();
};

// option - x ,y radius, color
const drawCircle = (option) => {
  this.ctx.save();
  this.ctx.beginPath();
  const circle = new Path2D();
  circle.arc(option.x, option.y, option.radius, 0, Math.PI * 2);
  this.ctx.fillStyle = option.color;
  this.ctx.fill(circle);
  
  // 이벤트 추가를 위한 식별자 생성
  const element = {
    kind: "circle",
    x: option.x,
    y: option.y,
    radius: option.radius,
    element: circle,
    id,
  };
  id++;
  elements.push(element);

  this.ctx.restore();
};

// 값을 받아 해당 최대 자리수 까지 올림 내림 하는 기능
const ceilNumber = (num) => {
  const numlength = String(num).length - 1;
  const divisionNumber = Math.pow(10, numlength);
  const maxNumberPosition = Math.ceil(num / divisionNumber);
  const result = maxNumberPosition * divisionNumber;
  return result;
}

const floorNumber = (num) => {
  const numlength = String(num).length - 1;
  const divisionNumber = Math.pow(10, numlength);
  const maxNumberPosition = Math.floor(num / divisionNumber);
  const result = maxNumberPosition * divisionNumber;
  return result;
}

export default canvasService;