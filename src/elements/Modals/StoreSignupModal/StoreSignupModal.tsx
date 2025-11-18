import React, { useEffect, useState } from "react";

import {
  AppImage,
  Button,
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  Text,
} from "../../../components";
import apiClient from "../../../api/apiClient";

import { useModal } from "../../../hooks/useModal";
import { useAppDispatch } from "../../../hooks/useRedux";
import {
  clearStoreSignup,
  setUserLinkedProfile,
} from "../../../store/slices/globalSlice";

import { useUser } from "../../../hooks/useAuth";

export const StoreSignupModal = ({ storeId }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const user = useUser();

  const hasPreviouslyLinked = user?.linkedStores?.some(
    (store) => store?.storeId === storeId
  );

  const dispatch = useAppDispatch();

  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(clearStoreSignup({}));
  }, []);

  const handleGetInfo = async () => {
    const response = await apiClient.get(`/shopInfo/${storeId}`);

    setData(response?.data?.data);
  };

  const handleJoin = async () => {
    setLoading(true);

    await apiClient.post(`/auth/linkStore/${storeId}`, {});

    dispatch(
      setUserLinkedProfile({
        storeId,
        name: data?.name,
      })
    );

    setLoading(false);

    setSuccess(true);

    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  return (
    <ModalComposition
      footerFix
      renderFooter={() => (
        <Button
          title={hasPreviouslyLinked ? "Already Joined" : "Join"}
          onPress={handleJoin}
          isLoading={loading}
          success={success}
          successMessage="Join Success!"
          disabled={hasPreviouslyLinked}
        />
      )}
    >
      <Grid direction="column" gap={8} style={{ padding: 16 }}>
        <GridItem flex={1} justifyContent="center" alignItems="center">
          <AppImage
            path={data?.image}
            height={250}
            width={250}
            transform={false}
            style={{ resizeMode: "contain" }}
          />
        </GridItem>

        <Heading variant={3} weight="semiBold" style={{ textAlign: "center" }}>
          {data?.name}
        </Heading>

        <Text style={{ textAlign: "center" }}>
          Join {data?.name} to gain access to exclusive features in partnership
          with the store.
        </Text>

        <Text style={{ textAlign: "center" }}>
          Gain Access to the store tanks, on any database screen use the Linked
          Store Filter.
        </Text>
      </Grid>
    </ModalComposition>
  );
};
