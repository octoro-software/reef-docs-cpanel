import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { registerForPushNotificationsAsync } from "../../../../hooks/usePushNotifications";
import { useUser } from "../../../../hooks/useAuth";

import {
  Button,
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";

import {
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
} from "../../../../constants";
import { NOTIFICATION_OPTIONS } from "../../../../constants/global";
import { useAppDispatch } from "../../../../hooks/useRedux";
import { setUserProfile } from "../../../../store/slices/globalSlice";

//hello

export const UserNotificationSection = () => {
  const user = useUser();

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [scopes, setScopes] = useState({
    marketing: false,
    tasks: false,
    reminders: false,
    posts: false,
    system: false,
  });

  useEffect(() => {
    setScopes({
      marketing: user?.notification?.marketingScope || false,
      tasks: user?.notification?.taskScope || false,
      reminders: user?.notification?.reminderScope || false,
      posts: user?.notification?.postScope || false,
      system: user?.notification?.systemScope || false,
    });
  }, [user]);

  const handleRegisterNotifications = async () => {
    setLoading(true);

    const response = await registerForPushNotificationsAsync(scopes);

    if (response?.error) {
      setLoading(false);

      return;
    }

    setLoading(false);

    setSuccess(true);

    dispatch(
      setUserProfile({
        ...user,
        notification: {
          postScope: scopes.posts,
          taskScope: scopes.tasks,
          reminderScope: scopes.reminders,
          marketingScope: scopes.marketing,
          systemScope: scopes.system,
        },
      })
    );

    setTimeout(() => {
      setSuccess(false);
    }, 2000);
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
    <ModalComposition
      footerStyle={{
        left: 1,
        paddingBottom: 32,
      }}
      renderFooter={() => (
        <Button
          onPress={handleRegisterNotifications}
          title={success ? "Preferences Updated !" : "Update Preferences"}
          isLoading={loading}
          variant={success ? "success" : "primary"}
        />
      )}
    >
      <View style={styles.wrapper}>
        <Grid gap={8}>
          <ModalHeader
            title="Notifications"
            content="You can opt in / out of the various notification channels on Aqua Docs here"
            icon="reefDocsNotifications"
            iconWidth={48}
            iconHeight={48}
          />

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
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingTop: 0,
  },
  subText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    textAlign: "center",
  },
  notificationTypeWrapper: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: INPUT_BORDER_COLOR,
    borderWidth: 2,
    borderColor: INPUT_BORDER_COLOR,
  },
});
