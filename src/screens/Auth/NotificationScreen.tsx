import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
  Button,
  Grid,
  Heading,
  ScreenWrapper,
  ProgressBar,
  GridItem,
  Text,
} from "../../components";

import { INPUT_BORDER_COLOR, REEF_DOCS_BLUE } from "../../constants";
import { registerForPushNotificationsAsync } from "../../hooks/usePushNotifications";

import { NOTIFICATION_OPTIONS } from "../../constants/global";
import { OnboardingContext } from "../../providers/OnboardingProvider";
import { useGetUserProfile } from "../../hooks/useAuth";

//hello

export const NotificationScreen: React.FC = () => {
  const { setIsOnBoarding } = useContext(OnboardingContext);

  const [scopes, setScopes] = useState({
    marketing: true,
    tasks: true,
    reminders: true,
    posts: true,
    system: true,
  });
  const [getUserProfile] = useGetUserProfile();

  const handleRegisterNotifications = async () => {
    if (
      scopes.marketing ||
      scopes.tasks ||
      scopes.reminders ||
      scopes.posts ||
      scopes.system
    ) {
      const response = await registerForPushNotificationsAsync(scopes, true);

      if (response?.error) {
        setScopes({
          marketing: false,
          tasks: false,
          reminders: false,
          posts: false,
          system: false,
        });

        setIsOnBoarding(false);
      }

      if (response.status === 200) {
        setIsOnBoarding(false);
      }
    } else {
      setIsOnBoarding(false);
    }

    await getUserProfile();
  };

  const toggleScope = (scope) => {
    setScopes((prev) => {
      return {
        ...prev,
        [scope]: !prev[scope],
      };
    });
  };

  return (
    <ScreenWrapper style={{ backgroundColor: "#fff", paddingTop: 48 }}>
      <Grid justifyContent="center" direction="column" gap={16}>
        <ProgressBar percentage={80} height={5} />

        <Heading variant={1} weight="semiBold">
          Notifications
        </Heading>
        <Heading variant={6} weight="semiBold">
          To receive notifications from this app, please select the type of
          notifications you would like to receive below. You can change these
          options at any time in your account.
        </Heading>

        <Grid direction="column" gap={16}>
          {NOTIFICATION_OPTIONS?.map((notification, key) => {
            const value = scopes?.[notification.definition];

            return (
              <TouchableOpacity
                key={key}
                onPress={() => toggleScope(notification.definition)}
              >
                <View
                  style={[
                    styles.notificationTypeWrapper,
                    value && {
                      borderColor: REEF_DOCS_BLUE,
                    },
                  ]}
                >
                  <Grid direction="row" gap={16} alignItems="center">
                    <GridItem flex={1}>
                      <Heading variant={5} weight="semiBold">
                        {notification.label}
                      </Heading>

                      <Text>{notification.description}</Text>
                    </GridItem>
                  </Grid>
                </View>
              </TouchableOpacity>
            );
          })}
        </Grid>

        <Button
          variant="secondary"
          title="Confirm Notifications"
          onPress={handleRegisterNotifications}
        />
      </Grid>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  notificationTypeWrapper: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: INPUT_BORDER_COLOR,
    borderWidth: 2,
    borderColor: INPUT_BORDER_COLOR,
  },
});
