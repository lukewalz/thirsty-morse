import React, { Suspense, lazy } from 'react';
import './App.css';
import Lottie from 'react-lottie'
import animationData from './lotties/34702-spray-medicine'
import { Spinner } from 'reactstrap';

function App() {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const Games = lazy(() => import('./Games'));

  return (
    <div className="App">
      <header className="App-header">
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
        />
        <Suspense fallback={<Spinner color="primary" />}>
          <Games />
        </Suspense>
      </header>
    </div>
  );
}

export default App;
