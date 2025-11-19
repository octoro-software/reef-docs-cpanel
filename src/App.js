import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SystemBars } from "react-native-edge-to-edge";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

import { AuthenticationProvider } from "./providers/AuthenticationProvider";

import { NavigationProvider } from "./providers/NavigationProvider";

import { Layout } from "./screens/Layout/Layout";
import { MainStack } from "./navigation/MainStack";
import { ModalProvider } from "./providers/ModalProvider";
import { ReduxProvider } from "./providers/ReduxProvider";
import { UpdateProvider } from "./providers/UpdateProvider";
import { NetworkProvider } from "./providers/NetworkProvider";
import { ForceUpgradeProvider } from "./providers/ForceUpgradeProvider";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { WHITE } from "./constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "./providers/ThemeProvider";
import { PushNotificationProvider } from "./providers/PushNotificationProvider";

// rnfbProvider = new ReactNativeFirebaseAppCheckProvider();
// rnfbProvider.configure({
//   android: {
//     provider: getAppEnv() !== "production" ? "debug" : "playIntegrity",
//     debugToken: "6A2FB9C5-B141-4F6E-88FD-09F9BA98151B",
//   },
//   apple: {
//     provider:
//       getAppEnv() !== "production"
//         ? "debug"
//         : "appAttestWithDeviceCheckFallback",
//     debugToken: Constants.expoConfig.extra.APP_CHECK_DEBUG_TOKEN,
//   },
// });

// appCheck(getApp()).initializeAppCheck({
//   isTokenAutoRefreshEnabled: __DEV__ ? false : true,
//   provider: rnfbProvider,
// });

Sentry.init({
  dsn: "https://7855442567ca1d16b87b48511a314273@o4508876546572288.ingest.de.sentry.io/4508876729942096",
  environment: Constants.expoConfig.extra.APP_ENV,
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 0.3,
  // profilesSampleRate is relative to tracesSampleRate.
  // Here, we'll capture profiles for 100% of transactions.
  profilesSampleRate: 0.3,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: true,
      maskAllImages: false,
      maskAllVectors: false,
    }),
  ],
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowList: false,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: false,
  }),
});

export default Sentry.wrap(function App() {
  SystemBars.setStyle({
    navigationBar: "inverted",
    statusBar: "dark",
  });

  return (
    <Sentry.ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={{ backgroundColor: WHITE }}>
          <SystemBars style="dark" />
          <UpdateProvider>
            <ForceUpgradeProvider>
              <KeyboardProvider>
                <NavigationProvider>
                  <ReduxProvider>
                    <AuthenticationProvider>
                      <NetworkProvider>
                        <ModalProvider>
                          <PushNotificationProvider>
                            <ThemeProvider>
                              <Layout>
                                <MainStack />
                              </Layout>
                            </ThemeProvider>
                          </PushNotificationProvider>
                        </ModalProvider>
                      </NetworkProvider>
                    </AuthenticationProvider>
                  </ReduxProvider>
                </NavigationProvider>
              </KeyboardProvider>
            </ForceUpgradeProvider>
          </UpdateProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Sentry.ErrorBoundary>
  );
});
