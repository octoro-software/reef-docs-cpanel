import React from "react";
import { Grid } from "../../Grid/Grid";
import { Heading } from "../../Heading/Heading";
import { useAppSelector } from "../../../hooks/useRedux";
import { selectDashboardSettings } from "../../../store/slices/userConfigSlice";
import { Text } from "../../Text/Text";
import { useElements } from "../../../hooks/useElements";
import { RawTextInput } from "../../Form/RawTextInput/RawTextInput";
import { Select } from "../../Form/Select/Select";

export const DosingFormulaSettingsForm: React.FC = () => {
  const [elements, setElements] = React.useState<any[]>([]);

  const [getElements] = useElements();

  const handleGetElements = async () => {
    const elems = await getElements();
    setElements(elems);
  };

  React.useEffect(() => {
    handleGetElements();
  }, []);

  const dashboardSettings = useAppSelector(selectDashboardSettings);

  const panelPriority = dashboardSettings?.panelPriority;

  const doseableElements =
    elements
      ?.filter((el) => el.canDose && !el.freshApplicable)
      ?.sort((a, b) => a.label.localeCompare(b.label)) || [];

  console.log("Doseable Elements:", doseableElements);

  return (
    <Grid direction="column" gap={16}>
      <Heading variant={5} weight="semiBold" style={{ color: "white" }}>
        Dosing Formula Settings
      </Heading>
      <Text style={{ color: "white" }}>
        Read the back or find the dosage guide for your product and enter it
        here. The cPanel will use this information to calculate the correct
        dosage for your tank to get you back to your set point.
      </Text>

      {doseableElements.map((element) => (
        <Grid direction="column">
          <Heading variant={6} weight="semiBold" style={{ color: "white" }}>
            {element.label}
          </Heading>

          <Grid direction="row" gap={16} alignItems="center">
            <RawTextInput label="Amount" keyboardType="numeric" />
            <Select
              style={{ minWidth: 200 }}
              label="Unit"
              options={[
                {
                  label: "grams (g)",
                  value: "grams",
                },
                {
                  label: "milliliters (ml)",
                  value: "milliliters",
                },
              ]}
              labelKey="unit"
              valueKey="unit"
            />
            <Text>Increases Value By</Text>
            <RawTextInput label="Amount" keyboardType="numeric" />
            <Text>In</Text>
            <RawTextInput label="Litres" keyboardType="numeric" />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
