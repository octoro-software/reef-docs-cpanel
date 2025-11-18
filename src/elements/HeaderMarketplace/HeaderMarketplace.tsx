import React from "react";
import { TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  selectSearchActive,
  setNotificationMenuActive,
  setSearchActive,
} from "../../store/slices/globalSlice";

import { Icon } from "../../components";

import { BLACK, MARKETPLACE_PATH, REEF_DOCS_BLUE } from "../../constants";
import { useLocation, useNavigate } from "react-router-native";

export const HeaderMarketplace = ({ setShowAddMenu }) => {
  const dispatch = useAppDispatch();

  const searchActive = useAppSelector(selectSearchActive);

  const location = useLocation();

  const navigate = useNavigate();

  const marketplaceActive = location.pathname.includes(MARKETPLACE_PATH);

  const handleSelect = () => {
    dispatch(setNotificationMenuActive(false));
    dispatch(setSearchActive(!searchActive));
    setShowAddMenu(false);
    navigate(MARKETPLACE_PATH);
  };

  return (
    <TouchableOpacity onPress={handleSelect}>
      <Icon
        name="reefDocsShop"
        width={32}
        height={32}
        strokeFill={marketplaceActive ? REEF_DOCS_BLUE : BLACK}
        fill={marketplaceActive ? REEF_DOCS_BLUE : BLACK}
      />
    </TouchableOpacity>
  );
};
