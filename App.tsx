import React, {useEffect, useState} from 'react';
import Splash from './screens/Splash';
import OnBoarding from './screens/OnBoarding';
import Navigator from './components/Navigator';

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
  return <Navigator />;
};

export default App;
