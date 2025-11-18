import React, { useEffect } from "react";
import { useNavigate } from "react-router-native";
import branch from "react-native-branch";
import { useAppDispatch } from "../hooks/useRedux";
import { setStoreSignup } from "../store/slices/globalSlice";
import { useAudience } from "../hooks/useAudience";

export const DeepLinkProvider = ({ children }) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleStoreSignupFlow = (id) => {
    dispatch(setStoreSignup(id));
  };

  const { isFresh } = useAudience();

  useEffect(() => {
    // Handle cold start
    branch.getFirstReferringParams().then(({ params, error }) => {
      if (error) {
        return;
      }

      if (params?.["+clicked_branch_link"]) {
        const path = params?.path || params?.$custom_metadata?.path;
        const shopId = params?.shopId || params?.$custom_metadata?.shopId;
        const postId = params?.postId || params?.$custom_metadata?.postId;

        if (!audienceCheck(params?.audience, isFresh)) {
          return;
        }

        if (path) {
          return navigate(path);
        }

        if (shopId) {
          return handleStoreSignupFlow(shopId);
        }

        if (postId) {
          return navigate(path);
        }
      }
    });

    // Handle warm start

    //make async function
    const unsubscribe = branch.subscribe(async ({ error, params, uri }) => {
      if (error) {
        return;
      }

      if (params?.["+clicked_branch_link"]) {
        const path = params?.path || params?.$custom_metadata?.path;
        const shopId = params?.shopId || params?.$custom_metadata?.shopId;
        const postId = params?.postId || params?.$custom_metadata?.postId;

        if (!audienceCheck(params?.audience, isFresh)) {
          return;
        }

        if (path) {
          return await navigate(path);
        }

        if (shopId) {
          return handleStoreSignupFlow(shopId);
        }

        if (postId) {
          return navigate(path);
        }
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigate]);

  return children;
};

const audienceCheck = (audience, isFresh) => {
  return audience === "fresh-docs"
    ? isFresh
    : audience === "reef-docs"
      ? !isFresh
      : true;
};

export const createDeepLink = async ({
  path,
  title,
  content,
  image = null,
  audience,
  customData = {},
}) => {
  const branchUniversalObject = await branch.createBranchUniversalObject(
    "canonicalIdentifier",
    {
      title: title,
      contentDescription: content,
      contentImageUrl: image,
      contentMetadata: {
        customMetadata: {
          path,
          audience,
          ...customData,
        },
      },
    }
  );

  const { url } = await branchUniversalObject.generateShortUrl();

  return url;
};
