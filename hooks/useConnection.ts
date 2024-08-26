import React from 'react';
import NetInfo from '@react-native-community/netinfo';

const useConnection = () => {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
};

export default useConnection;
