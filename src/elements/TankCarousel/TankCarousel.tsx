import React from "react";
import { ScrollView, View } from "react-native";
import { TankCard } from "../../components/TankCard/TankCard";
import { useAppSelector } from "../../hooks/useRedux";
import { selectTanks } from "../../store/slices/tankSlice";
import { Text } from "../../components";

export const TankCarousel: React.FC = () => {
  const tankData = useAppSelector(selectTanks);

  return (
    <View>
      <Text weight="bold" style={{ marginBottom: 8 }}>
        Tanks
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tankData?.map((tank, key) => {
          return <TankCard key={key} name={tank?.name} image={tank?.image} />;
        })}
      </ScrollView>
    </View>
  );
};
