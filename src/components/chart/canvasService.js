let id = 0;
let ctx = null;
let num = 0;
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

const fetchData = {
  1 : {
    id : 1,
    date: "11/01",
    price: 12345000
  },
  2 : {
    id : 2,
    date: "11/03",
    price: 8765000
  },
  3 : {
    id : 3,
    date: "11/05",
    price: 32429000
  },
  4 : {
    id : 4,
    date: "11/07",
    price: 2564000
  },
  5 : {
    id : 5,
    date: "11/09",
    price: 6405000
  },
}

const drawElement = (ticks) => {
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

const extractTickValue = () => {
  const prices = [];
  const TICK_COUNT = 4;
  const newTicks = [];
  Object.keys(fetchData).forEach( key => {
    prices.push(fetchData[key].price);
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
  constructor(canvas) {
    const ticks = extractTickValue();
    ctx = canvas.getContext('2d');
    canvas.addEventListener('click', this.canvasClick);
    canvas.addEventListener('mousemove', this.canvasMove);
    drawTickValues(ticks);
    drawElement(ticks);
    drawTickLines();
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
      if (ctx.isPointInPath(e.element, x, y)) {
        ctx.save();
        setTimeout(() => {
          ctx.save();
          ctx.fill(e.element);
          ctx.restore()
        }, 200);

        ctx.fillStyle="blue";
        ctx.fill(e.element);
        console.log(e.x, e.y);
      } else{
        ctx.fillStyle="#9D9E9F";
        ctx.fill(e.element);
      }
    });
    ctx.restore();
  };
}

const drawRect = (option) => {
  ctx.save();
  const rect = new Path2D();
  rect.rect(option.x, option.y, option.width, option.height);
  ctx.fillStyle = "wheat";
  ctx.fill(rect);
  ctx.restore();
}


// option - x, y, textAlign, fontSize, fontFamily, text : Object
const drawText = (option) => {
  ctx.save();
  ctx.font = `${option.fontSize} ${option.fontFamily}`;
  ctx.strokeStyle = "black";
  ctx.textAlign = option.textAlign;
  ctx.strokeText(option.text, option.x, option.y);
  ctx.restore();
}

// option - moveX/Y, lineX/Y, strokeStyle, lineWidth, dash
const drawLine = (option) => {
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = option.lineWidth;
  ctx.moveTo(option.moveX, option.moveY);
  ctx.lineTo(option.lineX, option.lineY);
  ctx.strokeStyle = option.strokeStyle;
  if(option.dash) ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.restore();
};

// option - x ,y radius, color
const drawCircle = (option) => {
  ctx.save();
  ctx.beginPath();
  const circle = new Path2D();
  circle.arc(option.x, option.y, option.radius, 0, Math.PI * 2);
  ctx.fillStyle = option.color;
  ctx.fill(circle);
  
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

  ctx.restore();
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