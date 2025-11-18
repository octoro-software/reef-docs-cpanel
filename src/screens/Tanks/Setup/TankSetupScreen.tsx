import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import apiClient from "../../../api/apiClient";

import {
  useGetActiveTank,
  useUpdateTankEquipment,
} from "../../../hooks/useTanks";

import {
  Button,
  DateSelect,
  Grid,
  GridItem,
  Heading,
  Select,
  Text,
  TextInput,
} from "../../../components";

import { UserPostCardScreenHeader } from "../../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";

import { WHITE } from "../../../constants";
import { useAudience } from "../../../hooks/useAudience";

const getConfigurationOptions = (data, type) => {
  if (!data) {
    return [];
  }

  const opt = data
    ?.filter((i) => i?.definition === type)
    ?.map((i) => ({
      id: i.id,
      label: i.name,
      definition: i.definition,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  opt.push({
    id: "other",
    label: "Other",
    definition: "other",
  });

  return opt;
};

export const TankSetupScreen: React.FC = () => {
  const { isReef, isFresh } = useAudience();

  const [updateTank, loading, error, suuccess] = useUpdateTankEquipment();

  const [data, setData] = React.useState(null);

  const getConfig = async () => {
    const response = await apiClient.get("structuredConfiguration/equipment");

    setData(response?.data?.data);
  };

  useEffect(() => {
    getConfig();
  }, []);

  const tank = useGetActiveTank();

  const setupDate = tank?.setupDate;

  const { control, setValue, getValues, reset } = useForm({
    defaultValues: {
      lights: [],
      environment: {
        substrate: {},
        rock: {},
        rockWeight: "",
      },
    },
  });

  useEffect(() => {
    if (tank && tank?.equipment) {
      reset(tank?.equipment);
    }
  }, [tank]);

  const lightOptions = getConfigurationOptions(data, "tank_lighting");

  const substrate = getConfigurationOptions(data, "tank_substrate");
  const rock = getConfigurationOptions(data, "tank_rock");

  const flowOptions = getConfigurationOptions(data, "tank_pump");
  const reactorOptions = getConfigurationOptions(data, "tank_reactor");
  const uvOptions = getConfigurationOptions(data, "tank_uv");
  const dosingOptions = getConfigurationOptions(data, "tank_dosing_pump");
  const atoOptions = getConfigurationOptions(data, "tank_ato");
  const coolerOptions = getConfigurationOptions(data, "tank_cooler");
  const heaterOptions = getConfigurationOptions(data, "tank_heater");
  const filterOptions = getConfigurationOptions(data, "tank_filter");
  const skimmerOptions = getConfigurationOptions(data, "tank_protein_skimmer");

  const co2Options = getConfigurationOptions(data, "tank_co2");

  const handleRootValueSelectChange = (group, name, value, options) => {
    const option = options.find((o) => o.id === value);

    setValue(`${group}.${name}.optionId`, option?.id);
    setValue(`${group}.${name}.optionName`, option?.label);
    setValue(`${group}.${name}.optionDefinition`, option?.definition);
    setValue(`${group}.${name}.customOptionName`, null);
  };

  const handleSubmit = async () => {
    const values = await getValues();

    await updateTank(values, tank?.id);
  };

  return (
    <View style={{ marginBottom: 80 }}>
      <UserPostCardScreenHeader title="Setup" icon="reefDocsFish" />

      <Text style={{ marginTop: 16 }}>
        Setting up your tank is important, we can determine how changes in
        equipment corelate to your parameters. When asking questions in the
        social media platform, you can share this information with others to
        allow for better assistance.
      </Text>

      <Grid gap={16} style={styles.container}>
        <Grid style={styles.section} gap={8}>
          <GridItem>
            <Heading variant={5} weight="semiBold">
              Environment
            </Heading>
          </GridItem>
          <GridItem>
            <Select
              title="Substrate"
              label="Substrate"
              options={substrate}
              labelKey="label"
              valueKey="id"
              value={getValues("environment.substrate.optionId")}
              onConfirm={(v) =>
                handleRootValueSelectChange(
                  "environment",
                  "substrate",
                  v,
                  substrate
                )
              }
            />
          </GridItem>
          <GridItem>
            <Select
              title="Rock"
              label="Rock"
              options={rock}
              labelKey="label"
              valueKey="id"
              value={getValues("environment.rock.optionId")}
              onConfirm={(v) =>
                handleRootValueSelectChange("environment", "rock", v, rock)
              }
            />
          </GridItem>
          <GridItem>
            <TextInput
              label="Rock Amount ( Estimate ) KG"
              control={control}
              name="rockWeight"
              keyboardType="numeric"
              onChange={(e) => setValue("environment.rockWeight", e)}
              transformFn={(value) => value.replace(",", ".")}
            />
          </GridItem>
        </Grid>

        <Grid style={styles.section}>
          <GridItem>
            <Heading variant={5} weight="semiBold">
              Lighting
            </Heading>
          </GridItem>
          <MultipleOptions
            name="lights"
            control={control}
            fieldLabel="Light"
            fieldOptions={lightOptions}
            setupDate={setupDate}
            setValue={setValue}
          />
        </Grid>

        {isReef && (
          <Grid style={styles.section}>
            <GridItem>
              <Heading variant={5} weight="semiBold">
                Flow
              </Heading>
            </GridItem>
            <MultipleOptions
              name="pumps"
              control={control}
              setupDate={setupDate}
              fieldLabel="Pump"
              setValue={setValue}
              fieldOptions={flowOptions}
            />
          </Grid>
        )}

        <Grid style={styles.section}>
          <GridItem>
            <Heading variant={5} weight="semiBold">
              Heaters
            </Heading>
          </GridItem>
          <MultipleOptions
            name="heaters"
            control={control}
            fieldLabel="Heater"
            setupDate={setupDate}
            setValue={setValue}
            fieldOptions={heaterOptions}
          />
        </Grid>
        {isReef && (
          <Grid style={styles.section}>
            <GridItem>
              <Heading variant={5} weight="semiBold">
                Chiller
              </Heading>
            </GridItem>
            <MultipleOptions
              name="chiller"
              control={control}
              setupDate={setupDate}
              fieldLabel="Chiller"
              setValue={setValue}
              fieldOptions={coolerOptions}
            />
          </Grid>
        )}

        {isReef && (
          <Grid style={styles.section}>
            <GridItem>
              <Heading variant={5} weight="semiBold">
                Reactors
              </Heading>
            </GridItem>
            <MultipleOptions
              name="reactors"
              control={control}
              fieldLabel="Reactor"
              setupDate={setupDate}
              setValue={setValue}
              fieldOptions={reactorOptions}
            />
          </Grid>
        )}

        {isReef && (
          <Grid style={styles.section}>
            <GridItem>
              <Heading variant={5} weight="semiBold">
                Filter Sock / Roller
              </Heading>
            </GridItem>
            <MultipleOptions
              name="filterSockOrRoller"
              control={control}
              fieldLabel="Filter"
              setupDate={setupDate}
              setValue={setValue}
              fieldOptions={filterOptions}
            />
          </Grid>
        )}

        {isReef && (
          <Grid style={styles.section}>
            <GridItem>
              <Heading variant={5} weight="semiBold">
                UV Sterilizer
              </Heading>
            </GridItem>
            <MultipleOptions
              name="uvSterilizer"
              control={control}
              fieldLabel="UV Sterilizer"
              setupDate={setupDate}
              setValue={setValue}
              fieldOptions={uvOptions}
            />
          </Grid>
        )}

        {isReef && (
          <Grid style={styles.section}>
            <GridItem>
              <Heading variant={5} weight="semiBold">
                Dosing Pump
              </Heading>
            </GridItem>
            <MultipleOptions
              name="dosingPump"
              control={control}
              fieldLabel="Dosing Pump"
              setupDate={setupDate}
              fieldOptions={dosingOptions}
              setValue={setValue}
            />
          </Grid>
        )}

        {isReef && (
          <Grid style={styles.section}>
            <GridItem>
              <Heading variant={5} weight="semiBold">
                Skimmer
              </Heading>
            </GridItem>
            <MultipleOptions
              setValue={setValue}
              name="skimmer"
              control={control}
              fieldLabel="Skimmer"
              setupDate={setupDate}
              fieldOptions={skimmerOptions}
            />
          </Grid>
        )}

        {isFresh && (
          <Grid style={styles.section}>
            <GridItem>
              <Heading variant={5} weight="semiBold">
                Filter
              </Heading>
            </GridItem>
            <MultipleOptions
              name="filter"
              control={control}
              fieldLabel="Filter"
              setupDate={setupDate}
              fieldOptions={filterOptions}
              setValue={setValue}
            />
          </Grid>
        )}
        {isFresh && (
          <Grid style={styles.section}>
            <GridItem>
              <Heading variant={5} weight="semiBold">
                Co2
              </Heading>
            </GridItem>
            <MultipleOptions
              name="co2"
              control={control}
              fieldLabel="Co2"
              setupDate={setupDate}
              fieldOptions={co2Options}
              setValue={setValue}
            />
          </Grid>
        )}

        <Grid style={styles.section}>
          <GridItem>
            <Heading variant={5} weight="semiBold">
              Auto Top Off
            </Heading>
          </GridItem>
          <MultipleOptions
            name="ato"
            control={control}
            fieldLabel="Auto Top Off"
            setValue={setValue}
            fieldOptions={atoOptions}
            setupDate={setupDate}
          />
        </Grid>

        <Button onPress={handleSubmit} title="Update" isLoading={loading} />
      </Grid>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  section: {
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 8,
  },
});

const MultipleOptions = ({
  control,
  name,
  fieldLabel,
  fieldOptions = [],
  setupDate,
  setValue,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const watchedFields = useWatch({
    control,
    name,
  });

  const handleOptionChange = (v, index) => {
    const option = fieldOptions.find((o) => o.id === v);

    setValue(`${name}.${index}.optionId`, option?.id || v);
    setValue(`${name}.${index}.optionName`, option?.label);
    setValue(`${name}.${index}.optionDefinition`, option?.definition);
    setValue(`${name}.${index}.customOptionName`, null);
  };

  return (
    <View>
      {fields.map((field, index) => {
        const current = watchedFields?.[index] || {};
        return (
          <Grid
            direction="column"
            key={field.id}
            gap={8}
            style={{ marginTop: 8 }}
          >
            <GridItem flex={1}>
              <Select
                label={fieldLabel}
                options={fieldOptions}
                title={fieldLabel}
                labelKey="label"
                valueKey="id"
                value={current.optionId}
                onConfirm={(e) => handleOptionChange(e, index)}
              />
            </GridItem>
            <GridItem flex={1}>
              <DateSelect
                label="Date Added"
                value={current.date}
                onChange={(date) => setValue(`${name}.${index}.date`, date)}
              />
            </GridItem>

            {current?.optionDefinition === "other" && (
              <GridItem>
                <TextInput
                  label="Please Specify"
                  control={control}
                  name={`${name}.${index}.customOptionName`}
                />
              </GridItem>
            )}

            <GridItem>
              <Button
                title="Remove"
                onPress={() => remove(index)}
                variant="delete"
              />
            </GridItem>
          </Grid>
        );
      })}
      <Button
        title="Add"
        onPress={() => {
          const firstOption =
            fieldOptions && fieldOptions.length > 0 ? fieldOptions[0] : null;
          const base = {
            date: setupDate,
            optionId: firstOption?.id,
            optionName: firstOption?.label,
            optionDefinition: firstOption?.definition,
            customOptionName: null,
          };
          const last = watchedFields?.[watchedFields.length - 1];
          append(last ? { ...last, date: setupDate } : base);
        }}
        variant="secondary"
        style={{ marginTop: 16 }}
      />
    </View>
  );
};
