import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigate, useParams } from "react-router-native";

import { selectTanks } from "../../store/slices/tankSlice";

import {
  getTankTypeName,
  getTankVolumeForUser,
} from "../../utility/liquidUnitSelector";

import { Grid, GridItem, Icon, Text } from "../../components";
import { TankCard } from "../../components/TankCard/TankCard";
import { UserPostCardScreenHeader } from "../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";

import { useIsDemo, useUser } from "../../hooks/useAuth";
import { useGetTankProfile } from "../../hooks/useTanks";
import { useAppSelector } from "../../hooks/useRedux";

import { RO_TANK_MENU, TANK_MENU } from "../../constants/global";
import { BLACK, WHITE } from "../../constants";
import { useAudience } from "../../hooks/useAudience";
import { useModal } from "../../hooks/useModal";

export const TankDetailsScreen = () => {
  const { id } = useParams();

  const { openModal } = useModal();

  const allTanks = useAppSelector(selectTanks);

  const tank = allTanks?.find((t) => t.id === id);

  const isRoTank = ["rodi_reservoir", "saltwater_reservoir"].includes(
    tank?.type
  );

  const user = useUser();

  const navigate = useNavigate();

  const [getProfile] = useGetTankProfile();

  const handleTankProfile = async () => await getProfile(id);

  const handleEditTank = (tank) =>
    openModal({
      type: "tankModal",
      height: "large",
      modalTitle: `Edit ${tank?.name}`,
      data: {
        tank,
        edit: true,
      },
    });

  useEffect(() => {
    handleTankProfile();
  }, []);

  const volumeLabel = getTankVolumeForUser(user?.liquidUnit, tank);

  const isDemo = useIsDemo();

  const { isFresh } = useAudience();

  // change to not in array
  const FRESH_TANK_MENU = TANK_MENU.filter(
    (t) => !["Setup", "Par Readings"].includes(t.label)
  );

  const REEF_TANK_MENU = TANK_MENU.filter(
    (t) => !["Amphibians", "Reptiles"].includes(t.label)
  );

  const MENU = isRoTank
    ? RO_TANK_MENU
    : isFresh
      ? FRESH_TANK_MENU
      : REEF_TANK_MENU;

  return (
    <Grid direction="column" gap={8}>
      <UserPostCardScreenHeader title="My Tank" icon="reefDocsTanks" />

      <Grid direction="column" gap={8}>
        <TankCard
          image={tank?.image}
          name={tank?.name}
          volume={volumeLabel}
          tankType={getTankTypeName(tank?.type)}
          disabled={true}
        />

        {MENU?.map((menuItem, key) => {
          let label = menuItem?.label;
          let icon = menuItem?.icon;

          if (menuItem?.label === "Progress ( Coming Soon )" && isDemo) {
            label = "Progress";
          }
          if (menuItem?.label === "Recommendations ( Coming Soon )" && isDemo) {
            label = "Recommendations";
          }

          if (menuItem?.label === "Coral" && isFresh) {
            label = "Plants";
            icon = "reefDocsPlant";
          }

          return (
            <TouchableOpacity
              onPress={() =>
                menuItem?.editTank
                  ? handleEditTank(tank)
                  : navigate(menuItem.path)
              }
              key={key}
            >
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
      </Grid>
    </Grid>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    padding: 16,
    backgroundColor: WHITE,
    marginLeft: -16,
    marginRight: -16,
  },
});
