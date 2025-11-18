import React from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import {
  AppImage,
  Button,
  Grid,
  GridItem,
  ModalComposition,
  Text,
} from "../../../../components";

import { ModalNoDataFallback } from "../../../../components/ModalNoDataFallback/ModalNoDataFallback";

import { useAppSelector } from "../../../../hooks/useRedux";
import { selectLiveStockProfile } from "../../../../store/slices/liveStockSlice";

import { INPUT_BORDER_COLOR } from "../../../../constants";

export const LiveStockUserExperiences = ({
  handleNextStep,
  icon,
  liveStockId,
}) => {
  const experienceData = useAppSelector(
    selectLiveStockProfile(liveStockId)
  )?.userExperiences;

  const experiences = experienceData?.data;

  const hasSubmittedPreviously = experienceData?.hasSubmittedPreviously;

  return (
    <ModalComposition
      padding={false}
      renderFooter={() => (
        <Button
          title={
            hasSubmittedPreviously
              ? "You have submitted your experience!"
              : "Submit Your Experience"
          }
          variant={hasSubmittedPreviously ? "success" : "primary"}
          onPress={() => handleNextStep(1)}
          disabled={hasSubmittedPreviously}
        />
      )}
    >
      {experiences?.length > 0 ? (
        <View>
          <FlashList
            data={experiences}
            keyExtractor={(item) => item?.id.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            renderItem={({ item }) => (
              <Grid
                gap={8}
                style={{
                  borderBottomWidth: 1,
                  paddingBottom: 16,
                  borderBottomColor: INPUT_BORDER_COLOR,
                }}
              >
                <Text expandable maxLength={200}>
                  {item?.content}
                </Text>

                <Grid direction="row" alignItems="center" gap={8}>
                  <GridItem>
                    <AppImage
                      path={item?.user?.image}
                      width={40}
                      height={40}
                      style={{ borderRadius: 80 }}
                    />
                  </GridItem>
                  <GridItem>
                    <Text weight="bold" style={{ fontSize: 12 }}>
                      {item?.user?.displayName}
                    </Text>
                    <Text style={{ fontSize: 12 }}>{item?.user?.userName}</Text>
                  </GridItem>
                </Grid>
              </Grid>
            )}
          />
        </View>
      ) : (
        <ModalNoDataFallback
          title="No Experiences Submitted Yet"
          text="Be the first, help the community by submitting your experience."
          icon={icon ?? "reefDocsHelp"}
        />
      )}
    </ModalComposition>
  );
};
