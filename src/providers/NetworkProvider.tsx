// NetworkProvider.tsx
import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

import { NoNetwork } from "../elements/NoNetwork/NoNetwork";
import BootSplash from "react-native-bootsplash";
export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    BootSplash.hide();

    return <NoNetwork />;
  }

  return children;
};
