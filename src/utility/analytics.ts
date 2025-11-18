import { useEffect } from "react";
import apiClient from "../api/apiClient";
import { Platform } from "react-native";
import { getSessionId } from "./sessionManager";

export type EventIds =
  | "GLOBAL_SEARCH_QUERY"
  | "GLOBAL_SEARCH_LIVESTOCK_VIEW_ALL_RESULTS"
  | "GLOBAL_SEARCH_HISTORIC_SEARCH_TERM_USED"
  | "GLOBAL_SEARCH_VIEW_LIVESTOCK_RESULT"
  | "GLOBAL_SEARCH_VIEW_ARTICLE_RESULT"
  | "LIVESTOCK_SEARCH_QUERY"
  | "DASHBOARD_VIEW"
  | "DASHBOARD_MAIN_BANNER"
  | "DASHBOARD_FAVOURITES"
  | "DASHBOARD_TRENDING_LIVESTOCK"
  | "DASHBOARD_ARTICLES"
  | "DASHBOARD_LATEST_ARRIVALS"
  | "DASHBOARD_LATEST_ARRIVALS_SHOW_ALL_RESULTS"
  | "DASHBOARD_RECENTY_VIEWED"
  | "PLANT_PROFILE_VIEW"
  | "CORAL_PROFILE_VIEW"
  | "ARTICLE_VIEW"
  | "ARTICLE_VIEW_GLOBAL_SEARCH"
  | "LIVESTOCK_VIEW"
  | "LIVESTOCK_PROFILE_VIEW"
  | "LIVESTOCK_EXTRA_DATA_MODAL"
  | "LIVESTOCK_FAMILY_CAROUSEL"
  | "LIVESTOCK_SIMILAR_TEMPERAMENT_CAROUSEL"
  | "LIVESTOCK_RELATED_ARTICE_CAROUSEL"
  | "LIVESTOCK_NAME_MODAL"
  | "LIVESTOCK_VOTE_MODAL"
  | "LIVESTOCK_CONTRIBUTION_MODAL_OPEN"
  | "LIVESTOCK_USER_EXPERIENCES_MODAL_OPEN"
  | "LIVESTOCK_RELATED_PRODUCTS_CAROUSEL"
  | "LIVESTOCK_VIDEO_MODAL_OPEN"
  | "LIVESTOCK_USER_PHOTOS_MODAL_OPEN"
  | "LIVESTOCK_ACCORDION_OPEN"
  | "APP_INSTALL_VIA_CAMPAIGN";

export const sendEvent = (
  eventId: EventIds,
  eventContent = {},
  anonomous = false
) => {
  const platform = Platform.OS;

  const sessionId = getSessionId();

  const url = anonomous ? "/analytics/anonymous" : "/analytics";

  apiClient.post(url, {
    eventId,
    platform,
    sessionId,
    eventContent,
  });
};

export const sendEventOnce = (eventId: EventIds, eventContent = {}) => {
  useEffect(() => {
    sendEvent(eventId, eventContent);
  }, []);
};
