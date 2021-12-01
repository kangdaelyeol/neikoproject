import React from "react";
import {useNavigate} from "react-router-dom";
import styles from "./home.module.css"

const Home = () => {
  const navigate = useNavigate();
  const onSearch = () => {
    const date = "days";
    const stock = "KRW-BTC"
    navigate("/result", {
      state:{
        upbitOption: {
          date, stock
        }
      }
    });
  }
  console.log(navigate);
  return(
    <div>
      <h1>Hello World!</h1>
      <button onClick={onSearch}>go to search</button>
    </div>
  );
}


export default Home;