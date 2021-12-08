import React, { useRef, useEffect } from 'react';
import styles from './chart.module.css';
import canvasService from './canvasService';

const BUTTON_DISABLED_TIMER = 300;

const Chart = ({canvasData, indexOption, shiftLeft, shiftRight, showDetail}) => {
  const chartRef = useRef();
  // button reference
  const leftBtnRef = useRef();
  const rightBtnRef = useRef();

  const onLeftClick = (e) => {
    const isDisAbled = shiftLeft();
    if(isDisAbled) return;

    shiftLeft();
    e.target.disabled = true;
    // await for linear ctx .25s
    setTimeout( () => {
      e.target.disabled = false;
    }, BUTTON_DISABLED_TIMER);
  }

  const onRightClick = (e) => {
    const isDisAbled = shiftRight();
    if(isDisAbled) return;

    e.target.disabled = true;
    setTimeout( () => {
      e.target.disabled = false;
    }, BUTTON_DISABLED_TIMER);
  }


  // componentDidUpdate
  useEffect(() => {
    const myCanvas = new canvasService(chartRef.current, canvasData);
    
    const onChartClick = (e) => {
      const index = myCanvas.checkIndex(e.offsetX, e.offsetY);
      // 다른 부분을 클릭하면 잘못된 index 참조 -> 그냥 리턴
      if(index > 4) return;

      const detailData = myCanvas.currentElementData[index];
      showDetail(detailData);
    }
  /* 
    각 current DOM을 cosnt 변수로 저장하는 이유는
    해당 페이지를 빠져 나갈시 clear함수가 실행 되는데
    Ref.current로 잡히는 DOM이 clear함수가 발생하는 시점에서 잡기 때문에
    DOM이 잡히지 않아서 currnet 값이 nullish type이 된다.
    따라서 오류가 발생하기 때문에 const 메모리 안에 DOM을 잡아둔다. 
  */   
    const chart = chartRef.current;
    const leftBtn = leftBtnRef.current;
    const rightBtn = rightBtnRef.current;
    // temp option
    myCanvas.drawCanvas(indexOption);
    leftBtn.addEventListener("click", onLeftClick);
    rightBtn.addEventListener("click", onRightClick);
    chart.addEventListener("click", onChartClick);
    // clear function
     return () => {
       myCanvas.clearCanvas();
       leftBtn.removeEventListener("click", onLeftClick);
       rightBtn.removeEventListener("click", onRightClick);
       chart.removeEventListener("click", onChartClick);
      }
  }, [indexOption]);

  return (
    <div className={styles.main}>
      <button className={styles.button} ref={leftBtnRef}>left</button>
      <canvas
        className={styles.chart}
        width='940'
        height='550'
        ref={chartRef}
      ></canvas>
      <button className={styles.button} ref={rightBtnRef}>right</button>
    </div>
  );
};

export default Chart;