import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-native";
import { BackHandler } from "react-native";

import { HomeScreen } from "../screens";

import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import {
  selectSocialFullScreen,
  setWheelMenuOpen,
} from "../store/slices/globalSlice";
import { ElementScreen } from "../screens/ElementScreen";
import { SettingsScreen } from "../screens/Settings";

export const MainStack = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const location = useLocation();

  const socialFullScreenActive = useAppSelector(selectSocialFullScreen)?.active;

  useEffect(() => {
    const handleBackPress = () => {
      dispatch(setWheelMenuOpen(false));

      if (location.pathname !== "/" && !socialFullScreenActive) {
        navigate(-1); // Go back if not on the home screen

        return true; // Prevent default behavior (exiting the app)
      }

      if (!socialFullScreenActive) {
      }
    };

    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      sub.remove();
    };
  }, [location, socialFullScreenActive]);

  return (
    <Routes>
      <Route index path={"/"} element={<HomeScreen />} />
      <Route path={"/element"} element={<ElementScreen />} />
      <Route path={"/settings"} element={<SettingsScreen />} />
    </Routes>
  );
};
