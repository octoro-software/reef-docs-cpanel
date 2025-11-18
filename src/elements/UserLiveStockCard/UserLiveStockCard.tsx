import React from "react";
import { useNavigate } from "react-router-native";
import { StyleSheet, View } from "react-native";

import { getAppDimensions } from "../../utility/dimensions";

import { ButtonWithConfirmation } from "../../components/ButtonWithConfirmation/ButtonWithConfirmation";
import { LiveStockProfileCarousel } from "../../components/LiveStockProfileCarousel/LiveStockProfileCarousel";
import { AppImage } from "../../components/AppImage/AppImage";
import { Button, Grid, GridItem, Text } from "../../components";

import { REEF_DOCS_LOGO } from "../../constants/global";
import {
  CORAL_PROFILE_PATH,
  LIVESTOCK_PROFILE_PATH,
  REEF_DOCS_GREY,
  TANK_LIVESTOCK_FILE,
} from "../../constants";
import { Skeleton } from "../../components/Skeleton/Skeleton";

const { width } = getAppDimensions();

export const UserLiveStockCard: React.FC = ({
  images,
  name,
  id,
  scientific_name,
  plant_coral,
  handleRemoveFromTank,
  uuid,
  confirmRemove,
  setConfirmRemove,
  title,
  icon,
}) => {
  const navigate = useNavigate();

  const [removeFromTankLoading, setRemoveFromTankLoading] =
    React.useState(false);

  const handleRemove = async () => {
    if (!handleRemoveFromTank) return;

    if (!confirmRemove) {
      setConfirmRemove(uuid);
      return;
    }

    setRemoveFromTankLoading(true);
    await handleRemoveFromTank(id, uuid);
    setRemoveFromTankLoading(false);
    setConfirmRemove(null);
  };

  const handlePress = async () =>
    await navigate(
      plant_coral ? CORAL_PROFILE_PATH(id) : LIVESTOCK_PROFILE_PATH(id)
    );

  return (
    <View style={styles.container}>
      {images?.length > 0 ? (
        <AppImage
          path={images?.[0]?.url}
          width={width - 32}
          height={250}
          priority="high"
          transition={0}
          style={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      ) : (
        <AppImage
          path={REEF_DOCS_LOGO}
          width={width - 32}
          height={250}
          style={styles.imageFallback}
        />
      )}
      <View>
        <Grid style={styles.subContainer} gap={8}>
          <GridItem>
            <Text weight="bold">{name}</Text>
            <Text style={{ fontSize: 12, color: REEF_DOCS_GREY }}>
              {scientific_name}
            </Text>
          </GridItem>

          <Button title="View" variant="secondary" onPress={handlePress} />

          {confirmRemove !== uuid ? (
            <Button
              title="Remove"
              onPress={() => setConfirmRemove(uuid)}
              isLoading={removeFromTankLoading}
              disabled={removeFromTankLoading}
            />
          ) : (
            <Grid direction="row" gap={8}>
              <View style={{ flex: 1 }}>
                <Button
                  title="Confirm Remove?"
                  variant="delete"
                  onPress={handleRemove}
                  isLoading={removeFromTankLoading}
                  disabled={removeFromTankLoading}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => setConfirmRemove("")}
                  disabled={removeFromTankLoading}
                />
              </View>
            </Grid>
          )}
        </Grid>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
  },
  subContainer: {
    padding: 16,
  },
  carousel: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  imageFallback: {
    borderRadius: 8,
  },
});

export const UserLiveStockCardSkeleton: React.FC = () => {
  const { width } = getAppDimensions();
  return (
    <View style={styles.container}>
      <Skeleton width={width - 32} height={250} style={styles.carousel} />
      <View>
        <Grid style={styles.subContainer} gap={8}>
          <GridItem>
            <Skeleton height={20} width={180} style={{ marginBottom: 8 }} />
            <Skeleton height={16} width={120} />
          </GridItem>

          <Skeleton
            height={50}
            width={width - 64}
            style={{ marginBottom: 8 }}
          />

          <Skeleton height={50} width={width - 64} />
        </Grid>
      </View>
    </View>
  );
};
