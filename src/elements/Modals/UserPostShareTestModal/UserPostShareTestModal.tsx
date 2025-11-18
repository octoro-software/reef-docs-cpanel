import React, { useEffect, useState } from "react";
import { Grid, GridItem, ModalComposition, Text } from "../../../components";
import { CurrentStandingView } from "../../../screens/Testing/Components/Views/CurrentStandingView";
import { useElements } from "../../../hooks/useTestHistory";
import { getAppDimensions } from "../../../utility/dimensions";
import { useTestingData } from "../../../screens/Testing/Components/Main/useTestingData";
import { INPUT_BORDER_COLOR } from "../../../constants";
import { FadeInItem } from "../../FadeInItem/FadeInItem";
import { useGetPostSharedParameters } from "../../../hooks/usePosts";
import { CurrentStandingMainViewSkeleton } from "../../../screens/Testing/Components/Main/CurrentStandingMainView.skeleton";
import { View } from "react-native";

const width = getAppDimensions().width;

export const UserPostShareTestModal = ({ postId }) => {
  const [data, setData] = useState([]);

  const [getParameterData, loading] = useGetPostSharedParameters();

  const handleGetParameterData = async () => {
    const response = await getParameterData(postId);

    if (response?.data) {
      setData(response.data);
    }
  };

  const elements = useElements();

  const localData = useTestingData({
    data,
    testType: "all",
    grouped: true,
  });

  useEffect(() => {
    handleGetParameterData();
  }, []);

  return (
    <ModalComposition>
      {loading ? (
        <CurrentStandingMainViewSkeleton
          isRoTank={false}
          displaySecondLine={false}
        />
      ) : (
        localData?.map((group, index) => (
          <>
            <GridItem
              key={`group_${index}`}
              style={[
                {
                  padding: 8,
                  backgroundColor: INPUT_BORDER_COLOR,
                  marginVertical: 8,
                },
                index === 0 && { marginTop: -5 },
              ]}
            >
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                {group.group}
              </Text>
            </GridItem>
            <Grid
              direction="row"
              gap={8}
              justifyContent="space-between"
              style={{
                flexWrap: "wrap",
              }}
            >
              {group?.records?.map((item, index) => (
                <GridItem
                  key={`item_${index}`}
                  style={{ width: width / 2 - 8 }}
                >
                  <FadeInItem delay={index * 50}>
                    <CurrentStandingView
                      data={item}
                      elements={elements}
                      disabled={true}
                      isShared
                    />
                  </FadeInItem>
                </GridItem>
              ))}
            </Grid>
          </>
        ))
      )}
    </ModalComposition>
  );
};
