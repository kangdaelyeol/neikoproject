import React, { useRef, useEffect } from 'react';
import styles from './chart.module.css';
import canvasService from './canvasService';



const Chart = ({canvasData, index, shiftLeft, shiftRight}) => {
  const chartRef = useRef();
  // button reference
  const leftBtnRef = useRef();
  const rightBtnRef = useRef();
 

  const onLeftClick = (e) => {
    // e.preventDefault();
    console.log("on Left click");
    shiftLeft();
    e.target.disabled = true;
    // await for linear ctx .25s
    setTimeout( () => {
      e.target.disabled = false;
    }, 250);
  }

  const onRightClick = (e) => {
    // e.preventDefault();
    const isDisAbled = shiftRight();
    if(isDisAbled) return;

    e.target.disabled = true;
    setTimeout( () => {
      e.target.disabled = false;
    }, 250);
  }

  // componentDidUpdate
  useEffect(() => {
    console.log("useEffect -> effect", index);
    const myCanvas = new canvasService(chartRef.current, canvasData);
    
  /* 
    각 current DOM을 cosnt 변수로 저장하는 이유는
    해당 페이지를 빠져 나갈시 clear함수가 실행 되는데
    Ref.current로 잡히는 DOM이 clear함수가 발생하는 시점에서 잡기 때문에
    DOM이 잡히지 않아서 currnet 값이 nullish type이 된다.
    따라서 오류가 발생하기 때문에 const 메모리 안에 DOM을 잡아둔다. 
  */  
  
    const leftBtn = leftBtnRef.current;
    const rightBtn = rightBtnRef.current;
    // temp option
    const option = 'single'
    myCanvas.drawCanvas(index, option);
    leftBtn.addEventListener("click", onLeftClick);
    rightBtn.addEventListener("click", onRightClick);

    // clear function
     return () => {
      console.log("useEffect -> clear", index);
       myCanvas.clearCanvas();
       leftBtn.removeEventListener("click", onLeftClick);
       rightBtn.removeEventListener("click", onRightClick);
     }
  }, [index]);

  return (
    <div className={styles.main}>
      <canvas
        className={styles.chart}
        width='1000'
        height='600'
        ref={chartRef}
      ></canvas>
      <button ref={leftBtnRef}>left</button>
      <button ref={rightBtnRef}>right</button>
    </div>
  );
};

export default Chart;