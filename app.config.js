const IS_FRESH = process.env.IS_FRESH === "true";
const appEnv = process.env.APP_ENV || "development";

const IS_DEV = process.env.APP_ENV === "development";

const appName = IS_DEV ? "Aqua Docs cPanel Dev" : "Aqua Docs cPanel";
const appSlug = "aqua-docs-cpanel";
const scheme = IS_DEV ? "aquadocscpaneldev" : "aquadocscpanel";
const bundleId = IS_DEV
  ? "com.octoro.aquadocscpaneldev"
  : "com.octoro.aquadocscpanel";
const iconPath = IS_DEV ? "./src/assets/icon_dev.png" : "./src/assets/icon.png";
const splashPath = "./src/assets/logo.png";
const projectId = "65bf85d6-b223-4c80-bb2e-f98b0360917d";

const googleServicesFilePrefix = IS_DEV
  ? "./google-services/aqua-docs-cpanel-dev"
  : "./google-services/aqua-docs-cpanel";

// Export config
export default {
  expo: {
    name: appName,
    slug: appSlug,
    version: "1.0.0",
    scheme: scheme,
    android: {
      package: bundleId,
      permissions: [
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.POST_NOTIFICATIONS",
      ],
      enableProguardInReleaseBuilds: true,
      extraProguardRules: `
       -keep class com.shopify.reactnative.skia.** { *; }
      `,
      enableShrinkResourcesInReleaseBuilds: true,
      softwareKeyboardLayoutMode: "pan",
      googleServicesFile: `${googleServicesFilePrefix}/google-services.json`,
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: IS_FRESH ? "*.fresh-docs.co.uk" : "*.aqua-docs.co.uk",
              pathPrefix: "",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    ios: {
      googleServicesFile: `${googleServicesFilePrefix}/GoogleService-info.plist`,
      bundleIdentifier: bundleId,
      icon: {
        dark: iconPath,
        light: iconPath,
        tinted: iconPath,
      },
      infoPlist: {
        NSPhotoLibraryUsageDescription: `${appName} needs access to your library to be able to select media.`,
        NSCameraUsageDescription: `${appName} needs access to your camera to be able to select media.`,
        LSApplicationQueriesSchemes: [
          "fb",
          "instagram",
          "twitter",
          "tiktoksharesdk",
        ],
      },
      privacyManifests: {
        NSPrivacyCollectedDataTypes: [
          {
            NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeCrashData",
            NSPrivacyCollectedDataTypeLinked: false,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: [
              "NSPrivacyCollectedDataTypePurposeAppFunctionality",
            ],
          },
          {
            NSPrivacyCollectedDataType:
              "NSPrivacyCollectedDataTypePerformanceData",
            NSPrivacyCollectedDataTypeLinked: false,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: [
              "NSPrivacyCollectedDataTypePurposeAppFunctionality",
            ],
          },
          {
            NSPrivacyCollectedDataType:
              "NSPrivacyCollectedDataTypeOtherDiagnosticData",
            NSPrivacyCollectedDataTypeLinked: false,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: [
              "NSPrivacyCollectedDataTypePurposeAppFunctionality",
            ],
          },
        ],
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
          },
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategorySystemBootTime",
            NSPrivacyAccessedAPITypeReasons: ["35F9.1"],
          },
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategoryFileTimestamp",
            NSPrivacyAccessedAPITypeReasons: ["C617.1"],
          },
        ],
      },
    },
    icon: iconPath,
    extra: {
      APP_ENV: appEnv,
      API_BASE_URL: process.env.API_BASE_URL,
      API_BASE_URL_US: process.env.API_BASE_URL_US,
      CDN_BASE_URL: process.env.CDN_BASE_URL,
      SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
      SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE,
      SENTRY_PROFILES_SAMPLE_RATE: process.env.SENTRY_PROFILES_SAMPLE_RATE,
      SENTRY_SEND_DEFAULT_PII: process.env.SENTRY_SEND_DEFAULT_PII,
      APP_CHECK_DEBUG_TOKEN: process.env.APP_CHECK_DEBUG_TOKEN,
      IS_FRESH: process.env.IS_FRESH,
      SENTRY_DSN: process.env.SENTRY_DSN,
      MEDIA_SERVICE_URL: process.env.MEDIA_SERVICE_URL,
      CDN_VIDEO_BASE_URL: process.env.CDN_VIDEO_BASE_URL,
      eas: {
        projectId,
      },
    },
    owner: "octoro",
    plugins: [
      [
        "react-native-bootsplash",
        { assetsDir: IS_DEV ? "assets/dev/bootsplash" : "assets/bootsplash" },
      ],
      "@react-native-firebase/app",
      "expo-secure-store",
      "expo-localization",
      [
        "expo-font",
        {
          fonts: [
            "./src/assets/Fonts/Inter/Inter-Black.ttf",
            "./src/assets/Fonts/Inter/Inter-Bold.ttf",
            "./src/assets/Fonts/Inter/Inter-ExtraBold.ttf",
            "./src/assets/Fonts/Inter/Inter-Light.ttf",
            "./src/assets/Fonts/Inter/Inter-Medium.ttf",
            "./src/assets/Fonts/Inter/Inter-Regular.ttf",
            "./src/assets/Fonts/Inter/Inter-SemiBold.ttf",
            "./src/assets/Fonts/Inter/Inter-Thin.ttf",
            "./src/assets/Fonts/Poppins/Poppins-Black.ttf",
            "./src/assets/Fonts/Poppins/Poppins-BlackItalic.ttf",
            "./src/assets/Fonts/Poppins/Poppins-Bold.ttf",
            "./src/assets/Fonts/Poppins/Poppins-BoldItalic.ttf",
            "./src/assets/Fonts/Poppins/Poppins-ExtraBold.ttf",
            "./src/assets/Fonts/Poppins/Poppins-ExtraBoldItalic.ttf",
            "./src/assets/Fonts/Poppins/Poppins-ExtraLight.ttf",
            "./src/assets/Fonts/Poppins/Poppins-ExtraLightItalic.ttf",
            "./src/assets/Fonts/Poppins/Poppins-Italic.ttf",
            "./src/assets/Fonts/Poppins/Poppins-Light.ttf",
            "./src/assets/Fonts/Poppins/Poppins-LightItalic.ttf",
            "./src/assets/Fonts/Poppins/Poppins-Medium.ttf",
            "./src/assets/Fonts/Poppins/Poppins-MediumItalic.ttf",
            "./src/assets/Fonts/Poppins/Poppins-Regular.ttf",
            "./src/assets/Fonts/Poppins/Poppins-SemiBold.ttf",
            "./src/assets/Fonts/Poppins/Poppins-SemiBoldItalic.ttf",
            "./src/assets/Fonts/Poppins/Poppins-Thin.ttf",
            "./src/assets/Fonts/Poppins/Poppins-ThinItalic.ttf",
          ],
        },
      ],

      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            deploymentTarget: "15.1",
          },
        },
      ],

      [
        "react-native-edge-to-edge",
        {
          android: {
            parentTheme: "Theme.EdgeToEdge",
            enforceNavigationBarContrast: false,
          },
        },
      ],

      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "aqua-docs",
          organization: "octoro-iu",
        },
      ],
    ],
    runtimeVersion: "1.0.0",
    updates: {
      url: `https://u.expo.dev/${projectId}`,
    },
  },
};
