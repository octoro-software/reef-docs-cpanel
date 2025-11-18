import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useLocation, useNavigate, useParams } from "react-router-native";

import { useGetTankLiveStockProfile } from "../../../hooks/useTanks";

import {
  AppImage,
  Grid,
  GridItem,
  Heading,
  Icon,
  Text,
} from "../../../components";
import { UserPostCardScreenHeader } from "../../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";

import {
  BLACK,
  LIVESTOCK_TANK_FILE_MENU,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../../constants";

type DataStateProps = {
  image?: string;
  name?: string;
  latinName?: string;
};

export const TankLiveStockFile: React.FC = () => {
  const location = useLocation();
  const { id } = useParams();

  const [data, setData] = useState<DataStateProps>({});

  const navigate = useNavigate();

  const [getLiveStockProfile] = useGetTankLiveStockProfile();

  const handleGetProfile = async () => {
    const response = await getLiveStockProfile(id?.replaceAll(":", ""));

    const payload = createProfileData(response?.data);

    setData(payload);
  };

  useEffect(() => {
    if (id) handleGetProfile();
  }, [id]);

  return (
    <View>
      <UserPostCardScreenHeader
        title={`${location?.state?.title} > File`}
        icon="reefDocsFish"
      />

      <Grid direction="column" gap={16}>
        <Grid gap={8} alignItems="center">
          <AppImage
            path={data?.image}
            width={128}
            height={128}
            style={styles.profileImage}
          />

          <GridItem alignItems="center">
            <Heading weight="semiBold" variant={5}>
              {data?.name}
            </Heading>

            <Text>{data?.latinName}</Text>
          </GridItem>
        </Grid>

        <Grid direction="row" justifyContent="space-between">
          <GridItem justifyContent="center" alignItems="center">
            <Text weight="semiBold">Purchase Date</Text>
            <Text weight="semiBold">24/12/24</Text>
          </GridItem>
          <GridItem justifyContent="center" alignItems="center">
            <Text weight="semiBold">Status</Text>
            <Text style={{ color: REEF_DOCS_BLUE }} weight="bold">
              Alive
            </Text>
          </GridItem>
          <GridItem justifyContent="center" alignItems="center">
            <Text weight="semiBold">Purchase Price</Text>
            <Text weight="semiBold">£235.00</Text>
          </GridItem>
        </Grid>
      </Grid>

      <View style={{ marginTop: 16 }}>
        {LIVESTOCK_TANK_FILE_MENU?.map((menuItem, key) => {
          let label = menuItem?.label;
          let icon = menuItem?.icon;

          return (
            <TouchableOpacity onPress={() => navigate(menuItem.path)} key={key}>
              <Grid
                direction="row"
                style={styles.menuItem}
                justifyContent="space-between"
                alignItems="center"
              >
                <GridItem>
                  <Grid alignItems="center" direction="row" gap={8}>
                    <Icon name={icon} width={32} height={32} />
                    <Text weight="bold">{label}</Text>
                  </Grid>
                </GridItem>
                <GridItem>
                  <Icon name="chevronRight" fill={BLACK} />
                </GridItem>
              </Grid>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    marginTop: 16,
    borderRadius: 64,
  },
  menuItem: {
    padding: 16,
    backgroundColor: WHITE,
    marginLeft: -16,
    marginRight: -16,
  },
});

const createProfileData = (data) => {
  const image =
    data?.userContent?.profileImage ?? data?.live_stock?.images?.[0]?.url;

  const name = data?.userContent?.name ?? data?.live_stock?.name;

  const latinName = data?.live_stock?.scientific_name;

  return {
    image,
    name,
    latinName,
  };
};
