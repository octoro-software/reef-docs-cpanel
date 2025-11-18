import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { getAppDimensions } from "../../utility/dimensions";

import { LiveStockProfileCarousel } from "../../components/LiveStockProfileCarousel/LiveStockProfileCarousel";
import { AppImage } from "../../components/AppImage/AppImage";
import { Grid, Icon, Text } from "../../components";

import { REEF_DOCS_LOGO } from "../../constants/global";
import { createAppDate } from "../../utility/date";
import { REEF_DOCS_BLUE } from "../../constants";

const { width } = getAppDimensions();

interface TankProgressCardProps {
  images?: string[];
  description?: string;
  date?: string;
  handleEdit: () => void;
}

export const TankProgressCard: React.FC<TankProgressCardProps> = ({
  images,
  description,
  date,
  handleEdit,
}) => {
  const dateTaken = createAppDate(date);

  return (
    <View style={styles.container}>
      {images?.length > 0 ? (
        <LiveStockProfileCarousel
          images={images}
          priority="high"
          imageStyles={styles.carousel}
          showIndicators={false}
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
          <Text expandable={true} maxLength={300}>
            {description}
          </Text>
        </Grid>

        <Grid
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <Text style={{ fontSize: 12 }}>{dateTaken}</Text>

          <TouchableOpacity onPress={handleEdit}>
            <Icon name="edit" fill={REEF_DOCS_BLUE} />
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
