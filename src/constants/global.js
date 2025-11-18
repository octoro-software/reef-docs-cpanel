import Constants from "expo-constants";

import { getAppEnv } from "../utility/environment";
import {
  TANK_AMPHIBIANS_PATH,
  TANK_CORAL_PATH,
  TANK_FISH_PATH,
  TANK_INVERTS_PATH,
  TANK_PAR_PATH,
  TANK_PROGRESS_PATH,
  TANK_REPTILES_PATH,
  TANK_SETUP,
  TANK_TASKS_PATH,
  TANK_TESTING_PATH,
} from "./paths";

export const IS_FRESH = Constants.expoConfig.extra.IS_FRESH === "true";

export const MODAL_TIMEOUT = 350;

export const ACCESS_TOKEN_STORAGE_KEY = "accessToken";
export const REFRESH_TOKEN_STORAGE_KEY = "refreshToken";

export const REEF_DOCS_LOGO = `app/aq2-logo.png`;

export const STRUCTURED_CONFIGURATION_UNITS = "units";
export const STRUCTURED_CONFIGURATION_KITS = "kits";
export const STRUCTURED_CONFIGURATION_TEST_REASON = "testReason";
export const STRUCTURED_CONFIGURATION_DISEASE_TYPES = "diseaseTags";
export const STRUCTURED_CONFIGURATION_FRIEND_OR_FOE_TYPES = "friendOrFoeTags";
export const STRUCTURED_CONFIGURATION_CORAL_DISEASE_TYPES = "coralDiseaseTags";

export const STRUCTURED_CONFIGURATION_LIVESTOCK_TEMPERAMENT_TYPES =
  "livestock_temperament";

export const STRUCTURED_CONFIGURATION_LIVESTOCK_HARDY_TYPES = "livestock_hardy";
export const STRUCTURED_CONFIGURATION_LIVESTOCK_REEF_SAFE_TYPES =
  "livestock_reef_safe";
export const STRUCTURED_CONFIGURATION_LIVESTOCK_DIET_TYPES = "livestock_diet";
export const STRUCTURED_CONFIGURATION_LIVESTOCK_CARE_LEVEL_TYPES =
  "livestock_care_level";
export const STRUCTURED_CONFIGURATION_LIVESTOCK_FEEDING_DIFFICULTY =
  "livestock_feeding_difficulty";
export const STRUCTURED_CONFIGURATION_LIVESTOCK_SWIMMING_ZONES =
  "livestock_swimming_zones";
export const STRUCTURED_CONFIGURATION_LIVESTOCK_INVERT_SAFE =
  "livestock_invert_safe";

export const MAINTENANCE_TEST_REASON_ID =
  "55e8b97a-ec6a-47a7-bfa4-e26454a62858";

export const OTHER_TEST_REASON_ID = "bf215f35-e822-4f2c-9ec7-4e9f254e6c3b";

export const HOME_TEST_DEFINITION = "home";
export const NDOC_TEST_DEFINITION = "ndoc";

export const APP_HEADER_HEIGHT = 65;

export const TANK_MENU = [
  {
    label: "Setup",
    path: TANK_SETUP,
    icon: "reefDocsFish",
  },
  {
    label: "Par Readings",
    path: TANK_PAR_PATH,
    icon: "reefDocsCoralLighting",
  },
  {
    label: "Fish",
    path: TANK_FISH_PATH,
    icon: "reefDocsFish",
  },
  {
    label: "Inverts",
    path: TANK_INVERTS_PATH,
    icon: "reefDocsInverts",
  },
  {
    label: "Reptiles",
    path: TANK_REPTILES_PATH,
    icon: "reefDocsTurtle",
  },
  {
    label: "Amphibians",
    path: TANK_AMPHIBIANS_PATH,
    icon: "reefDocsFrog",
  },
  {
    label: "Coral",
    path: TANK_CORAL_PATH,
    icon: "reefDocsCoral",
  },
  {
    label: "Progress",
    path: TANK_PROGRESS_PATH,
    icon: "reefDocsProgress",
  },
  {
    label: "Testing",
    path: TANK_TESTING_PATH,
    icon: "reefDocsTesting",
  },
  {
    label: "Tasks",
    path: TANK_TASKS_PATH,
    icon: "reefDocsTasks",
  },
  {
    label: "Recommendations ( Coming Soon )",
    icon: "reefDocsRecommendations",
  },
  {
    label: "Edit Tank",
    icon: "reefDocsTanks",
    editTank: true,
  },
];

