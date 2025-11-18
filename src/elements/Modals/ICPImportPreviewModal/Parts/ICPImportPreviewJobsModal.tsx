import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { useModal } from "../../../../hooks/useModal";
import { useAppSelector } from "../../../../hooks/useRedux";

import {
  Button,
  Grid,
  Heading,
  Icon,
  Text,
  ModalHeader,
  ModalComposition,
} from "../../../../components";

import { selectIcpProviders } from "../../../../store/slices/IcpSlice";

import { BLACK, INPUT_BORDER_COLOR } from "../../../../constants";
import { AppImage } from "../../../../components/AppImage/AppImage";

export const ICPImportPreviewJobsModal = ({ jobs, handleJobSelect }) => {
  const icpProviders = useAppSelector(selectIcpProviders);

  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button title="Close" onPress={closeModal} variant="secondary" />
        </Grid>
      )}
    >
      <ModalHeader content="Your last 15 ICP Video Imports can be found below. Please tap a completed test to confirm the detected results." />

      <Grid gap={8} style={{ marginTop: 16 }}>
        {jobs?.map((job, index) => {
          const pending = job.statusId === 1;

          const provider = icpProviders?.find(
            (p) => p.id === job.formData?.providerId
          );

          const providerProduct = provider?.products?.find(
            (p) => p.id === job.formData?.testTypeId
          );

          return (
            <TouchableOpacity
              style={[
                styles.cardWrapper,
                index === jobs?.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: INPUT_BORDER_COLOR,
                },
              ]}
              key={index}
              activeOpacity={pending ? 1 : 0.5}
              onPress={() => handleJobSelect(job)}
            >
              <Grid gap={16} direction="row" alignItems="center">
                <AppImage
                  source={{
                    uri: provider?.image,
                  }}
                  style={styles.image}
                  width={48}
                  height={48}
                />
                <View>
                  <Heading variant={6} weight="regular">
                    {provider?.name}
                  </Heading>
                  <Text style={styles.cardDateText}>
                    {job?.formData?.testSentDate}
                  </Text>
                </View>
                <View>
                  <Heading variant={6} weight="regular">
                    {providerProduct?.name}
                  </Heading>
                  <Text style={styles.cardDateText}>{job.status}</Text>
                </View>
                {!pending && job?.statusId !== 5 && (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "flex-end",
                    }}
                  >
                    <View style={styles.iconStyle}>
                      <Icon name="chevronDown" fill={BLACK} />
                    </View>
                  </View>
                )}
              </Grid>
            </TouchableOpacity>
          );
        })}
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    paddingTop: 16,
    paddingBottom: 16,
    borderTopColor: INPUT_BORDER_COLOR,
    borderTopWidth: 1,
  },
  cardDateText: {
    fontSize: 12,
  },
  iconStyle: {
    transform: [{ rotate: "-90deg" }],
  },
  image: {
    borderRadius: 80,
  },
});
