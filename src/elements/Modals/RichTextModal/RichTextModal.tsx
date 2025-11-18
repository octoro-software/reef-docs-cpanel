import React from "react";
import { StyleSheet, View } from "react-native";

import { useModal } from "../../../hooks/useModal";

import { Button, ModalComposition, RichText } from "../../../components";

export const RichTextModal = ({ richText }) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      footerFix
      renderFooter={() => <Button title="Close" onPress={closeModal} />}
    >
      <View style={styles.container}>
        <RichText html={richText} />
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
