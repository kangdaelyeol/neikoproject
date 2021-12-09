import axios from "axios";


const searchMindateAxios = (stock) => {
  const url = `https://api.upbit.com/v1/candles/months?market=${stock}&count=200`;
  
  const options = {
    url,
    method: 'GET',
    headers: { Accept: 'application/json' },
  }
  return axios(options);
}



export default searchMindateAxios;