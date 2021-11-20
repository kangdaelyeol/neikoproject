import React, { useRef, useEffect } from 'react';
import styles from './chart.module.css';
import canvasService from './canvasService';



const Chart = ({canvasData, index, shiftLeft, shiftRight}) => {
  const chartRef = useRef();
 
  // componentDidUpdate
  useEffect(() => {
    console.log(canvasData);
    console.log(chartRef.current);
    const myCanvas = new canvasService(chartRef.current, canvasData);
    // temp option
    const option = 'single'
    myCanvas.drawCanvas(index, option);
     return () => {
       myCanvas.clearCanvas();
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
      <button onClick={shiftLeft}>left</button>
      <button onClick={shiftRight}>right</button>
    </div>
  );
};

export default Chart;