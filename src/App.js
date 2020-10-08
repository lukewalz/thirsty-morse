import React from 'react';
import logo from './logo.svg';
import './App.css';
import Games from './Games'
import Lottie from 'react-lottie'
import animationData from './lotties/34702-spray-medicine'

function App() {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
        />        <Games />
      </header>
    </div>
  );
}

export default App;
