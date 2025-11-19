import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-native";

import { hasPreviouslyLoggedIn } from "../utility/auth";

import {
  LoginScreen,
  WelcomeScreen,
  ConfirmEmailScreen,
  ProfileScreen,
  TankScreen,
} from "../screens";

import { LOGIN_PATH } from "../constants";
import BootSplash from "react-native-bootsplash";
export const AuthStack = ({ isOnBoarding }) => {
  const [hasLoggedInBefore, setHasLoggedInBefore] = useState(false);

  const checkHasPreviouslyLoggedIn = async () => {
    const hasLoggedInPreviously = await hasPreviouslyLoggedIn();
    setHasLoggedInBefore(hasLoggedInPreviously);
  };

  useEffect(() => {
    checkHasPreviouslyLoggedIn();
  }, []);

  const getStartingScreen = () => {
    switch (isOnBoarding) {
      case "emailVerification":
        return <ConfirmEmailScreen />;
      case "profile":
        return <ProfileScreen />;
      case "tank":
        return <TankScreen />;
      default:
        return hasLoggedInBefore ? <LoginScreen /> : <WelcomeScreen />;
    }
  };
  BootSplash.hide();

  return (
    <Routes>
      <Route path="/" element={getStartingScreen()} />
      <Route path={LOGIN_PATH} element={<LoginScreen />} />
    </Routes>
  );
};
