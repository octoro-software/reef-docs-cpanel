import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-native";

import { ConfirmEmailScreen, ProfileScreen, TankScreen } from "../screens";

import {
  AUDIENCE_PATH,
  CONFIRM_EMAIL_PATH,
  // NOTIFICATIONS_PATH,
  PROFILE_PATH,
  // TANK_PATH,
} from "../constants";
// import { NotificationScreen } from "../screens/Auth/NotificationScreen";
import BootSplash from "react-native-bootsplash";
import { AudienceScreen } from "../screens/Auth/AudienceScreen";

export const OnBoardingStack = ({ isOnBoarding }) => {
  BootSplash.hide();

  const navigate = useNavigate();

  // const handleInitalOnBoarding = async () => {
  //   if (isOnBoarding === "confirmEmail") {
  //     navigate(CONFIRM_EMAIL_PATH, { replace: true });
  //   } else if (isOnBoarding === "profile") {
  //     navigate(PROFILE_PATH, { replace: true });
  //   } else if (isOnBoarding === "tank") {
  //     navigate(AUDIENCE_PATH, { replace: true });
  //   }
  // };
  const handleInitalOnBoarding = async () => {
    navigate(PROFILE_PATH, { replace: true });
  };

  useEffect(() => {
    handleInitalOnBoarding();
  }, [isOnBoarding]);

  return (
    <Routes>
      <Route path={"/"} element={<ProfileScreen />} />
      {/* <Route path={CONFIRM_EMAIL_PATH} element={<ConfirmEmailScreen />} /> */}
      <Route path={PROFILE_PATH} element={<ProfileScreen />} />
      {/* <Route path={TANK_PATH} element={<TankScreen />} /> */}
      {/* <Route path={NOTIFICATIONS_PATH} element={<NotificationScreen />} /> */}
    </Routes>
  );
};
