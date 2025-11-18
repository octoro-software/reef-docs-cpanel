import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  selectSearchActive,
  setNotificationMenuActive,
  setSearchActive,
} from "../../store/slices/globalSlice";

import { Icon } from "../../components";

import { BLACK, MORE_PATH, REEF_DOCS_BLUE, WHITE } from "../../constants";
import { useLocation, useNavigate } from "react-router-native";

export const HeaderSearch = ({ setShowAddMenu }) => {
  const dispatch = useAppDispatch();

  const searchActive = useAppSelector(selectSearchActive);

  const location = useLocation();

  const navigate = useNavigate();

  const articlesActive = location.pathname.includes(MORE_PATH);

  const handleSelect = () => {
    dispatch(setNotificationMenuActive(false));
    dispatch(setSearchActive(!searchActive));
    setShowAddMenu(false);
    articlesActive && navigate(-1);
  };

  return (
    <TouchableOpacity onPress={handleSelect}>
      <Icon
        name="reefDocsExplore"
        width={32}
        height={32}
        strokeFill={searchActive ? REEF_DOCS_BLUE : BLACK}
        fill={searchActive ? REEF_DOCS_BLUE : BLACK}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  counter: {
    borderRadius: 80,
    width: 16,
    height: 16,
    backgroundColor: REEF_DOCS_BLUE,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 12,
  },
  counterText: {
    color: WHITE,
    fontSize: 9,
  },
});
