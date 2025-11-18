import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Animated } from "react-native";

import { Grid, GridItem, Icon } from "../../components";

import {
  APP_HEADER_HEIGHT,
  BLACK,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
  WHITE,
} from "../../constants";

import { SearchResults } from "../../elements/Search/SearchResults";
import { LoggedInUserProfileImage } from "../../elements/LoggedInUserProfileImage/LoggedInUserProfileImage";
import { useLocation, useNavigate } from "react-router-native";
import { UpdateCheck } from "../../components/UpdateCheck/UpdateCheck";
import { Notifications } from "../../elements/Notifications/Notifications";
import { HeaderNotifications } from "../../elements/HeaderNotifications/HeaderNotifications";
import { HeaderSearch } from "../../elements/HeaderSearch/HeaderSearch";
import { HeaderMore } from "../../elements/HeaderMore/HeaderMore";
import { HeaderLogo } from "../../elements/HeaderLogo/HeaderLogo";
import { useNotificationsAlerts } from "../../hooks/useNotifications";
import { HeaderQuickMenu } from "../../elements/HeaderQuickMenu/HeaderQuickMenu";
import { getAppDimensions } from "../../utility/dimensions";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  selectNotificationMenuActive,
  selectScrollDirection,
  selectSearchActive,
  setNotificationMenuActive,
  setSearchActive,
} from "../../store/slices/globalSlice";
import { socialPaths } from "./Layout";
import { HeaderMarketplace } from "../../elements/HeaderMarketplace/HeaderMarketplace";
import { HeaderBasket } from "../../elements/HeaderBasket/HeaderBasket";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const dispatch = useAppDispatch();

  const scrollDirection = useAppSelector(selectScrollDirection);

  const notificationScreenActive = useAppSelector(selectNotificationMenuActive);

  const searchScreenActive = useAppSelector(selectSearchActive);

  useNotificationsAlerts();

  const historyStack = useRef<string[]>([]);

  useEffect(() => {
    const currentPath = location.pathname;
    const stack = historyStack.current;

    if (stack.length === 0 || stack[stack.length - 1] !== currentPath) {
      stack.push(currentPath);
    }

    setCanGoBack(stack.length > 1);
  }, [location]);

  const handleBack = () => {
    const stack = historyStack.current;

    if (notificationScreenActive) {
      return dispatch(setNotificationMenuActive(false));
    }

    if (searchScreenActive) {
      return dispatch(setSearchActive(false));
    }

    if (stack.length > 1) {
      stack.pop();

      navigate(stack[stack.length - 1]);
    }
  };

  const isSocialPath = socialPaths.includes(location.pathname);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Animated value for slide
  const translateY = useRef(new Animated.Value(0)).current;

  // Animate header slide up/down on scroll
  useEffect(() => {
    if (scrollDirection === "down" && isSocialPath) {
      Animated.timing(translateY, {
        toValue: -105,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [scrollDirection, isSocialPath, translateY]);

  return (
    <View>
      {showAddMenu && (
        <TouchableOpacity
          onPress={() => setShowAddMenu((prev) => !prev)}
          style={styles.overlay}
        />
      )}
      <Animated.View
        style={[
          styles.container,
          isSocialPath && styles.absolute,
          { transform: [{ translateY }] },
        ]}
      >
        <Grid
          direction="row"
          gap={16}
          justifyContent="center"
          alignItems="center"
        >
          {canGoBack && (
            <GridItem
              style={{
                height: APP_HEADER_HEIGHT,
                width: 30,
                jusifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={handleBack}
                style={{ height: "100%", justifyContent: "center" }}
              >
                <Icon name="back" fill={BLACK} width={24} height={24} />
              </TouchableOpacity>
            </GridItem>
          )}

          <GridItem flex={1} alignItems="center">
            <HeaderMarketplace setShowAddMenu={setShowAddMenu} />
          </GridItem>

          <GridItem flex={1} alignItems="center">
            <HeaderBasket setShowAddMenu={setShowAddMenu} />
          </GridItem>

          <GridItem flex={1} alignItems="center">
            <HeaderSearch setShowAddMenu={setShowAddMenu} />
          </GridItem>

          <GridItem flex={1} alignItems="center">
            <HeaderMore setShowAddMenu={setShowAddMenu} />
          </GridItem>

          <GridItem flex={1} alignItems="center">
            <HeaderNotifications setShowAddMenu={setShowAddMenu} />
          </GridItem>
          <GridItem flex={1} alignItems="center">
            <LoggedInUserProfileImage setShowAddMenu={setShowAddMenu} />
          </GridItem>
        </Grid>
      </Animated.View>
      <UpdateCheck />
      <SearchResults />
      <Notifications />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: APP_HEADER_HEIGHT,
    backgroundColor: WHITE,
    padding: 16,
    justifyContent: "center",
    zIndex: 2,
  },
  absolute: {
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: getAppDimensions().height - 65,
    width: getAppDimensions().width,
    zIndex: 2,
  },
  profile: {
    borderRadius: 100,
    borderColor: REEF_DOCS_GREY,
    borderWidth: 1,
    width: 48,
    height: 48,
  },
  searchCloseButton: {
    position: "absolute",
    backgroundColor: REEF_DOCS_BLUE,
    right: 1,
    height: 45,
    top: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 16,
  },
  suggestions: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  suggestionItem: {
    fontSize: 14,
    color: "gray",
    paddingVertical: 4,
  },
});
