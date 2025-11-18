import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Button,
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  Text,
  TextInput,
} from "../../../../components";

import { useUserDeleteAccountRequest } from "../../../../hooks/useAuth";

import { REEF_DOCS_GREY } from "../../../../constants";

export const UserDeleteRequestSection = () => {
  const [success, setSuccess] = useState(false);

  const [userDeleteRequest, deleteRequestLoading, deleteRequestError] =
    useUserDeleteAccountRequest();

  const { trigger, getValues, control, reset } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        deleteReason: yup.string().required("A reason is required").max(600),
      })
    ),
  });

  const handleSubmit = async () => {
    const valid = await trigger();

    if (valid) {
      const data = getValues();

      const response = await userDeleteRequest(data);

      if (response?.status === 200) {
        setSuccess(true);

        reset();

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    }
  };

  return (
    <ModalComposition
      footerStyle={{
        left: 1,
        paddingBottom: 32,
      }}
      renderFooter={() => (
        <Button
          onPress={handleSubmit}
          title={success ? "Request Sent !" : "Send Request"}
          isLoading={deleteRequestLoading}
          variant={success ? "success" : "primary"}
          error={deleteRequestError}
          errorMessage="Something went wrong, please try again later"
        />
      )}
    >
      <View style={styles.wrapper}>
        <Grid gap={8}>
          <ModalHeader
            title="Delete Account"
            content="Please provide details as to why you wish your account to be deleted. This will help us "
            icon="reefDocsDeleteAccount"
            iconWidth={48}
            iconHeight={48}
          />

          <Text weight="bold">Please Note: If you need your account email changing, simply email us rather than deleting your account its much quicker.</Text>

          <Text>If you are having an issue, please email us first before deleting the account, we can normally resolve any problems a user maybe facing</Text>

          <GridItem>
            <TextInput
              name="deleteReason"
              control={control}
              multiline
              textAlignVertical="top"
              numberOfLines={12}
            />
          </GridItem>
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
});
