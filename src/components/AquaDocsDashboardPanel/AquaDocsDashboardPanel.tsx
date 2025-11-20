import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { useNavigate } from "react-router-native";

import { Grid, GridItem } from "../Grid/Grid";
import { selectTestCurrentStanding } from "../../store/slices/testingSlice";

import { useTestHistoryCurrentStanding } from "../../hooks/useTestHistory";
import { useAppSelector } from "../../hooks/useRedux";

import { DashboardCard } from "../../elements/DashboardCard/DashboardCard";
import { Text } from "../Text/Text";
import { Heading } from "../Heading/Heading";
import { RedSeaReefMat } from "../RedSeaReefMat/RedSeaReefMat";
import { LineChart } from "../LineChart";

import { WHITE } from "../../constants";

export const AquaDocsDashboardPanel: React.FC = () => {
  const [getCurrentStanding] = useTestHistoryCurrentStanding();

  const currentStanding = useAppSelector(selectTestCurrentStanding);

  const cards = currentStanding?.data ?? [];

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentStanding();
  }, []);

  return (
    <ScrollView
      nestedScrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Grid direction="column" gap={16}>
        {Array.from({ length: Math.ceil(cards.length / 3) }).map(
          (_, rowIdx) => (
            <Grid direction="row" gap={16} key={rowIdx}>
              {cards.slice(rowIdx * 3, rowIdx * 3 + 3).map((item, index) => {
                const cardIdx = rowIdx * 3 + index;

                const changeData = calculateChange(
                  item?.latestTest?.result,
                  item?.previousTest?.result
                );

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
                      {`${item.label}  (${item?.unit})`}
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
                          {`${item?.latestTest?.result}`}
                        </Text>
                        <Text
                          style={{
                            color: changeData.color,
                          }}
                        >
                          {changeData.change}
                        </Text>
                      </GridItem>
                      <GridItem>
                        <LineChart
                          data={item.history}
                          width={120}
                          height={48}
                          color={changeData.lineColor}
                        />
                      </GridItem>
                    </Grid>
                  </DashboardCard>
                );
              })}
            </Grid>
          )
        )}

        <RedSeaReefMat />
      </Grid>
    </ScrollView>
  );
};

const calculateChange = (v1: number, v2: number) => {
  const changeNum = Number(v1) - Number(v2);
  const change = changeNum.toFixed(2);

  return {
    color: changeNum < 0 ? "red" : "green",
    lineColor: changeNum < 0 ? "#ef4444" : "#60a5fa",
    change: (changeNum < 0 ? "" : "+") + change,
  };
};
