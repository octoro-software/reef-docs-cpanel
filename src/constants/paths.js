export const LOGIN_PATH = "/login";
export const FORGOT_PASSWORD_PATH = "/forgot-password";
export const FORGOT_PASSWORD_CONFIRM_PATH = "/forgot-password-confirm";
export const FORGOT_PASSWORD_CHANGE_PATH = "/forgot-password-change";
export const REGISTER_PATH = "/register";
export const CONFIRM_EMAIL_PATH = "/register/confirm-email";
export const PROFILE_PATH = "/register/profile";
export const TANK_PATH = "/register/tank";
export const AUDIENCE_PATH = "/register/audience";
export const NOTIFICATIONS_PATH = "/register/notifications";
export const DECLARATION_PATH = "/register/declaration";

export const SEARCH_PATH = "/search";

export const TANKS_PATH = "/tanks";
export const TANKS_DETAILS_PATH = (id) => `/tanks/${id}`;
export const TESTING_PATH = "/tanks/:id/testing";
export const TANK_FISH_PATH = "/tanks/:id/fish";
export const TANK_SETUP = "/tanks/:id/setup";
export const TANK_PAR_PATH = "/tanks/:id/par";
export const TANK_INVERTS_PATH = "/tanks/:id/inverts";
export const TANK_REPTILES_PATH = "/tanks/:id/reptiles";
export const TANK_AMPHIBIANS_PATH = "/tanks/:id/amphibians";
export const TANK_CORAL_PATH = "/tanks/:id/coral";
export const TANK_PROGRESS_PATH = "/tanks/:id/progress";
export const TANK_TESTING_PATH = "/tanks/:id/testing";
export const TANK_TASKS_PATH = "/tanks/:id/tasks";
export const TANK_REMINDERS_PATH = "/tanks/:id/reminders";

export const CORAL_PATH = "/coral";

export const BASKET_PATH = "/basket";
export const MARKETPLACE_PATH = "/marketplace";

export const READING_AND_TOOLS_PATH = "/reading-and-tools";

export const READING_AND_TOOLS_TAP_WATER_CONDITIONERS_PATH =
  "/reading-and-tools/tap-water-conditioners";

export const READING_AND_TOOLS_MEDICATIONS_PATH =
  "/reading-and-tools/medications";
export const READING_AND_TOOLS_NITRIFYING_BACTERIA_PATH =
  "/reading-and-tools/nitrifying-bacteria";
export const READING_AND_TOOLS_PLANT_CORAL_FOOD_PATH =
  "/reading-and-tools/plant-coral-food";
export const READING_AND_TOOLS_LIQUID_CO2_PATH =
  "/reading-and-tools/liquid-co2";
export const READING_AND_TOOLS_ADDITIVES_AND_BUFFERS_PATH =
  "/reading-and-tools/additives-and-buffers";

export const LIVESTOCK_PATH = "/livestock";
export const LIVESTOCK_PROFILE_PATH = (id) => `/livestock/:${id}`;
export const CORAL_PROFILE_PATH = (id) => `/coral/:${id}`;
export const TANK_LIVESTOCK_FILE = (id) =>
  `/tanks/:tankid/livestockFile/:${id}`;
export const EXPLORE_PATH = "/explore";

export const MORE_PATH = "/more";
export const ARTICLES_PATH = "/more/articles";
export const ARTICLES_DISEASE_FINDER_PATH =
  "/more/articles/disease-article-finder";

export const ACCOUNTS_PATH = MORE_PATH + "/account";

export const FRIEND_OR_FOE_PATH = "/friend-or-foe";

export const DISEASE_HELP_PATH = "/disease-help";
export const SOCIAL_PATH = "/social";

export const SOCIAL_URGENT_PATH = "/social/urgent";
export const SOCIAL_MY_POSTS_PATH = "/social/my-posts";
export const SOCIAL_SAVED_POSTS_PATH = "/social/saved-posts";
export const SOCIAL_PENDING_POSTS_PATH = "/social/pending-posts";

export const CORAL_HELP_PATH = "/coral-help";

export const POLLS_PATH = "/polls";
