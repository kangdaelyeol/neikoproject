import React, { useRef, useEffect } from 'react';
import styles from './chart.module.css';
import canvasService from './canvasService';

const Chart = () => {
  const chartRef = useRef();
  useEffect(() => {
    const myCanvas = new canvasService(chartRef.current);
  }, []);
  return (
    <div className={styles.main}>
      <canvas
        className={styles.chart}
        width='1000'
        height='600'
        ref={chartRef}
      ></canvas>
    </div>
  );
};

export default Chart;