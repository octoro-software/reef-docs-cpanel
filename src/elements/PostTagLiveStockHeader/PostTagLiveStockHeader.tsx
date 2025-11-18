import React from "react";
import { StyleSheet, View } from "react-native";

import { AppImage, Button, Grid, Heading, RichText } from "../../components";

import { useGetLiveStockProfile } from "../../hooks/useLiveStock";
import { getAppDimensions } from "../../utility/dimensions";
import { REEF_DOCS_BLUE } from "../../constants";

const { width } = getAppDimensions();

const PostTagLiveStockHeaderComponent = ({
  liveStockId,
  handleClearLiveStockFilter,
}) => {
  const [getLiveStockProfile] = useGetLiveStockProfile();

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      if (liveStockId) {
        const profile = await getLiveStockProfile(liveStockId);
        setData(profile?.data);
      }
    };

    fetchData();
  }, [liveStockId]);

  if (!liveStockId) return <></>;

  return (
    <Grid direction="column" style={styles.container} gap={8}>
      <AppImage
        path={data?.images?.[0]?.url}
        width={width - 32}
        height={180}
        style={styles.image}
      />
      <View>
        <Heading weight="semiBold" variant={5} style={{ textAlign: "center" }}>
          {data?.name}
        </Heading>
        <RichText
          html={`<p>Viewing Posts Mentioning <b>@${data?.name}</b></p>`}
          styles={{
            b: { color: REEF_DOCS_BLUE, fontWeight: "bold" },
            p: { textAlign: "center" },
          }}
        />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Clear"
          variant="secondary"
          style={{ padding: 8, width: 100 }}
          onPress={handleClearLiveStockFilter}
        />
      </View>
    </Grid>
  );
};

export const PostTagLiveStockHeader = React.memo(
  PostTagLiveStockHeaderComponent
);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    borderRadius: 8,
  },
});
