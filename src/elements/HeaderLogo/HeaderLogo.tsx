import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { useNavigate } from "react-router-native";

import { useAppDispatch } from "../../hooks/useRedux";
import {
  setNotificationMenuActive,
  setSearchActive,
} from "../../store/slices/globalSlice";

import { EXPLORE_PATH } from "../../constants";

export const HeaderLogo = ({ setShowAddMenu }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleSelect = () => {
    navigate(EXPLORE_PATH);
    dispatch(setNotificationMenuActive(false));
    dispatch(setSearchActive(false));
    setShowAddMenu(false);
  };

  return (
    <TouchableOpacity onPress={handleSelect}>
      <Image
        source={require("../../logo_alt.png")}
        style={{ width: 32, height: 42 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};
