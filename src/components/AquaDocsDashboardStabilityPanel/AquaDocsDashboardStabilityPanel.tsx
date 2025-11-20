import React, { useEffect } from "react";
import { useNavigate } from "react-router-native";

import { Grid, GridItem } from "../Grid/Grid";
import { selectTestCurrentStandingStability } from "../../store/slices/testingSlice";

import { useAppSelector } from "../../hooks/useRedux";

import { useTestHistoryCurrentStanding } from "../../hooks/useTestHistory";
import { DashboardCard } from "../../elements/DashboardCard/DashboardCard";
import { Text } from "../Text/Text";
import { Heading } from "../Heading/Heading";

import { WHITE } from "../../constants";

export const AquaDocsDashboardStabilityPanel: React.FC = () => {
  const [getCurrentStanding] = useTestHistoryCurrentStanding();

  const currentStandingStability = useAppSelector(
    selectTestCurrentStandingStability
  );

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentStanding(true);
  }, []);

  return (
    <Grid direction="column" gap={16}>
      {Array.from({
        length: Math.ceil(currentStandingStability?.data?.length / 3),
      }).map((_, rowIdx) => (
        <Grid direction="row" gap={16} key={rowIdx}>
          {currentStandingStability?.data
            ?.slice(rowIdx * 3, rowIdx * 3 + 3)
            .map((item, index) => {
              const cardIdx = rowIdx * 3 + index;

              return (
                <DashboardCard
                  key={cardIdx}
                  handleOnPress={() =>
                    navigate("/element", {
                      state: {
                        ...item,
                      },
                    })
                  }
                >
                  <Heading
                    style={{ color: WHITE }}
                    variant={5}
                    weight="semiBold"
                  >
                    {`${item.label}  Stability`}
                  </Heading>
                  <Grid direction="row" justifyContent="space-between">
                    <GridItem>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 32,
                          fontWeight: "thin",
                        }}
                      >
                        {`${item?.stability}%`}
                      </Text>
                      <Text
                        style={{
                          color: "white",
                        }}
                      >
                        Coefficient of Variation
                      </Text>
                    </GridItem>
                  </Grid>
                </DashboardCard>
              );
            })}
        </Grid>
      ))}
    </Grid>
  );
};
