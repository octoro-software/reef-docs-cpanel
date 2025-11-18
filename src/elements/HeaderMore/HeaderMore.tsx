import React from "react";
import { TouchableOpacity } from "react-native";
import { useLocation, useNavigate } from "react-router-native";

import { useAppDispatch } from "../../hooks/useRedux";
import { useAudience } from "../../hooks/useAudience";

import {
  setNotificationMenuActive,
  setSearchActive,
} from "../../store/slices/globalSlice";

import { Icon } from "../../components";

import {
  BLACK,
  MORE_PATH,
  READING_AND_TOOLS_PATH,
  REEF_DOCS_BLUE,
} from "../../constants";

export const HeaderMore = ({ setShowAddMenu }) => {
  const dispatch = useAppDispatch();

  const { isFresh } = useAudience();

  const location = useLocation();

  const navigate = useNavigate();

  const articlesActive = location.pathname.includes(
    isFresh ? READING_AND_TOOLS_PATH : MORE_PATH
  );

  const handleSelect = () => {
    dispatch(setNotificationMenuActive(false));
    dispatch(setSearchActive(false));
    setShowAddMenu(false);
    navigate(
      articlesActive ? -1 : isFresh ? READING_AND_TOOLS_PATH : MORE_PATH
    );
  };

  return (
    <TouchableOpacity onPress={handleSelect}>
      <Icon
        name="reefDocsArticles"
        width={32}
        height={32}
        strokeFill={articlesActive ? REEF_DOCS_BLUE : BLACK}
        fill={articlesActive ? REEF_DOCS_BLUE : BLACK}
      />
    </TouchableOpacity>
  );
};
