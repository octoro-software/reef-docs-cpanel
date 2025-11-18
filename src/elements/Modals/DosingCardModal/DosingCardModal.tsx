import React from "react";
import { Linking, StyleSheet, View } from "react-native";

import { useAppSelector } from "../../../hooks/useRedux";

import { Button } from "../../../components";

import { selectUser } from "../../../store/slices/globalSlice";
import { selectIcpProviders } from "../../../store/slices/IcpSlice";
import { useElements } from "../../../hooks/useTestHistory";

export const DosingCardModal = ({ element }) => {
  const { preferences } = useAppSelector(selectUser);

  const elements = useElements();

  const chosenElementsProvider = preferences?.elementsProvider;

  const providers = useAppSelector(selectIcpProviders);

  const chosenProvider = providers?.find(
    (p) => p.id === chosenElementsProvider
  );

  const elementData = chosenProvider?.element_buffers?.find(
    (e) => e.elementId === element.id
  );

  const chosenElement = elements?.find((e) => e.id === element.id);

  return (
    <View style={styles.wrapper}>
      {elementData?.productLink && (
        <Button
          title={`Purchase Element - ${chosenElement?.label}`}
          variant="secondary"
          onPress={() => Linking.openURL(elementData?.productLink)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
});
