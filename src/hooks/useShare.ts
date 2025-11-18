import Share from "react-native-share";
import { useAppSelector } from "./useRedux";
import { selectLiveStockProfile } from "../store/slices/liveStockSlice";
import {
  CDN_BASE_URL,
  CORAL_PROFILE_PATH,
  LIVESTOCK_PROFILE_PATH,
  MORE_PATH,
} from "../constants";
import { createDeepLink } from "../providers/DeepLinkProvider";
import {
  selectArticleData,
  selectArticleSlug,
} from "../store/slices/moreSlice";
import { useAudience } from "./useAudience";
import { getPostUrlByClassification } from "../utility/post";

export const useShareLiveStock = (liveStockId) => {
  const currentLiveStock = useAppSelector(selectLiveStockProfile(liveStockId));

  const { audience } = useAudience();

  const fn = async (isCoralOrPlant = false) => {
    const deepLink = await createDeepLink({
      path: isCoralOrPlant
        ? CORAL_PROFILE_PATH(liveStockId)?.replace(":", "")
        : LIVESTOCK_PROFILE_PATH(liveStockId)?.replace(":", ""),
      title: currentLiveStock?.name,
      content: "Check out this live stock profile on Aqua Docs!",
      image: encodeURI(`${CDN_BASE_URL}${currentLiveStock?.images?.[0]?.url}`),
      audience,
    });

    Share.open({
      message: currentLiveStock?.name,
      url: deepLink,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  return [fn];
};

export const useSharePost = (postId) => {
  const { audience } = useAudience();

  const fn = async (classification) => {
    const url = getPostUrlByClassification(classification);

    const deepLink = await createDeepLink({
      path: `${url}?postId=${postId}`,
      title: `Check out this post on Aqua Docs!`,
      content: "Check out this post on Aqua Docs!",
      audience,
      customData: {
        postId,
        type: "post",
      },
    });

    Share.open({
      message: "Share Post",
      url: deepLink,
    }).catch((err) => {
      err && console.log(err);
    });
  };
  return [fn];
};

export const useShareArticle = () => {
  const currentArticleUrl = useAppSelector(selectArticleSlug);

  const articleData = useAppSelector(selectArticleData);

  const { audience } = useAudience();

  const fn = async () => {
    const deepLink = await createDeepLink({
      path: `${MORE_PATH}?article=${currentArticleUrl}&deepLink=true`,
      title: articleData?.title,
      content: "Check out this article on Aqua Docs!",
      audience,
    });

    Share.open({
      message: articleData?.title,
      url: deepLink,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  return [fn];
};

export const useGenerateShopJoinLink = () => {
  const { audience } = useAudience();

  const fn = async (shopId, shopName) => {
    const deepLink = await createDeepLink({
      path: `?shopId=${shopId}`,
      title: `Link with ${shopName} on Aqua Docs!`,
      content: `Link with ${shopName} on Aqua Docs!`,
      audience,
      customData: {
        shopId,
      },
    });

    return deepLink;
  };
  return [fn];
};
