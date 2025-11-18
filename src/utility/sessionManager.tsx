import { AppState, AppStateStatus } from "react-native";
import uuid from "react-native-uuid";

let sessionId = uuid.v4() as string;
let sessionStart = Date.now();
let sessionTimer: NodeJS.Timeout | null = null;

const SESSION_TIMEOUT = 30 * 60 * 1000;

const resetSession = () => {
  sessionId = uuid.v4() as string;
  sessionStart = Date.now();
};

const startSessionMonitor = () => {
  if (sessionTimer) clearInterval(sessionTimer);

  sessionTimer = setInterval(() => {
    const now = Date.now();
    if (now - sessionStart > SESSION_TIMEOUT) {
      resetSession();
    }
  }, 60 * 1000);
};

const handleAppStateChange = (nextAppState: AppStateStatus) => {
  if (nextAppState === "active") {
    const now = Date.now();
    if (now - sessionStart > SESSION_TIMEOUT) {
      resetSession();
    }
  }
};

export const initAppSessionManager = () => {
  AppState.addEventListener("change", handleAppStateChange);
  startSessionMonitor();
};

export const getSessionId = () => sessionId;
