import Constants from "expo-constants";

export const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// export const API_BASE_URL = "http://192.168.0.65:8000/api";

export const API_BASE_URL_US = Constants.expoConfig.extra.API_BASE_URL_US;
export const CDN_BASE_URL = Constants.expoConfig.extra.CDN_BASE_URL;
export const CDN_VIDEO_BASE_URL = Constants.expoConfig.extra.CDN_VIDEO_BASE_URL;
// Authentication

export const API_PROFILE_URL = "auth/profile";
export const API_REGISTER_URL = "auth/register";
export const API_LOGIN_API = "auth/login";
export const API_LOGOUT_API = "auth/logout";
export const API_PASSWORD_RESET = "auth/passwordReset";
export const API_VERIFY_EMAIL = "auth/verifyEmail";
export const API_VERIFY_PASSWORD_RESET = "auth/verifyPasswordReset";
export const API_SET_NEW_PASSWORD = "auth/updatePassword";
export const API_PHONE_SEND_CODE = "/auth/sendCode";
export const API_PHONE_VERIFY_CODE = "/auth/verifyCode";
export const API_USER_DELETE_REQUEST = "/auth/userDeleteRequest";

//Onboarding

export const API_PUSH_NOTIFICATIONS = "onBoarding/registerPushNotifications";
export const API_USERNAME_CHECK = "onBoarding/userNameCheck";
export const API_TANK_ONBOARDED = "onBoarding/markTankOnboarded";
export const API_DECLARATION_ACCEPT = "onBoarding/declarationAccepted";

//Services

export const API_TANK = "tanks";
export const API_LIVESTOCK = "/liveStock";

//Payments

export const API_GET_MONTHLY_PAYMENT_URL =
  "/payments/generateSecurePaymentLink/monthly";
export const API_GET_ANNUAL_PAYMENT_URL =
  "/payments/generateSecurePaymentLink/annually";
export const API_GET_PAYMENT_MANAGEMENT_URL =
  "/payments/generateSecureSubscriptionManagementUrl";

// ICP
export const API_ICP_PROVIDERS = "icp/providers";

// Elements
export const API_ELEMENTS = "parameterHistory/elements";

// Tanks
