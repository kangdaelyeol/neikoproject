import React from 'react';
import './App.css';
import Home from './components/home/Home';
import Main from './components/main/Main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Main />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
