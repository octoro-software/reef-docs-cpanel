import React from "react";
import { Grid } from "../../Grid/Grid";
import { Select } from "../../Form/Select/Select";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import {
  selectActiveTankId,
  setActiveTank,
  setActiveTankName,
} from "../../../store/slices/userConfigSlice";
import { useTankList } from "../../../hooks/useTanks";
import { Text } from "../../Text/Text";
import { WHITE } from "../../../constants";

export const TankSettingsForm: React.FC = () => {
  const tanks = useTankList();

  const dispatch = useAppDispatch();
  const activeTank = useAppSelector(selectActiveTankId);

  const handleTankSelect = async (value: string) => {
    dispatch(setActiveTank(value));

    const tank = tanks?.find((t) => t.id === value);

    dispatch(setActiveTankName(tank?.name || "Unnamed Tank"));
  };

  return (
    <Grid direction="column" gap={16}>
      <Text style={{ color: WHITE }}>
        Please select a tank to use the cPanel. The tank must be setup in Aqua
        Docs, also ensure you have defined your test settings such as the units
        you use for each parameter.
      </Text>
      <Select
        options={tanks}
        labelKey="name"
        valueKey="id"
        label="Active Tank"
        onConfirm={(v) => handleTankSelect(v)}
        title="Select Tank"
        value={activeTank}
      />
    </Grid>
  );
};
