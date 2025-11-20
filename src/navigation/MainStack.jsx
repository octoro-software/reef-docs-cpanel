import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-native";
import { BackHandler } from "react-native";

import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import {
  selectSocialFullScreen,
  setWheelMenuOpen,
} from "../store/slices/globalSlice";
import { DashboardScreen } from "../screens/DashboardScreen/DashboardScreen";
import { ElementGraphScreen } from "../screens/ElementGraphScreen/ElementGraphScreen";
import { PanelSettingsScreen } from "../screens/PanelSettingsScreen/PanelSettingsScreen";

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
      <Route index path={"/"} element={<DashboardScreen />} />
      <Route path={"/element"} element={<ElementGraphScreen />} />
      <Route path={"/settings"} element={<PanelSettingsScreen />} />
    </Routes>
  );
};
