import React, { useState } from "react";
import { View } from "react-native";

import {
  Button,
  DateSelect,
  Grid,
  Heading,
  Select,
  Text,
} from "../../../components";
import { ScheduleTable } from "../Components/ScheduleTable";

import { useTankList } from "../../../hooks/useTanks";
import { useCreateTask } from "../../../hooks/useTankTasks";
import { CalculatorConfigSetup } from "../Components/CalculatorConfigSetup";
import { CalculatorDisclaimer } from "../Components/CalculatorDisclaimer";

export const MedicationsCalculator = () => {
  const tanks = useTankList();

  const [openTaskDatePicker, setOpenTaskDatePicker] = useState(false);

  const [createTask] = useCreateTask();

  const [taskCreateLoading, setTaskCreateLoading] = useState(false);

  const [taskCreateSuccess, setTaskCreateSuccess] = useState(false);

  const [stage2, setStage2] = useState(false);

  const [calculatorConfig, setCalculatorConfig] = useState({
    productConfig: {
      overdose: [],
      baseDoseMl: null,
      dosePerLitre: null,
      doseNotes: "",
      doseFrequency: "",
      twoStepDose: false,
      twoStepDoseSplitDay: null,
      dropModifier: null,
      schedule: [],
      id: null,
      label: "",
    },
    tankConfig: {
      litres: null,
      name: "",
      id: null,
    },
    rounding: "up",
  });

  const handleProductSelect = (pid) => {
    const product = products?.find((p) => p.id === pid);
    setCalculatorConfig((prev) => ({
      ...prev,
      productConfig: product,
    }));

    if (taskCreateSuccess) {
      setTaskCreateSuccess(false);
    }

    if (stage2) {
      setStage2(false);
    }
  };

  const handleTankSelect = (pid, taskOnly = false) => {
    const tank = tanks?.find((t) => t.id === pid);
    setCalculatorConfig((prev) => ({
      ...prev,
      tankConfig: {
        litres: taskOnly ? prev?.tankConfig?.litres : tank?.litres,
        name: tank?.name,
        id: tank?.id,
        usGallons: tank?.usGallons,
        imperialGallons: tank?.imperialGallons,
        taskOnly,
      },
    }));
    if (taskCreateSuccess) {
      setTaskCreateSuccess(false);
    }
    if (stage2) {
      setStage2(false);
    }
  };

  const handleCreateTask = async (date) => {
    const startingDate = new Date(date);

    setTaskCreateLoading(true);

    const preFilter = stage2
      ? scheduleDosage // all tasks for both stages
      : calculatorConfig?.productConfig?.twoStepDose
        ? scheduleDosage?.filter(
            (dose) =>
              dose?.day <= calculatorConfig?.productConfig?.twoStepDoseSplitDay
          )
        : scheduleDosage;

    const taskData = preFilter
      ?.filter((r) => !r?.title && r?.restDay !== true)
      .map((dose) => {
        // Clone startingDate for each dose
        let date = new Date(startingDate);
        if (dose?.day !== 1) {
          date.setDate(date.getDate() + dose?.day - 1);
        }

        return {
          name: `Dose ${calculatorConfig?.productConfig?.label}`,
          description:
            dose?.drops > 0
              ? `Dose ${dose?.drops} drops / ${dose?.ml} ml of ${calculatorConfig?.productConfig?.label} medication.`
              : dose?.specialInstructions,
          repeat: false,
          tankId: calculatorConfig?.tankConfig?.id,
          date,
        };
      });

    const promises = taskData?.map((task) => createTask(task));

    await Promise.all(promises).then(() => {
      setTaskCreateLoading(false);
      setTaskCreateSuccess(true);
    });

    setStage2(false);
  };

  const products = [
    {
      type: "schedule",
      label: "eSHa Exit",
      baseDoseMl: null,
      dosePerLitre: 100,
      schedule: [
        {
          day: 1,
          drops: 20,
        },
        {
          day: 2,
          drops: 10,
        },
        {
          day: 3,
          drops: 10,
        },
      ],

      id: 1,
    },
    {
      type: "schedule",
      label: "eSHa Hexamita",
      baseDoseMl: null,
      dosePerLitre: 100,
      schedule: [
        {
          day: 1,
          drops: 25,
        },
        {
          day: 2,
          drops: 12,
        },
        {
          day: 3,
          drops: 12,
        },
      ],
      id: 2,
    },
    {
      type: "schedule",
      label: "eSHa 2000",
      baseDoseMl: null,
      dosePerLitre: 100,
      schedule: [
        {
          day: 1,
          drops: 25,
        },
        {
          day: 2,
          drops: 12,
        },
        {
          day: 3,
          drops: 12,
        },
      ],
      id: 3,
    },
    {
      type: "schedule",
      label: "eSHa Gastropex",
      baseDoseMl: null,
      dosePerLitre: 100,
      schedule: [
        {
          day: 1,
          drops: 20,
        },
        {
          day: 2,
          drops: 10,
        },
        {
          day: 3,
          drops: 10,
        },
      ],
      id: 4,
    },
    {
      type: "schedule",
      label: "eSHa Gastrobac",
      baseDoseMl: null,
      dosePerLitre: 100,
      schedule: [
        {
          day: 1,
          drops: 20,
        },
        {
          day: 2,
          drops: 10,
        },
        {
          day: 3,
          drops: 10,
        },
      ],
      id: 5,
    },
    {
      type: "schedule",
      label: "eSHa Gastrobel",
      baseDoseMl: null,
      dosePerLitre: 100,
      schedule: [
        {
          day: 1,
          drops: 20,
        },
        {
          day: 2,
          drops: 10,
        },
        {
          day: 3,
          drops: 10,
        },
      ],
      id: 6,
    },
    {
      type: "schedule",
      label: "eSHa 202",
      baseDoseMl: null,
      dosePerLitre: 100,
      schedule: [
        {
          day: 1,
          drops: 25,
        },
        {
          day: 2,
          drops: 12,
        },
        {
          day: 3,
          drops: 12,
        },
      ],
      id: 8,
    },
    {
      type: "schedule",
      label: "eSHa gdex",
      baseDoseMl: null,
      dosePerLitre: 100,
      twoStepDose: true,
      twoStepDoseSplitDay: 5,
      dropModifier: 3.2,
      schedule: [
        {
          day: 1,
          drops: 100,
        },
        {
          day: 2,
          drops: 50,
        },
        {
          day: 3,
          drops: 50,
        },
        {
          day: 4,
          drops: 0,
          specialInstructions: "Rest day",
          restDay: true,
        },
        {
          day: 5,
          drops: 0,
          specialInstructions: "Perform a 20% - 50% water change",
        },
        {
          title:
            "In addition to the standard dose, When treating tapeworms ( Cestoda ) or persitent monogenea.",
        },
        {
          day: 8,
          drops: 100,
          specialInstructions: "Perform a 20% - 50% water change",
        },
        {
          day: 9,
          drops: 50,
          specialInstructions: "Perform a 20% - 50% water change",
        },
        {
          day: 10,
          drops: 50,
          specialInstructions: "Perform a 20% - 50% water change",
        },
        {
          day: 11,
          drops: 0,
          specialInstructions: "Rest day",
          restDay: true,
        },
        {
          day: 12,
          drops: 0,
          specialInstructions: "Perform a 20% - 50% water change",
        },
      ],
      id: 9,
    },
    {
      type: "schedule",
      label: "eSHa -ndx",
      baseDoseMl: null,
      dosePerLitre: 1,
      dropModifier: 4.4,
      schedule: [
        {
          day: 1,
          drops: 1,
        },
        {
          day: 2,
          drops: 0,
          specialInstructions: "50% water change",
        },
      ],
      id: 10,
    },
  ];

  const scheduleDosage = calculateScheduleDosage(
    calculatorConfig?.productConfig?.schedule,
    calculatorConfig?.productConfig?.dosePerLitre,
    calculatorConfig?.tankConfig?.litres
      ? calculatorConfig.tankConfig.litres.toFixed(0)
      : 0,
    calculatorConfig?.rounding,
    calculatorConfig
  );

  const showCalculator =
    calculatorConfig?.tankConfig?.litres && calculatorConfig?.productConfig?.id;

  const manualFlow = calculatorConfig?.tankConfig?.taskOnly ? true : false;

  return (
    <Grid direction="column" gap={8}>
      <CalculatorConfigSetup
        title="Medication Calculator"
        products={products}
        handleProductSelect={handleProductSelect}
        handleTankSelect={handleTankSelect}
        tanks={tanks}
        calculatorConfig={calculatorConfig}
        setCalculatorConfig={setCalculatorConfig}
      />

      <Grid
        direction={
          calculatorConfig?.productConfig?.twoStepDose
            ? "column"
            : manualFlow
              ? "column"
              : "row"
        }
        justifyContent="space-between"
        style={{ marginTop: 8 }}
        alignItems="center"
      >
        <Heading variant={5} weight="semiBold">
          Dosage Instructions
        </Heading>

        {showCalculator && (
          <View
            style={{
              position: "relative",
              flexDirection: manualFlow ? "column" : "row",
              gap: 8,
              width: manualFlow ? "100%" : "auto",
            }}
          >
            {manualFlow && (
              <Select
                options={tanks}
                title={"Tank"}
                labelKey="name"
                valueKey={"id"}
                onConfirm={(id) => handleTankSelect(id, true)}
                placeholder="Please select a tank to assign tasks to"
              />
            )}

            <Button
              title={
                taskCreateSuccess
                  ? "Tasks Created"
                  : calculatorConfig?.productConfig?.twoStepDose
                    ? "Create Stage 1 Tasks"
                    : "Create Tasks"
              }
              onPress={() => setOpenTaskDatePicker(true)}
              variant={
                !calculatorConfig?.tankConfig?.id
                  ? "grey"
                  : taskCreateSuccess
                    ? "success"
                    : "secondary"
              }
              isLoading={taskCreateLoading}
              disabled={taskCreateSuccess || !calculatorConfig?.tankConfig?.id}
            />
            {calculatorConfig?.productConfig?.twoStepDose &&
              !taskCreateSuccess && (
                <Button
                  title={
                    taskCreateSuccess
                      ? "Tasks Created"
                      : "Create Stage 1 & 2 Tasks"
                  }
                  onPress={() => {
                    setOpenTaskDatePicker(true);
                    setStage2(true);
                  }}
                  variant={
                    !calculatorConfig?.tankConfig?.id
                      ? "grey"
                      : taskCreateSuccess
                        ? "success"
                        : "secondary"
                  }
                  isLoading={taskCreateLoading}
                  disabled={
                    taskCreateSuccess || !calculatorConfig?.tankConfig?.id
                  }
                />
              )}
            <DateSelect
              hideInput
              dateModalTitle="Select Starting Task Date"
              openSelector={openTaskDatePicker}
              onClose={() => {
                setOpenTaskDatePicker(false);
                setStage2(false);
              }}
              onConfirm={(date) => {
                handleCreateTask(date);
                setOpenTaskDatePicker(false);
              }}
            />
          </View>
        )}
      </Grid>

      {!showCalculator && (
        <View>
          <Text>Please select a tank and product.</Text>
        </View>
      )}

      {showCalculator && (
        <>
          <Text>
            If you have an abnormal aquarium with a good amount of water
            displacement due to large rocks, stones, wood or other decor
            material. You should decrease the dosage. If you have an oversized
            filter you should increase the dosage.
          </Text>

          <Text>
            * Tank Volume is rounded to the nearest whole number in the
            medication calculator.
          </Text>

          {calculatorConfig?.productConfig?.doseNotes && (
            <Text style={{ marginBottom: 8 }}>
              {calculatorConfig?.productConfig?.doseNotes}
            </Text>
          )}
          {calculatorConfig?.productConfig?.doseFrequency && (
            <Grid direction="row">
              <Text style={{ marginBottom: 8 }}>Dose Frequency: </Text>
              <Text style={{ marginBottom: 8, fontWeight: "bold" }}>
                {calculatorConfig?.productConfig?.doseFrequency}
              </Text>
            </Grid>
          )}

          {scheduleDosage?.length > 0 &&
            scheduleDosage?.map((schedule, index) => {
              if (schedule?.title) {
                return (
                  <Text key={index} style={{ marginBottom: 8, marginTop: 8 }}>
                    {schedule?.title}
                  </Text>
                );
              }

              return (
                <View key={index}>
                  <Heading variant={5} weight="semiBold">
                    Day {schedule?.day}:
                  </Heading>

                  {schedule?.specialInstructions && (
                    <Text style={{ marginBottom: 4 }}>
                      {schedule?.specialInstructions}
                    </Text>
                  )}

                  <ScheduleTable
                    doseDrops={schedule?.drops}
                    doseMl={schedule?.ml}
                  />
                </View>
              );
            })}
        </>
      )}

      <CalculatorDisclaimer />
    </Grid>
  );
};

const calculateScheduleDosage = (
  schedule,
  dosePerLitre,
  tankLitres,
  rounding = "none",
  calculatorConfig
) => {
  return schedule?.map((dose) => {
    // Calculate multiplier for tank size
    const multiplier = tankLitres / dosePerLitre;
    let drops = dose.drops * multiplier;
    // Use dropModifier from productConfig if present, else default to 20 drops per ml
    const dropModifier =
      typeof calculatorConfig?.productConfig?.dropModifier === "number"
        ? calculatorConfig.productConfig.dropModifier
        : 5;
    let ml = dropModifier ? (drops / 100) * dropModifier : drops / dropModifier;
    ml = Number(ml.toFixed(2));

    if (rounding === "up") {
      drops = Math.ceil(drops);
    } else if (rounding === "down") {
      drops = Math.floor(drops);
    } else {
      drops = Number(drops.toFixed(2));
    }

    return {
      day: dose.day,
      drops,
      ml,
      specialInstructions: dose?.specialInstructions,
      title: dose?.title,
    };
  });
};
