import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  selectSearchActive,
  setNotificationMenuActive,
  setSearchActive,
} from "../../store/slices/globalSlice";

import { Icon } from "../../components";

import { BASKET_PATH, BLACK, REEF_DOCS_BLUE } from "../../constants";
import { useLocation, useNavigate } from "react-router-native";

export const HeaderBasket = ({ setShowAddMenu }) => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const navigate = useNavigate();

  const basketActive = location.pathname.includes(BASKET_PATH);

  const handleSelect = () => {
    dispatch(setNotificationMenuActive(false));
    setShowAddMenu(false);
    navigate(BASKET_PATH);
  };

  return (
    <TouchableOpacity onPress={handleSelect}>
      <Icon
        name="basket"
        width={32}
        height={32}
        strokeFill={basketActive ? REEF_DOCS_BLUE : BLACK}
        fill={basketActive ? REEF_DOCS_BLUE : BLACK}
      />
    </TouchableOpacity>
  );
};
