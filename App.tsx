import React, {useEffect, useState} from 'react';
import Splash from './screens/Splash';
import OnBoarding from './screens/OnBoarding';

const App = () => {
  const [isSplash, setIsSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsSplash(false);
    }, 3000);
  }, []);

  if (isSplash) {
    return <Splash />;
  }
  return <OnBoarding />;
};

export default App;
