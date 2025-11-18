import React, { useState } from "react";
import { useNavigate } from "react-router-native";
import { Image } from "react-native";

import {
  Button,
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  RichText,
} from "../../../components";

import { useModal } from "../../../hooks/useModal";
import { useAcceptPostTerms } from "../../../hooks/usePosts";

import { EXPLORE_PATH } from "../../../constants";

export const SocialTermsModal = ({}) => {
  const [homeLoading, setHomeLoading] = useState(false);

  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { closeModal } = useModal();

  const navigate = useNavigate();

  const [acceptSocialTerms] = useAcceptPostTerms();

  const onHomePress = async () => {
    setHomeLoading(true);
    await navigate(EXPLORE_PATH);
    closeModal();
    setHomeLoading(false);
  };

  const acceptTerms = async () => {
    setError(false);
    setLoading(true);

    const response = await acceptSocialTerms();

    setLoading(false);

    if (!response?.error) {
      closeModal();
    } else {
      setError(true);
    }
  };

  const updateInformation = [
    {
      title: "Positive Engagement No Bullying or Harassment",
      description: `<p>Positive engagement is rewarded. Users who interact with Posts and help others will be entered into monthly prize drawers.</p>
        `,
    },
    {
      title: "Nothing Good to Say, Say Nothing",
      description: `<p>Everyone in this hobby started somewhere. If you don't have anything positive to contribute, it's better to remain silent. Aqua Docs will do its best to make common questions available to users to mitigate the same posts as much as possible.</p>
        `,
    },
    {
      title: "No Self Promotion",
      description: `<p>Users are not allowed to promote their own content or services within the app unless they have obtained prior consent.</p>
        `,
    },
    {
      title: "No Buying or Selling",
      description: `<p>Users are not allowed to buy or sell any products or services within the app.</p>
        `,
    },
    {
      title: "No Spam or Irrelevant Content",
      description: `<p>Please refrain from posting multiple times in short succession or irrelevant content. Allow others to have their spot in the feed. All questions are of equal importance.</p>
        `,
    },
    {
      title: "No External Links",
      description: `<p>In order to keep the app safe for all we do not allow external links or references to other websites / platforms. We will soon be adding a resources section that will provide users with links that have been pre screened.</p>
        `,
    },
    {
      title: "Post Restrictions",
      description: `<p>Users who break these guidelines may have their posts removed or receive post bans and have their current entries into the current months competition removed if applicable.</p>
        `,
    },
  ];

  return (
    <ModalComposition
      footerFix
      renderFooter={() => (
        <Grid gap={4}>
          <Button
            variant="secondary"
            isLoading={loading}
            onPress={acceptTerms}
            title="Accept"
            error={!!error}
            errorMessage="There was an error accepting the terms. Please try again later."
          />
          <Button
            variant="primary"
            title="Home"
            isLoading={homeLoading}
            onPress={onHomePress}
          />
        </Grid>
      )}
    >
      <Grid direction="column" gap={8} style={{ padding: 16 }}>
        <GridItem flex={1} justifyContent="center" alignItems="center">
          <Image
            source={require("../../../logo.png")}
            height={100}
            width={100}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 2,
            }}
          />
        </GridItem>

        <Heading variant={4} weight="semiBold" style={{ textAlign: "center" }}>
          Community Guidelines
        </Heading>

        <Grid direction="column" gap={8}>
          {updateInformation.map((item, index) => (
            <GridItem key={index}>
              <Heading variant={5} weight="semiBold">
                {item.title}
              </Heading>
              <RichText html={item.description} />
            </GridItem>
          ))}
        </Grid>
      </Grid>
    </ModalComposition>
  );
};
