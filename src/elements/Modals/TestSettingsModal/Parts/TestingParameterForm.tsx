import React, { useEffect } from "react";
import {
  Button,
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  Select,
  Text,
  TextInput,
} from "../../../../components";
import { Switch } from "react-native";
import { BLACK, REEF_DOCS_BLUE } from "../../../../constants";
import { useFormContext } from "react-hook-form";

export const TestingParameterForm = ({
  handleNextStep,
  item,
  structuredConfiguration,
  activeMenu,
}) => {
  const { control, setValue, watch } = useFormContext();

  const units = structuredConfiguration?.units || [];

  const unitsMap = units.reduce((acc, unit) => {
    if (unit?.id) {
      acc[unit?.id] = unit;
    }
    return acc;
  }, {});

  const [value] = watch([item?.id]);

  useEffect(() => {
    if (item?.id && !value?.rangeHigh && !value?.rangeLow && !value?.target) {
      setValue(`${item?.id}.rangeHigh`, item?.rangeHigh);
      setValue(`${item?.id}.rangeLow`, item?.rangeLow);
      setValue(`${item?.id}.target`, item?.defaultTarget);
    }
  }, []);

  const applicableUnits =
    item?.units?.map((unit) => {
      return unitsMap[unit];
    }) || [];

  const checkEnabled =
    activeMenu === "Home"
      ? value?.home
      : activeMenu === "NDOC"
        ? value?.ndoc
        : value?.icp;

  const enabled =
    value?.notInTank && !value?.hasAddedToTank ? false : checkEnabled;

  const handleSelect = (e) => {
    const v = e.nativeEvent.value;

    const key =
      activeMenu === "Home"
        ? `${item?.id}.home`
        : activeMenu === "NDOC"
          ? `${item?.id}.ndoc`
          : `${item?.id}.icp`;

    setValue(key, v);

    setValue(`${item?.id}.hasAddedToTank`, true);
  };

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Back"
            variant="primary"
            onPress={() => handleNextStep(-1)}
          />
        </Grid>
      )}
    >
      <Grid gap={16} style={{ marginBottom: 24 }}>
        <ModalHeader
          icon="reefDocsHelp"
          iconWidth={48}
          iconHeight={48}
          title={`${item?.label} (${item?.symbol}) Settings`}
        />

        <Grid style={{ flex: 1 }} direction="column" gap={8}>
          <Grid
            direction="row"
            justifyContent="space-between"
            style={{ marginBottom: 8 }}
          >
            <GridItem flex={1}>
              <Grid direction="row" alignItems="center" gap={8}>
                <Text>Enabled</Text>
                <Switch
                  value={enabled}
                  thumbColor={enabled ? REEF_DOCS_BLUE : BLACK}
                  onChange={handleSelect}
                />
              </Grid>
            </GridItem>
          </Grid>
          <Grid direction="row" gap={16}>
            {applicableUnits?.length > 0 && (
              <GridItem flex={1}>
                <Select
                  options={applicableUnits || []}
                  labelKey="name"
                  valueKey="id"
                  title="Unit"
                  label="Unit"
                  value={value?.unitId}
                  onConfirm={(chosenValue) =>
                    setValue(`${item?.id}.unitId`, chosenValue)
                  }
                />
              </GridItem>
            )}
          </Grid>

          <Grid direction="column" gap={16} key={item?.id}>
            <GridItem flex={1}>
              <TextInput
                control={control}
                name={`[${item.id}].rangeLow`}
                label="Low Range"
                keyboardType="numeric"
                transformFn={(value) => value.replace(",", ".")}
              />
            </GridItem>
            <GridItem flex={1}>
              <TextInput
                control={control}
                name={`[${item.id}].target`}
                label="Target"
                keyboardType="numeric"
                transformFn={(value) => value.replace(",", ".")}
              />
            </GridItem>
            <GridItem flex={1}>
              <TextInput
                control={control}
                name={`[${item.id}].rangeHigh`}
                label="High Range"
                keyboardType="numeric"
                transformFn={(value) => value.replace(",", ".")}
              />
            </GridItem>
            {/* {canDose && (
              <>
                <GridItem flex={1}>
                  <Text weight="bold">Dosing</Text>

                  <GridItem flex={1}>
                    <Grid direction="row" alignItems="center" gap={8}>
                      <Text>Enabled</Text>
                      <Switch
                        value={value?.dosingEnabled}
                        thumbColor={
                          value?.dosingEnabled ? REEF_DOCS_BLUE : BLACK
                        }
                        onChange={(e) =>
                          setValue(
                            `${item?.id}.dosingEnabled`,
                            e.nativeEvent.value
                          )
                        }
                      />
                    </Grid>
                  </GridItem>
                  {value?.dosingEnabled && (
                    <GridItem flex={1}>
                      <Grid direction="row" alignItems="center" gap={8}>
                        <Text>Auto Calculate</Text>
                        <Switch
                          value={value?.autoCalculate}
                          thumbColor={
                            value?.autoCalculate ? REEF_DOCS_BLUE : BLACK
                          }
                          onChange={(e) =>
                            setValue(
                              `${item?.id}.autoCalculate`,
                              e.nativeEvent.value
                            )
                          }
                        />
                      </Grid>
                      <Text style={{ marginBottom: 8 }}>
                        If your dosing manufacturer provides guidelines for
                        dosing, we can attempt to auto calculate your dosages.
                        If not please leave auto calculate off.
                      </Text>
                    </GridItem>
                  )}

                  {value?.dosingEnabled && value?.autoCalculate && (
                    <Text weight="bold">
                      Please enter as per the manufacturers example. e.g 20ml of
                      X increases X in 100 Litres by X
                    </Text>
                  )}
                </GridItem>
                {value?.dosingEnabled && value?.autoCalculate && (
                  <>
                    <Grid direction="row" gap={16}>
                      <GridItem flex={1}>
                        <TextInput
                          control={control}
                          name={`[${item.id}].dosingAmount`}
                          label="Product Amount"
                          keyboardType="numeric"
                          placeholder="e.g 20"
                        />
                      </GridItem>
                      <GridItem flex={1}>
                        <Select
                          hasError={
                            errors?.[`${item.id}`]?.dosingAmountUnit?.message
                          }
                          options={[
                            {
                              label: "Millilitres (ml)",
                              value: "ml",
                            },
                            {
                              label: "Grams (g)",
                              value: "grams",
                            },
                          ]}
                          labelKey="label"
                          valueKey="value"
                          title="Dosing Unit"
                          label="Unit ( Required )"
                          value={value?.dosingAmountUnit}
                          onConfirm={(chosenValue) =>
                            setValue(
                              `${item?.id}.dosingAmountUnit`,
                              chosenValue
                            )
                          }
                        />
                      </GridItem>
                    </Grid>
                    <GridItem flex={1}>
                      <TextInput
                        control={control}
                        name={`[${item.id}].dosingExampleVolume`}
                        label="Increases X"
                        keyboardType="numeric"
                        placeholder="e.g 100"
                        unitLabel="Litres"
                      />
                    </GridItem>
                    <GridItem flex={1}>
                      <TextInput
                        control={control}
                        name={`[${item.id}].dosingConcentrationIncreaseAmount`}
                        label="By X"
                        keyboardType="numeric"
                        placeholder="e.g 20"
                        unitLabel={isAlk ? "dKH" : "ppm / mg/L"}
                      />
                    </GridItem>
                    <GridItem flex={1}>
                      <TextInput
                        control={control}
                        name={`[${item.id}].maxDailyDosage`}
                        label="Max Daily Increase"
                        keyboardType="numeric"
                        placeholder="Increase per day"
                        unitLabel={isAlk ? "dKH" : "ppm / mg/L"}
                      />
                    </GridItem>
                  </>
                )}
              </>
            )} */}
          </Grid>
        </Grid>
      </Grid>
    </ModalComposition>
  );
};
