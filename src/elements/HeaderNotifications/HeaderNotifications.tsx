import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  selectNotificationMenuActive,
  selectNotifications,
  setNotificationMenuActive,
  setSearchActive,
} from "../../store/slices/globalSlice";

import { Icon, Text } from "../../components";

import { BLACK, MORE_PATH, REEF_DOCS_BLUE, WHITE } from "../../constants";
import { useLocation, useNavigate } from "react-router-native";

export const HeaderNotifications = ({ setShowAddMenu }) => {
  const dispatch = useAppDispatch();
  const notificationMenuActive = useAppSelector(selectNotificationMenuActive);
  const unreadNotifications =
    useAppSelector(selectNotifications)?.unreadCount ?? 0;

  const location = useLocation();
  const navigate = useNavigate();
  const articlesActive = location.pathname.includes(MORE_PATH);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(unreadNotifications);

  useEffect(() => {
    if (unreadNotifications !== prevCount.current) {
      // Animate bounce when count changes
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.4,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
      prevCount.current = unreadNotifications;
    }
  }, [unreadNotifications]);

  const handleSelect = () => {
    dispatch(setNotificationMenuActive(!notificationMenuActive));
    dispatch(setSearchActive(false));
    setShowAddMenu(false);
    articlesActive && navigate(-1);
  };

  return (
    <TouchableOpacity onPress={handleSelect}>
      <Icon
        name="reefDocsNotifications"
        width={32}
        height={32}
        strokeFill={notificationMenuActive ? REEF_DOCS_BLUE : BLACK}
        fill={notificationMenuActive ? REEF_DOCS_BLUE : BLACK}
      />
      {unreadNotifications > 0 && (
        <Animated.View
          style={[styles.counter, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.counterText}>
            {unreadNotifications.toString()}
          </Text>
        </Animated.View>
      )}
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
