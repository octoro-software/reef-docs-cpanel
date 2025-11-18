import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useModal } from "../../../hooks/useModal";

import { Button, Grid, ModalComposition, RichText } from "../../../components";
import apiClient from "../../../api/apiClient";

export const RelatedArticlesModal = ({ article }) => {
  const [data, setData] = useState();

  const { closeModal } = useModal();

  const handleGetArticle = async () => {
    const response = await apiClient.get(`/articles/${article?.id}`);

    if (response?.status === 200) {
      setData(response?.data?.data);
    }
  };

  useEffect(() => {
    handleGetArticle();
  }, []);

  return (
    <ModalComposition
      footerFix
      renderFooter={() => <Button title="Close" onPress={closeModal} />}
    >
      <View style={styles.container}>
        <Grid gap={8}>
          <RichText html={data?.content} />
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});
