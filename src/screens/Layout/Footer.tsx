import React from "react";
import { useLocation, useNavigate } from "react-router-native";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFooterButtonConfig, useFooterHeight } from "../../hooks/useFooter";
import { useAudience } from "../../hooks/useAudience";
import { useAppSelector } from "../../hooks/useRedux";

import { Grid, Icon } from "../../components";

import CircularMenu from "./CircularMenu";

import {
  BLACK,
  CORAL_PATH,
  EXPLORE_PATH,
  SOCIAL_PATH,
  LIVESTOCK_PATH,
  POLLS_PATH,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
  TANKS_PATH,
  WHITE,
} from "../../constants";

import { useDispatch } from "react-redux";
import {
  selectNotificationMenuActive,
  selectWheelMenu,
  setNotificationMenuActive,
  setSearchActive,
} from "../../store/slices/globalSlice";

import { getAppDimensions } from "../../utility/dimensions";
import { selectLastSocialPath } from "../../store/slices/userConfigSlice";

const { width } = getAppDimensions();

export const Footer: React.FC = () => {
  const { isFresh } = useAudience();

  const footerItems = [
    {
      icon: "reefDocsCountryOfOrigin",
      label: "Explore",
      path: EXPLORE_PATH,
      activePaths: [EXPLORE_PATH, POLLS_PATH],
    },
    {
      icon: "reefDocsDatabase",
      label: "Database",
      path: LIVESTOCK_PATH,
      activePaths: [LIVESTOCK_PATH, CORAL_PATH],
    },
    {
      icon: "add",
      mainAction: true,
      path: LIVESTOCK_PATH,
    },
    {
      icon: "reefDocsTanks",
      label: "Tanks",
      path: TANKS_PATH,
    },

    {
      icon: isFresh ? "reefDocsPlantComment" : "reefDocsComment",
      label: "Social",
      path: SOCIAL_PATH,
    },
  ];

  const dispatch = useDispatch();

  const [buttonConfig, favouriteConfig] = useFooterButtonConfig();

  const lastSocialPath = useAppSelector(selectLastSocialPath);

  const menuActive = useAppSelector(selectWheelMenu);

  const location = useLocation();

  const navigate = useNavigate();

  const isActive = (item) => {
    let pathname = location.pathname;

    if (item?.activePaths) {
      return item?.activePaths?.some((path) => pathname.includes(path));
    }

    if (pathname === "/") {
      pathname = EXPLORE_PATH;
    }

    return pathname.includes(item.path);
  };

  const buttonConfigData = buttonConfig() ?? [];

  const favouriteConfigData = favouriteConfig() ?? [];

  const footerHeight = useFooterHeight();

  const isNotificationActive = useAppSelector(selectNotificationMenuActive);

  const handleFooterItemPress = async (item) => {
    dispatch(setSearchActive(false));

    if (isNotificationActive) {
      dispatch(setNotificationMenuActive(false));
    }

    let path = item?.path;

    if (item?.rememberKey === "social") {
      if (lastSocialPath) {
        path = lastSocialPath;
      }
      // Save the path we're navigating to, not the default `item.path`
    }

    navigate(path);

    Keyboard.dismiss();
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingBottom: footerHeight,
            height: 60 + footerHeight,
          },
        ]}
      >
        <Grid
          direction="row"
          gap={width < 375 ? 30 : 32}
          justifyContent="space-between"
          alignItems="center"
          style={styles.grid}
        >
          {footerItems.map((item, index) => {
            const active = isActive(item);

            if (item.mainAction) {
              return (
                <View key={`action-${index}`} style={{ alignItems: "center" }}>
                  <View style={styles.mainAction}>
                    {buttonConfigData && buttonConfigData?.length > 0 && (
                      <CircularMenu
                        buttonsConfig={buttonConfigData}
                        topButtonsConfig={favouriteConfigData}
                        menuActive={menuActive}
                      />
                    )}
                  </View>
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={`footer-item-${index}`}
                onPress={() => handleFooterItemPress(item)}
                style={{ flex: 1 }}
              >
                <View style={styles.iconWrapper}>
                  <Icon
                    fill={active ? REEF_DOCS_BLUE : BLACK}
                    strokeFill={active ? REEF_DOCS_BLUE : BLACK}
                    name={item.icon}
                    height={32}
                    width={32}
                    solid={active}
                  />
                  <Text
                    style={[
                      styles.iconText,
                      { color: active ? REEF_DOCS_BLUE : REEF_DOCS_GREY },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Grid>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: WHITE,
    zIndex: 9999,
    position: "absolute",
    bottom: 0,
  },
  grid: {
    height: 60,
    textAlign: "center",
    padding: 16,
    flex: 1,
  },
  iconWrapper: {
    alignItems: "center",
    zIndex: 1,
  },
  iconText: {
    fontSize: 12,
  },
  mainAction: {
    marginTop: -90,
    justifyContent: "center",
    alignItems: "center",
  },
});
