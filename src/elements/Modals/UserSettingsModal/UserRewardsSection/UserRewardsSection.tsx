import React, { Fragment, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Grid,
  GridItem,
  Heading,
  Icon,
  ModalComposition,
  Text,
} from "../../../../components";

import {
  INPUT_BORDER_COLOR,
  REEF_DOCS_GREY,
  REEF_DOCS_WINNER,
} from "../../../../constants";
import { AppImage } from "../../../../components/AppImage/AppImage";
import { useUser } from "../../../../hooks/useAuth";

export const UserRewardsSection = () => {
  const user = useUser();

  const {
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: "",
      email: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        displayName: yup.string().required("A display name is required"),
        email: yup.string().required("An email is required"),
      })
    ),
  });

  const lastMonthWinners = [
    {
      displayName: "Luke Robinson",
      userName: "reefer1",
      image: "/app/Nemo_FI.jpg",
    },
    {
      displayName: "Luke Robinson",
      userName: "luke224",
      image: "/app/Nemo_FI.jpg",
    },
    {
      displayName: "Luke Robinson",
      userName: "reefer3",
      image: "/app/Nemo_FI.jpg",
    },
  ];

  const rewards = [
    {
      id: 1,
      providerLogo: "/app/sponsors/charterhouse/ch-logo.png",
      redeemed: true,
      value: 10,
    },
    {
      id: 2,
      providerLogo: "/app/sponsors/charterhouse/ch-logo.png",
      redeemed: false,
      value: 10,
    },
  ];

  const hasRewards = rewards?.length;

  return (
    <ModalComposition footerFix>
      <View style={styles.wrapper}>
        <Grid gap={8}>
          <GridItem alignItems="center">
            <Icon name="tank" />
            <Heading variant={5} weight="regular">
              Rewards
            </Heading>
            <Text style={styles.subText}>
              Users can unlock rewards be completing engagement activities
              throughout the app. Each engagement point is an entry into the
              random monthly draw.
            </Text>
          </GridItem>
          <GridItem alignItems="center">
            <Heading variant={5} weight="regular">
              Last Months Winners
            </Heading>
          </GridItem>
          {lastMonthWinners?.length > 0 && (
            <GridItem alignItems="center">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Grid direction="row" gap={8}>
                  {lastMonthWinners.map((winner, index) => {
                    const isSelf = winner?.userName === user?.userName;

                    return (
                      <GridItem key={index} alignItems="center">
                        <AppImage
                          path={winner?.image}
                          width={48}
                          height={48}
                          style={[
                            styles.profile,
                            isSelf
                              ? {
                                  borderWidth: 3,
                                  borderColor: REEF_DOCS_WINNER,
                                }
                              : {},
                          ]}
                        />
                        <Heading variant={6} weight="semiBold">
                          {winner?.displayName}
                        </Heading>
                        <Text style={styles.text}>{winner?.userName}</Text>
                      </GridItem>
                    );
                  })}
                </Grid>
              </ScrollView>
            </GridItem>
          )}

          <GridItem alignItems="center">
            <Heading variant={5} weight="regular">
              Your Rewards
            </Heading>
          </GridItem>

          {hasRewards ? (
            <Fragment>
              {rewards?.map((reward, index) => {
                return (
                  <View key={index} style={styles.voucher}>
                    <Grid direction="row">
                      <AppImage
                        path={reward?.providerLogo}
                        width={200}
                        height={100}
                        transform={false}
                        resizeMode="contain"
                      />
                      <Text style={styles.text}>
                        {reward?.redeemed ? "Redeemed" : "Available"}
                      </Text>
                    </Grid>
                  </View>
                );
              })}
            </Fragment>
          ) : (
            <GridItem justifyContent="center" alignItems="center">
              <Text>No Rewards Yet</Text>
            </GridItem>
          )}
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingTop: 0,
  },
  subText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    textAlign: "center",
  },
  text: {
    color: REEF_DOCS_GREY,
    fontSize: 12,
  },
  profile: {
    borderRadius: 100,
    borderColor: REEF_DOCS_GREY,
    borderWidth: 1,
    width: 48,
    height: 48,
  },
  voucher: {
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
    padding: 8,
  },
});
