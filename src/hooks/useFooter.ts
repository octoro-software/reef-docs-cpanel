import { useLocation, useNavigate } from "react-router-native";
import {
  useAddToWishList,
  useInWishList,
  useRemoveFromWishList,
} from "./useWishList";
import { useModal } from "./useModal";

import {
  CORAL_PATH,
  EXPLORE_PATH,
  SOCIAL_PATH,
  POLLS_PATH,
  SOCIAL_MY_POSTS_PATH,
  SOCIAL_SAVED_POSTS_PATH,
  SOCIAL_URGENT_PATH,
  SOCIAL_PENDING_POSTS_PATH,
} from "../constants";
import { useShareArticle, useShareLiveStock } from "./useShare";
import { useAddToTank, useTankList } from "./useTanks";
import { useAppDispatch, useAppSelector } from "./useRedux";

import { POST_CLASSIFICATION_GENERAL_HELP } from "../constants/global";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { selectArticleSlug } from "../store/slices/moreSlice";
import { useAudience } from "./useAudience";
import { setConfirmWheelIndicator } from "../store/slices/globalSlice";
import { useUser } from "./useAuth";

export const useFooterHeight = () => {
  const insets = useSafeAreaInsets();

  return insets.bottom;
};

export const useFooterButtonConfig = () => {
  const location = useLocation();

  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    setTimeout(() => {
      dispatch(setConfirmWheelIndicator(true));
    }, 500);

    setTimeout(() => {
      dispatch(setConfirmWheelIndicator(false));
    }, 2500);
  };

  const tanks = useTankList();

  const liveStockId = location?.pathname.split("/")[2]?.replace(":", "");

  const articleUrl = useAppSelector(selectArticleSlug);

  const { openModal } = useModal();

  const navigate = useNavigate();

  const { isFresh } = useAudience();

  const user = useUser();

  const [addToWishList] = useAddToWishList();
  const [removeFromWishList] = useRemoveFromWishList();
  const [shareLiveStock] = useShareLiveStock(liveStockId);
  const [shareArticle] = useShareArticle();

  const [addLiveStockToTank] = useAddToTank(liveStockId);

  const inWishList = useInWishList(liveStockId);

  const pathname = location.pathname === "/" ? EXPLORE_PATH : location.pathname;

  const handleCoralDatabaseNavigate = () => {
    navigate(CORAL_PATH);
  };

  const favouriteConfig = () => {
    return [
      // {
      //   icon: "reefDocsHomeTest",
      //   iconWidth: 48,
      //   iconHeight: 48,
      //   label: "Home Test",
      //   onPress: () =>
      //     openModal({
      //       type: "homeTestCreateModal",
      //       modalTitle: "Home Test",
      //       height: "large",
      //     }),
      // },
      // {
      //   icon: "reefDocsHomeTest",
      //   iconWidth: 48,
      //   iconHeight: 48,
      //   label: "Home Test",
      //   onPress: () =>
      //     openModal({
      //       type: "homeTestCreateModal",
      //       modalTitle: "Home Test",
      //       height: "large",
      //     }),
      // },
      // {
      //   icon: "reefDocsHomeTest",
      //   iconWidth: 48,
      //   iconHeight: 48,
      //   label: "Home Test",
      //   onPress: () =>
      //     openModal({
      //       type: "homeTestCreateModal",
      //       modalTitle: "Home Test",
      //       height: "large",
      //     }),
      // },
      // {
      //   icon: "reefDocsHomeTest",
      //   iconWidth: 48,
      //   iconHeight: 48,
      //   label: "Home Test",
      //   onPress: () =>
      //     openModal({
      //       type: "homeTestCreateModal",
      //       modalTitle: "Home Test",
      //       height: "large",
      //     }),
      // },
    ];
  };

  const buttonConfig = () => {
    if (pathname.includes("/testing")) {
      return [
        {
          icon: "reefDocsContribution",
          label: "Help",
          onPress: () =>
            openModal({
              type: "ftuModal",
              height: "large",
              modalTitle: "Testing Help",
              data: {
                type: pathname.includes("element")
                  ? "elementTesting"
                  : "testing",
              },
            }),
          iconWidth: 48,
          iconHeight: 48,
        },
        {
          icon: "reefDocsIcpTest",
          iconWidth: 48,
          iconHeight: 48,
          label: "Add Dosing",
          onPress: () =>
            openModal({
              type: "dosingCreateModal",
              modalTitle: "Dosing",
              height: "large",
              data: {
                quickMenu: true,
              },
            }),
        },

        {
          icon: "reefDocsHomeTest",
          iconWidth: 48,
          iconHeight: 48,
          label: "Home Test",
          onPress: () =>
            openModal({
              type: "homeTestCreateModal",
              modalTitle: "Home Test",
              height: "large",
            }),
        },
        {
          icon: "reefDocsTestSettings",
          iconWidth: 48,
          iconHeight: 48,
          label: "Test Settings",
          onPress: () =>
            openModal({
              type: "testSettingsModal",
              modalTitle: "Testing Settings",
              height: "large",
            }),
        },
        isFresh
          ? { spacer: true }
          : {
              icon: "reefDocsIcpTest",
              iconWidth: 48,
              iconHeight: 48,
              label: "ICP Test",
              onPress: () =>
                openModal({
                  type: "icpTestCreateModal",
                  modalTitle: "ICP Test",
                  height: "large",
                  data: {
                    quickMenu: true,
                  },
                }),
            },
      ];
    } else if (pathname.includes("/livestock") && pathname !== "/livestock") {
      return [
        {
          icon: "reefDocsContribution",
          label: "Help",
          onPress: () =>
            openModal({
              type: "ftuModal",
              height: "large",
              modalTitle: "Livestock Help",
              data: {
                type: "livestockProfile",
              },
            }),
          iconWidth: 48,
          iconHeight: 48,
        },
        {
          icon: "reefDocsShare",
          label: "Share",
          onPress: async () => await shareLiveStock(),
          iconWidth: 48,
          iconHeight: 48,
        },
        {
          icon: "reefDocsAddToTank",
          label: "Add to Tank",
          iconWidth: 48,
          iconHeight: 48,
          onPress: async (tankId) =>
            tanks?.length > 0
              ? await addLiveStockToTank(tankId).then(handleConfirm)
              : openModal({
                  type: "tankModal",
                  modalTitle: "Create Tank",
                  height: "large",
                  data: {
                    addToTankLiveStockId: liveStockId,
                    addToTankConfirm: handleConfirm,
                  },
                }),
          ...(tanks.length > 0
            ? {
                options: tanks.map((tank) => ({
                  label: tank.name,
                  value: tank.id,
                })),
                optionTitle: "Select a Tank",
                skipOnOne: true,
              }
            : {}),
        },

        {
          icon: "reefDocsWishList",
          label: "Favourite",
          buttonColor: inWishList ? "#4c8b25" : "#00a2ff",
          iconWidth: 48,
          iconHeight: 48,
          onPress: async () =>
            inWishList
              ? await removeFromWishList(liveStockId)
              : await addToWishList(liveStockId),
        },
        {
          spacer: true,
        },
      ];
    } else if (pathname === "/livestock") {
      return [
        {
          icon: "reefDocsContribution",
          label: "Help",
          onPress: () =>
            openModal({
              type: "ftuModal",
              height: "large",
              modalTitle: "Livestock Database Help",
              data: {
                type: "livestockDatabase",
              },
            }),
          iconWidth: 48,
          iconHeight: 48,
        },

        {
          icon: "reefDocsRequestProfile",
          label: "Request Profile",
          iconWidth: 48,
          iconHeight: 48,
          onPress: async () =>
            openModal({
              type: "liveStockRequestFormModal",
              modalTitle: "Request a Profile",
              height: "large",
              data: { icon: "reefDocsRequestProfile" },
            }),
        },
        {
          icon: isFresh ? "reefDocsPlantDatabase" : "reefDocsCoralDatabase",
          label: isFresh ? "Plant Database" : "Coral Database",
          iconWidth: 48,
          iconHeight: 48,
          onPress: async () => handleCoralDatabaseNavigate(),
        },
        {
          icon: isFresh
            ? "reefDocsRequestPlantProfile"
            : "reefDocsRequestCoralProfile",
          label: "Request Profile",
          iconWidth: 48,
          iconHeight: 48,
          onPress: async () =>
            openModal({
              type: "liveStockRequestFormModal",
              modalTitle: "Request a Profile",
              height: "large",
              data: {
                icon: isFresh
                  ? "reefDocsRequestPlantProfile"
                  : "reefDocsRequestCoralProfile",
              },
            }),
        },

        {
          spacer: true,
        },
      ];
    } else if (pathname.includes("/coral") && pathname !== "/coral") {
      return [
        {
          spacer: true,
        },

        {
          icon: isFresh ? "reefDocsPlantShare" : "reefDocsCoralShare",
          label: "Share",
          onPress: async () => await shareLiveStock(true),
          iconWidth: 48,
          iconHeight: 48,
        },
        {
          icon: isFresh ? "reefDocsPlantAddToTank" : "reefDocsCoralAddToTank",
          label: "Add to Tank",
          iconWidth: 48,
          iconHeight: 48,
          onPress: async (tankId) =>
            tanks?.length > 0
              ? await addLiveStockToTank(tankId).then(handleConfirm)
              : openModal({
                  type: "tankModal",
                  modalTitle: "Create Tank",
                  height: "large",
                  data: {
                    addToTankLiveStockId: liveStockId,
                    addToTankConfirm: handleConfirm,
                  },
                }),
          ...(tanks.length > 0
            ? {
                options: tanks.map((tank) => ({
                  label: tank.name,
                  value: tank.id,
                })),
                optionTitle: "Select a Tank",
                skipOnOne: true,
              }
            : {}),
        },

        {
          icon: isFresh ? "reefDocsPlantFavourite" : "reefDocsCoralFavourite",
          label: "Favourite",
          buttonColor: inWishList ? "#4c8b25" : "#00a2ff",
          iconWidth: 48,
          iconHeight: 48,
          onPress: async () =>
            inWishList
              ? await removeFromWishList(liveStockId)
              : await addToWishList(liveStockId),
        },
        {
          spacer: true,
        },
      ];
    } else if (pathname === "/coral") {
      return [
        {
          icon: "reefDocsContribution",
          label: "Help",
          onPress: () =>
            openModal({
              type: "liveStockContributionInfoModal",
              height: "large",
              modalTitle: "Coral Database Help",
              data: {
                type: "coral",
              },
            }),
          iconWidth: 48,
          iconHeight: 48,
        },

        {
          icon: "reefDocsRequestProfile",
          label: "Request Profile",
          iconWidth: 48,
          iconHeight: 48,
          onPress: async () =>
            openModal({
              type: "liveStockRequestFormModal",
              modalTitle: "Request a Profile",
              height: "large",
              data: { icon: "reefDocsRequestProfile" },
            }),
        },
        {
          icon: "reefDocsDatabase",
          label: "Database",
          iconWidth: 48,
          iconHeight: 48,
          onPress: async () => navigate("/livestock"),
        },
        {
          icon: isFresh
            ? "reefDocsRequestPlantProfile"
            : "reefDocsRequestCoralProfile",
          label: "Request Profile",
          iconWidth: 48,
          iconHeight: 48,
          onPress: async () =>
            openModal({
              type: "liveStockRequestFormModal",
              modalTitle: "Request a Profile",
              height: "large",
              data: {
                icon: isFresh
                  ? "reefDocsRequestPlantProfile"
                  : "reefDocsRequestCoralProfile",
              },
            }),
        },
        {
          spacer: true,
        },
      ];
    } else if (pathname === "/tanks") {
      return [
        {
          icon: "reefDocsContribution",
          label: "Help",
          onPress: () =>
            openModal({
              type: "ftuModal",
              height: "large",
              modalTitle: "Tanks Help",
              data: {
                type: "tankIndex",
              },
            }),
          iconWidth: 48,
          iconHeight: 48,
        },
        {
          icon: "reefDocsIcpTest",
          iconWidth: 48,
          iconHeight: 48,
          label: "Add Dosing",
          onPress: () =>
            tanks?.length > 0
              ? openModal({
                  type: "dosingCreateModal",
                  modalTitle: "Dosing",
                  height: "large",
                })
              : openModal({
                  type: "tankModal",
                  modalTitle: "Create Tank",
                  height: "large",
                }),
        },

        {
          icon: "reefDocsTanks",
          iconWidth: 48,
          iconHeight: 48,
          label: "Create Tank",
          onPress: () =>
            openModal({
              type: "tankModal",
              modalTitle: "Create Tank",
              height: "large",
            }),
        },
        {
          icon: "reefDocsHomeTest",
          iconWidth: 48,
          iconHeight: 48,
          label: "Home Test",
          onPress: () =>
            tanks?.length > 0
              ? openModal({
                  type: "homeTestCreateModal",
                  modalTitle: "Home Test",
                  height: "large",
                })
              : openModal({
                  type: "tankModal",
                  modalTitle: "Create Tank",
                  height: "large",
                }),
        },
        isFresh
          ? { spacer: true }
          : {
              icon: "reefDocsIcpTest",
              iconWidth: 48,
              iconHeight: 48,
              label: "ICP Test",
              onPress: () =>
                tanks?.length > 0
                  ? openModal({
                      type: "icpTestCreateModal",
                      modalTitle: "ICP Test",
                      height: "large",
                      data: {
                        quickMenu: true,
                      },
                    })
                  : openModal({
                      type: "tankModal",
                      modalTitle: "Create Tank",
                      height: "large",
                    }),
            },
      ];
    } else if (pathname === "/more" && articleUrl) {
      return [
        {
          spacer: true,
        },
        {
          spacer: true,
        },
        {
          icon: "reefDocsShareArticle",
          iconWidth: 48,
          iconHeight: 48,
          label: "Share Guide",
          onPress: async () => await shareArticle(),
        },
        {
          spacer: true,
        },
        {
          spacer: true,
        },
      ];
    } else if (pathname.includes("/tanks/:id/tasks"))
      return [
        {
          icon: "reefDocsContribution",
          label: "Help",
          onPress: () =>
            openModal({
              type: "ftuModal",
              height: "large",
              modalTitle: "Tasks Help",
              data: {
                type: "tankTasks",
              },
            }),
          iconWidth: 48,
          iconHeight: 48,
        },
        {
          icon: "reefDocsEditTask",
          label: "Edit Tasks",
          iconWidth: 48,
          iconHeight: 48,
          onPress: () =>
            openModal({
              type: "tankEditTasksModal",
              modalTitle: "Edit Tasks",
              height: "large",
            }),
        },
        {
          icon: "reefDocsTasks",
          label: "Add Task",
          iconWidth: 48,
          iconHeight: 48,
          onPress: () =>
            openModal({
              type: "tankTaskModal",
              modalTitle: "New Task",
              height: "large",
            }),
        },
        {
          icon: "reefDocsTaskSettings",
          label: "Task Settings",
          iconWidth: 48,
          iconHeight: 48,
          onPress: () =>
            openModal({
              type: "tankTaskSettingsModal",
              modalTitle: "Task Settings",
              height: "large",
            }),
        },
        {
          spacer: true,
        },
      ];
    else if (pathname.includes("/tanks/:id/progress"))
      return [
        {
          spacer: true,
        },
        {
          spacer: true,
        },
        {
          icon: "reefDocsProgress",
          label: "Add Progress",
          iconWidth: 48,
          iconHeight: 48,
          onPress: () =>
            openModal({
              type: "tankProgressModal",
              height: "large",
              modalTitle: "Add Progress",
              data: {
                title: "Add Progress",
                description: "Log the progress of your tank.",
              },
            }),
        },
        {
          spacer: true,
        },
        {
          spacer: true,
        },
      ];
    else if (pathname.includes("/explore"))
      return [
        {
          icon: "reefDocsContribution",
          label: "Help",
          onPress: () =>
            openModal({
              type: "ftuModal",
              height: "large",
              modalTitle: "Help",
              data: {
                type: "home",
              },
            }),
          iconWidth: 48,
          iconHeight: 48,
        },
        {
          label: "Mini Game",
          icon: "reefDocsGame",
          iconWidth: 48,
          iconHeight: 48,
          onPress: () =>
            openModal({
              type: "whileYouWaitModal",
              height: "large",
              modalTitle: "Mini Game",
            }),
        },
        {
          label: "Polls",
          icon: "reefDocsPolls",
          iconWidth: 48,
          iconHeight: 48,
          onPress: () => navigate(POLLS_PATH),
        },
        {
          spacer: true,
        },
        {
          spacer: true,
        },
      ];
    else if (pathname.includes(SOCIAL_PATH))
      return [
        {
          icon: "reefDocsMyPosts",
          label: "My Posts",
          iconWidth: 48,
          iconHeight: 48,
          onPress: () => navigate(SOCIAL_MY_POSTS_PATH),
        },
        {
          icon: "reefDocsUrgentPosts",
          label: "Urgent Posts",
          iconWidth: 48,
          iconHeight: 48,
          onPress: () => navigate(SOCIAL_URGENT_PATH),
        },
        {
          icon: "reefDocsAddPost",
          label: "Add Post",
          iconWidth: 48,
          iconHeight: 48,
          onPress: () =>
            openModal({
              type: "helpPostModal",
              modalTitle: "New Post",
              height: "large",
              data: {
                classification: POST_CLASSIFICATION_GENERAL_HELP,
                icon: "reefDocsFish",
                taggable: {
                  coral: true,
                  liveStock: true,
                  articles: false,
                  tags: true,
                  users: false,
                },
              },
            }),
        },
        {
          icon: "reefDocsSavedPosts",
          iconWidth: 48,
          iconHeight: 48,
          label: "Saved Posts",
          onPress: () => navigate(SOCIAL_SAVED_POSTS_PATH),
        },
        user?.isModerator
          ? {
              icon: "reefDocsSavedPosts",
              iconWidth: 48,
              iconHeight: 48,
              label: "Pending Posts",
              onPress: () => navigate(SOCIAL_PENDING_POSTS_PATH),
            }
          : {
              spacer: true,
            },
      ];
  };

  return [buttonConfig, favouriteConfig];
};
