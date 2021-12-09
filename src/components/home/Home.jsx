import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css';
import { dateDiff } from '../../services/investlogic';

const checkIsNumber = (e) => {
  console.log(e.target.value);
  const key = e.key;
  let isNumber = false;
  // 누른 키가 BackSpace || ArrowLeft || ArrowRight 인지 체크한다.
  isNumber =
    key === 'Backspace' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    !isNaN(Number(key));
  if (e.code === 'Space') isNumber = false;
  if (!isNumber) e.preventDefault();
};

const Home = () => {
  const navigate = useNavigate();
  // console.log(extractDate('2021-12-01'));
  const dateRef = useRef();
  const stockRef = useRef();
  const investOptionRef = useRef();
  const investValueRef = useRef();
  const intervalInvestmentRef = useRef();
  const intervalDateRef = useRef();

  useEffect(() => {
    // 최소 조회 간격 설정
    dateRef.current.max = dateDiff(4);
  }, []);

  // 복리 옵션을 선택시 복리 선택창을 나타나게 한다.
  const checkIsCompound = (e) => {
    const investOption = e.target.value;
    const compoundDOM = intervalInvestmentRef.current;
    const dateIntervalDOM = intervalDateRef.current;
    console.log(compoundDOM);
    switch (investOption) {
      case 'single':
        compoundDOM.style.display = 'none';
        dateIntervalDOM.style.display = 'none';
        break;
      case 'compound':
        compoundDOM.style.display = '';
        dateIntervalDOM.style.display = '';
        break;
      default:
        throw new Error('Whta fokin Type of investment option Error!');
    }
  };

  // 모든 input 정보를 모아 결과창으로 넘긴다.
  const onSimulate = (e) => {
    e.preventDefault();
    let intervalInvest = false;
    let intervalDate = false;

    // Defalut Option
    const date = dateRef.current.value;
    const stock = stockRef.current.value;
    const investOption = investOptionRef.current.value;
    const investValue = Math.ceil(Number(investValueRef.current.value));
    if (date === '' || investValue <= 0 || stock <= 0) return;

    // Compound Option (복리 투자를 선택할 경우 추가 옵션)
    if (investOption === 'compound') {
      intervalInvest = Math.ceil(Number(intervalInvestmentRef.current.value));
      if (intervalInvest < 0) return;
      switch (intervalDateRef.current.value) {
        case 'day':
          intervalDate = 1;
          break;
        case 'week':
          intervalDate = 7;
          break;
        case 'month':
          intervalDate = 30;
          break;
        default:
          throw new Error('W T F type of Date error!');
      }
    }
    const upbitOption = {
      date, // 투자한 날짜
      stock, // 투자 코인 종류
      investOption, // 투자 옵션 (단리 or 복리)
      investValue, // - 초기 투자 금액
      intervalInvest, // int - 복리 투자 금액
      intervalDate, // int - 투자 간격
    };
    console.log(upbitOption);

    navigate('/result', {
      state: {
        upbitOption,
      },
    });
  };

  const onDateChange = (e) => {
    console.log(e);
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Hello World!</h1>
      <form className={styles.form}>
        <div className={styles.form__line}>
          <span>투자 날짜 - </span>
          <input required ref={dateRef} className={styles.input} type='date' onChange={onDateChange} />
        </div>
        <div className={styles.form__line}>
          <span>투자 금액 - </span>
          <input
            required
            ref={investValueRef}
            onKeyDown={checkIsNumber}
            type='text'
            placeholder='InvestValue'
            className={styles.input}
          />
        </div>
        <div className={styles.form__line}>
          <span>코인 종류 - </span>
          <select ref={stockRef} className={styles.input}>
            <option value='KRW-BTC'>BTC</option>
            <option value='KRW-ETH'>ETH</option>
            <option value='KRW-XRP'>XRP</option>
          </select>
        </div>
        <div className={styles.form__line}>
          <span>투자 옵션 - </span>
          <select onChange={checkIsCompound} className={styles.input} ref={investOptionRef}>
            <option value='compound'>compound(복리)</option>
            <option value='single'>simple(단리)</option>
          </select>
        </div>
        <div className={styles.form__line}>
          <span>복리 투자 간격 - </span>
          <select ref={intervalDateRef} className={styles.input}>
            <option value='day'>매일 마다</option>
            <option value='week'>매주 마다(7)</option>
            <option value='month'>매달 마다(30)</option>
          </select>
        </div>
        {/* 복리 선택시 나타나는 input */}
        <div className={styles.form__line}>
          <span>복리 투자 금액 - </span>
          <input
          className={styles.input}
            required
            type='text'
            onKeyDown={checkIsNumber}
            ref={intervalInvestmentRef}
            placeholder='HOW MUCH COMPOUND?'
          />
        </div>
        <button className={styles.button} onClick={onSimulate}>
          START!
        </button>
      </form>
    </div>
  );
};

export default Home;