export const LIVESTOCK_TANK_FILE_MENU = [
  {
    label: "Notes",
    path: TANK_SETUP,
    icon: "reefDocsFish",
  },
  {
    label: "Medical History",
    path: TANK_PAR_PATH,
    icon: "reefDocsCoralLighting",
  },
  {
    label: "Breeding",
    path: TANK_FISH_PATH,
    icon: "reefDocsFish",
  },
  {
    label: "Progress",
    path: TANK_INVERTS_PATH,
    icon: "reefDocsInverts",
  },
];

export const RO_TANK_MENU = [
  {
    label: "Testing",
    path: TANK_TESTING_PATH,
    icon: "reefDocsTesting",
  },
  {
    label: "Tasks",
    path: TANK_TASKS_PATH,
    icon: "reefDocsTasks",
  },
  {
    label: "Edit Tank",
    icon: "reefDocsTanks",
    editTank: true,
  },
];

export const POST_CLASSIFICATION_GENERAL_HELP = "general_help";
export const POST_CLASSIFICATION_CORAL_HELP = "coral_help";
export const POST_CLASSIFICATION_FRIEND_OR_FOE = "friend_or_foe";
export const POST_CLASSIFICATION_DISEASE_IDENTIFICATION =
  "disease_identification";

export const NOTIFICATION_OPTIONS = [
  {
    label: "System",
    description:
      "In app messages, responses from Aqua Docs, any system level notifications.",
    definition: "system",
  },
  {
    label: "Marketing",
    description:
      "To receive news and offers, new feature information and more from Aqua Docs turn this on.",
    definition: "marketing",
  },
  {
    label: "Tasks",
    description: "To receive notifications for tasks, turn this on.",
    definition: "tasks",
  },
  {
    label: "Reminders",
    description: "To receive notifications for reminders, turn this on.",
    definition: "reminders",
  },
  {
    label: "Posts",
    description: "To receive notifications for your posts, turn this on.",
    definition: "posts",
  },
];

export const MARKETING_OPTIONS = [
  {
    label: "Facebook",
    value: "facebook",
  },
  {
    label: "Instagram",
    value: "instagram",
  },
  {
    label: "TikTok",
    value: "tiktok",
  },
  {
    label: "Recommedation",
    value: "recommendation",
  },
  {
    label: "Other",
    value: "other",
  },
];

export const SERVER_OPTIONS =
  getAppEnv() !== "production"
    ? [
        {
          label: "United Kingdom",
          value: "uk",
        },
      ]
    : [
        {
          label: "United Kingdom",
          value: "uk",
        },
        {
          label: "United States",
          value: "us",
        },
      ];

export const LSK_REQUESTED_NOTIFICATIONS = "requestedNotificationPermission";

export const Z_INDEX = {
  dateSelect: 1,
  bottomTabBar: 9,
  liveStockProfileCarouselIndicator: 9,
  scrollToTopFlatListButton: 9,
  videoPlayer: 10,
  videoPlayerReplayOverlay: 10,
  headerQuickMenu: 10,
  socialFullScreenBottomFade: 50,
  fixedFooterModal: 100,
  socialFullScreenCloseButton: 100,
  filter: 999,
  mentionTextInput: 9999,
  loadingBar: 9999,
  fullScreenVideoPlayerVideoProgressbar: 9999999,
  socialFullScreenContainer: 9999999,
};

export const ALL_POST_TAG_ID = "68c892742951c2e3f0090d72";
