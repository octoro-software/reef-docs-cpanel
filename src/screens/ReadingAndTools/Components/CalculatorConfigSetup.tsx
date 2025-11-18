import React from "react";
import { View } from "react-native";

import {
  Button,
  CheckboxField,
  Grid,
  GridItem,
  Heading,
  RichText,
  Select,
  Text,
} from "../../../components";

import { InputLabel } from "../../../components/Form/InputLabel/InputLabel";

import { REEF_DOCS_GREY, WHITE } from "../../../constants";
import { RawTextInput } from "../../../components/Form/RawTextInput/RawTextInput";

export const CalculatorConfigSetup = ({
  tanks,
  handleTankSelect,
  products,
  handleProductSelect,
  title,
  rounding = null,
  handleChangeRounding = () => null,
  calculatorConfig,
  setCalculatorConfig,
}) => {
  const [manualVolume, setManualVolume] = React.useState(false);

  const handleManualVolumeChange = (value) => {
    // ensure its a number only
    if (isNaN(value)) {
      value = 1;
    }

    if (value > 9999999) {
      return;
    }

    setCalculatorConfig((prev) => ({
      ...prev,
      tankConfig: {
        ...prev.tankConfig,
        litres: Number(value),
      },
    }));
  };

  const handleSelectManual = () => {
    setCalculatorConfig((prev) => ({
      ...prev,
      tankConfig: {
        litres: 0,
        taskOnly: !manualVolume,
      },
    }));

    setManualVolume(!manualVolume);
  };

  return (
    <View>
      <Heading variant={4} weight="semiBold">
        {title}
      </Heading>

      {rounding && handleChangeRounding && (
        <Grid
          style={{ flex: 1, marginBottom: 16, marginTop: 16 }}
          direction="row"
          gap={8}
        >
          <Grid
            direction="row"
            gap={8}
            alignItems="center"
            style={{ flexWrap: "wrap" }}
          >
            <GridItem>
              <CheckboxField
                checked={rounding === "none"}
                onChange={() => handleChangeRounding("none")}
                unCheckedColor={REEF_DOCS_GREY}
              />
            </GridItem>
            <GridItem>
              <Text>No Rounding</Text>
            </GridItem>
          </Grid>
          <Grid
            direction="row"
            gap={8}
            alignItems="center"
            style={{ flexWrap: "wrap" }}
          >
            <GridItem>
              <CheckboxField
                checked={rounding === "up"}
                onChange={() => handleChangeRounding("up")}
                unCheckedColor={REEF_DOCS_GREY}
              />
            </GridItem>
            <GridItem>
              <Text>Round Up</Text>
            </GridItem>
          </Grid>
          <Grid
            direction="row"
            gap={8}
            alignItems="center"
            style={{ flexWrap: "wrap" }}
          >
            <GridItem>
              <CheckboxField
                checked={rounding === "down"}
                onChange={() => handleChangeRounding("down")}
                unCheckedColor={REEF_DOCS_GREY}
              />
            </GridItem>
            <GridItem>
              <Text>Round Down</Text>
            </GridItem>
          </Grid>
        </Grid>
      )}

      <Grid direction="column" gap={8}>
        {manualVolume ? (
          <RawTextInput
            style={{ backgroundColor: WHITE }}
            label="Manual Volume ( Litres )"
            keyboardType="numeric"
            onChange={(v) => handleManualVolumeChange(v)}
            value={calculatorConfig?.tankConfig?.litres}
          />
        ) : (
          <GridItem>
            <InputLabel>Choose Tank</InputLabel>

            <Select
              options={tanks}
              title={"Tank"}
              labelKey="name"
              valueKey={"id"}
              onConfirm={handleTankSelect}
              placeholder="Please select a tank"
            />
          </GridItem>
        )}

        <Button
          title={manualVolume ? "Tank Selection" : "Enter Manual Volume"}
          variant="secondary"
          onPress={handleSelectManual}
        />

        <GridItem>
          <InputLabel>Product</InputLabel>

          <Select
            labelKey={"label"}
            valueKey={"id"}
            options={products}
            onConfirm={handleProductSelect}
            title={"Product"}
            placeholder="Please select a product"
          />

          <RichText
            styles={{
              p: {
                fontSize: 12,
                color: REEF_DOCS_GREY,
              },
            }}
            html='<p>Product not listed? Request via <a href="mailto:support@aqua-docs.co.uk">email</a></p>'
          />
        </GridItem>
      </Grid>
    </View>
  );
};
