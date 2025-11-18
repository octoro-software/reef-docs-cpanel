import React from "react";
import { useNavigate } from "react-router-native";

import { useModal } from "../../hooks/useModal";

import { Grid } from "../../components";
import { TankCard } from "../../components/TankCard/TankCard";

import { TANKS_DETAILS_PATH } from "../../constants";
import {
  getTankTypeName,
  getTankVolumeForUser,
} from "../../utility/liquidUnitSelector";
import { useUser } from "../../hooks/useAuth";
import { UserPostCardScreenHeader } from "../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";
import { NoDataFallbackCard } from "../../elements/NoDataFallbackCard/NoDataFallbackCard";
import { useTankList } from "../../hooks/useTanks";

export const MainTankScreen = () => {
  const user = useUser();

  const tanks = useTankList();

  const navigate = useNavigate();

  const { openModal } = useModal();

  const handleNavigateToTankDetails = (id) => navigate(TANKS_DETAILS_PATH(id));

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

  const handleCreateTank = () =>
    openModal({
      type: "tankModal",
      modalTitle: "Create Tank",
      height: "large",
    });

  return (
    <Grid direction="column" gap={8}>
      <UserPostCardScreenHeader title="Tanks" icon="reefDocsTanks" />

      {tanks?.length === 0 && (
        <NoDataFallbackCard
          icon="reefDocsTanks"
          title="No Tanks Yet !"
          centered
          buttonTitle="Create Tank"
          onPress={handleCreateTank}
          description="You have no tanks yet, tap below to create one."
        />
      )}

      <Grid direction="column" gap={8}>
        {tanks?.map((tank, key) => {
          const volumeLabel = getTankVolumeForUser(user?.liquidUnit, tank);
          return (
            <TankCard
              key={key}
              image={tank?.image}
              name={tank?.name}
              volume={volumeLabel}
              latestTest={tank?.latest_test}
              onLongPress={() => handleEditTank(tank)}
              onPress={() => handleNavigateToTankDetails(tank?.id)}
              tankType={getTankTypeName(tank?.type)}
            />
          );
        })}
      </Grid>
    </Grid>
  );
};
