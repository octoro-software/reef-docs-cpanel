import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  AppImage,
  Button,
  Grid,
  GridItem,
  Heading,
  Icon,
  ModalComposition,
  Text,
} from "../../../components";

import { useModal } from "../../../hooks/useModal";
import { useGetSocialProfile } from "../../../hooks/useAuth";

import { REEF_DOCS_BLUE } from "../../../constants";

export const SocialProfileModal = ({ userName }) => {
  const { closeModal } = useModal();

  const [data, setData] = useState({
    displayName: "Luke Robinson",
    userName,
    totalLiveStockExperienceContributions: 0,
    totalLiveStockImageContributions: 0,
    totalPosts: 0,
    totalComments: 0,
    verifiedUser: false,
    image: null,
  });

  const [getSocialProfile] = useGetSocialProfile();

  const handleGetSocialProfile = async () => {
    const response = await getSocialProfile(userName);

    setData(response?.data);
  };

  useEffect(() => {
    handleGetSocialProfile();
  }, []);

  const stats = [
    {
      label: "Contributions",
      value:
        Number(data?.totalLiveStockExperienceContributions) +
        Number(data?.totalLiveStockImageContributions),
    },
    { label: "Posts", value: data?.totalPosts },
    { label: "Comments", value: data?.totalComments },
  ];

  return (
    <ModalComposition
      footerFix
      renderFooter={() => (
        <Button variant="primary" onPress={closeModal} title="Close" />
      )}
    >
      <Grid direction="column" gap={16} style={{ padding: 16 }}>
        <GridItem alignItems="center">
          <AppImage
            path={data?.image}
            width={120}
            height={120}
            style={styles.image}
          />
        </GridItem>

        <GridItem alignItems="center">
          <Grid direction="row">
            <Heading variant={4} weight="semiBold">
              {data?.displayName}
            </Heading>
            {data?.verifiedUser && (
              <View style={{ marginTop: 10, marginLeft: 4 }}>
                <Icon
                  name="verifiedUser"
                  width={14}
                  height={14}
                  fill={REEF_DOCS_BLUE}
                />
              </View>
            )}
          </Grid>
          <Text>@{data?.userName}</Text>
        </GridItem>

        <Grid direction="row" gap={8} justifyContent="space-between">
          {stats.map((stat, index) => {
            return (
              <GridItem justifyContent="center" alignItems="center" key={index}>
                <Heading variant={4} weight="semiBold">
                  {stat.value}
                </Heading>
                <Text>{stat.label}</Text>
              </GridItem>
            );
          })}
        </Grid>
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 100,
  },
});
