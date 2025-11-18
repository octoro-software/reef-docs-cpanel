import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Text } from "../../components";

import { useModal } from "../../hooks/useModal";

import { getAppDimensions } from "../../utility/dimensions";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY, WHITE } from "../../constants";
import { sendEvent } from "../../utility/analytics";
import { Skeleton } from "../../components/Skeleton/Skeleton";

const { width } = getAppDimensions();

export const LiveStockDataCard = ({
  icon,
  label,
  value,
  id,
  onPress,
  onPressEnabled,
  extraData = null,
  definition,
  notVotable = false,
  loading,
}) => {
  const { openModal } = useModal();

  const handleExtraData = () => {
    sendEvent("LIVESTOCK_EXTRA_DATA", {
      liveStockId: id,
      definition,
      label,
    });

    openModal({
      type: "liveStockExtraDataModal",
      height: "medium",
      modalTitle: "Information",
      data: {
        extraData,
        icon,
        label,
        id,
        definition,
        currentValue: value,
        notVotable,
      },
    });
  };

  if (!value && !loading) return null;

  return (
    <TouchableOpacity
      disabled={(!onPressEnabled && !extraData) || loading}
      onPress={onPressEnabled ? onPress : handleExtraData}
      style={[
        styles.container,
        { borderColor: onPressEnabled ? REEF_DOCS_BLUE : "transparent" },
      ]}
    >
      {loading ? (
        <>
          <Icon name={icon} width={32} height={32} />

          <Text style={styles.label}>{label}</Text>
          <Skeleton height={12} marginBottom={0} marginTop={8} />
        </>
      ) : (
        <>
          <Icon name={icon} width={32} height={32} />

          <Text style={styles.label}>{label}</Text>
          <Text numberOfLines={1} weight="bold" style={styles.value}>
            {value}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 24,
    backgroundColor: WHITE,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: WHITE,
  },
  label: {
    fontSize: 14,
    color: REEF_DOCS_GREY,
  },
  value: {
    fontSize: 14,
    fontWeight: "semibold",
  },
});
