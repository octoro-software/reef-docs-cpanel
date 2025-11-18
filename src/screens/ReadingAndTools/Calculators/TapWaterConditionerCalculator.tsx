import React, { useState } from "react";
import { Grid, Heading, Text } from "../../../components";
import { useTankList } from "../../../hooks/useTanks";
import { DosageTable } from "../Components/DosageTable";
import { View } from "react-native";
import { CalculatorConfigSetup } from "../Components/CalculatorConfigSetup";
import { CalculatorDisclaimer } from "../Components/CalculatorDisclaimer";

export const TapWaterConditionerCalculator = () => {
  const tanks = useTankList();

  const [calculatorConfig, setCalculatorConfig] = useState({
    productConfig: {
      overdose: [],
      baseDoseMl: null,
      dosePerLitre: null,
      doseNotes: "",
      doseFrequency: "",
    },
    tankConfig: {
      litres: null,
      name: "",
      id: null,
    },
    rounding: "none",
  });

  const handleProductSelect = (pid) => {
    const product = products?.find((p) => p.id === pid);
    setCalculatorConfig((prev) => ({
      ...prev,
      productConfig: product,
    }));
  };

  const handleTankSelect = (pid) => {
    const tank = tanks?.find((t) => t.id === pid);
    setCalculatorConfig((prev) => ({
      ...prev,
      tankConfig: {
        litres: tank?.litres,
        name: tank?.name,
        id: tank?.id,
        usGallons: tank?.usGallons,
        imperialGallons: tank?.imperialGallons,
      },
    }));
  };

  const handleChangeRounding = (value) => {
    setCalculatorConfig((prev) => ({
      ...prev,
      rounding: value,
    }));
  };

  const products = [
    {
      label: "Fritz Complete Water Conditioner",
      baseDoseMl: 5,
      dosePerLitre: 189,
      dosageInstructions:
        "For extremely high levels of chloramine or nitrite, dosage can be repeated or increased up to 5x within a 24-hour period",
      overdose: [
        {
          maxOverdosePeriodHours: 24,
          multiplier: 2,
          dosageInstructions:
            "For extremely high levels of chloramine or nitrite, dosage can be repeated or increased up to 5x within a 24-hour period",
        },
        {
          maxOverdosePeriodHours: 24,
          multiplier: 3,
        },
        {
          maxOverdosePeriodHours: 24,
          multiplier: 4,
        },
        {
          maxOverdosePeriodHours: 24,
          multiplier: 5,
        },
      ],
      id: 1,
    },
    {
      label: "Seachem Prime Dechlorinator",
      baseDoseMl: 5,
      dosePerLitre: 200,
      id: 2,
      overdose: [
        {
          description:
            "In cases of exceptionally high chloramine concentrations, a double dose can be used safely",
          multiplier: 2,
          maxOverdosePeriodHours: null,
        },
        {
          description:
            "For emergency detoxification of nitrite, up to 5 times the normal dose may be applied",
          multiplier: 3,
          maxOverdosePeriodHours: null,
        },
        {
          description:
            "For emergency detoxification of nitrite, up to 5 times the normal dose may be applied",
          multiplier: 4,
          maxOverdosePeriodHours: null,
        },
        {
          description:
            "For emergency detoxification of nitrite, up to 5 times the normal dose may be applied",
          multiplier: 5,
          maxOverdosePeriodHours: null,
        },
      ],
      overdoseWarnings:
        "If the temperature exceeds 30 °C (86 °F) and chlorine or ammonia levels are low, a half dose is advisable.",
    },
    {
      label: "API Stress Coat Tap Water Conditioner",
      baseDoseMl: 5,
      dosePerLitre: 38,
      overdose: [
        {
          description:
            "To replace the slime coat and repair damaged skin and fins, double the dose",
          multiplier: 2,
          maxOverdosePeriodHours: null,
        },
      ],
      id: 3,
    },
    {
      label: "Easy-Life Aquamaker Tap Water Conditioner",
      baseDoseMl: 10,
      dosePerLitre: 50,
      overdose: [
        {
          description:
            "Higher concentrations of chlorine, chloramine or ammonia.",
          multiplier: 2,
          maxOverdosePeriodHours: null,
        },
        {
          description: "Very high nitrite or ammonia.",
          multiplier: 3,
          maxOverdosePeriodHours: null,
        },
      ],
      id: 4,
      overdoseWarnings:
        "If the temperature exceeds 30 °C (86 °F) and chlorine or ammonia levels are low, a half dose is advisable.",
    },
    {
      label: "API Aqua Essential Tap Water Conditioner - (Treating Tap Water)",
      baseDoseMl: 5,
      dosePerLitre: 189,
      overdose: [],
      id: 5,
    },
    {
      label:
        "API Aqua Essential Tap Water Conditioner - (Treating Tap Ammonia, Nitrite or Nitrate)",
      baseDoseMl: 5,
      dosePerLitre: 38,
      overdose: [],
      doseNotes: "Wait 24 hours before performing a water change.",
      id: 11,
    },
    {
      label: "Tetra Aquasafe Tap Water Conditioner",
      baseDoseMl: 5,
      dosePerLitre: 10,
      overdose: [],
      id: 6,
    },
    {
      label: "Tetra Aqua Easy Balance Freshwater Conditioner",
      baseDoseMl: 2.5,
      dosePerLitre: 10,
      overdose: [],
      doseNotes:
        "it remains important to perform a thorough water change with treated tap water at least biannually and to keep the substrate clean through occasional gravel siphoning",
      id: 7,
      doseFrequency: "Weekly",
    },
  ];

  const {
    ml: doseMl,
    oz: doseOz,
    caps: doseCaps,
    litres: doseLitres,
  } = calculateDosage(
    calculatorConfig?.productConfig?.baseDoseMl,
    calculatorConfig?.productConfig?.dosePerLitre,
    calculatorConfig?.tankConfig?.litres,
    1,
    calculatorConfig?.rounding
  );

  return (
    <Grid direction="column" gap={8}>
      <CalculatorConfigSetup
        title="Tap Water Conditioner Calculator"
        products={products}
        handleProductSelect={handleProductSelect}
        handleTankSelect={handleTankSelect}
        tanks={tanks}
        handleChangeRounding={handleChangeRounding}
        rounding={calculatorConfig?.rounding}
        calculatorConfig={calculatorConfig}
        setCalculatorConfig={setCalculatorConfig}
      />

      <Heading variant={5} weight="semiBold" style={{ marginTop: 8 }}>
        Dosage Instructions
      </Heading>

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

      <DosageTable
        doseCaps={doseCaps}
        doseLitres={doseLitres}
        doseMl={doseMl}
        doseOz={doseOz}
      />

      {calculatorConfig?.productConfig?.overdose?.length > 0 &&
        calculatorConfig?.productConfig?.overdose.map((overDose, index) => {
          const {
            ml: doseMl,
            oz: doseOz,
            caps: doseCaps,
            litres: doseLitres,
          } = calculateDosage(
            calculatorConfig?.productConfig?.baseDoseMl,
            calculatorConfig?.productConfig?.dosePerLitre,
            calculatorConfig?.tankConfig?.litres,
            overDose?.multiplier,
            calculatorConfig?.rounding
          );

          return (
            <View key={index}>
              <Heading variant={5} weight="semiBold">
                Over Dosage Instructions {overDose?.multiplier}x
              </Heading>

              {overDose?.description && (
                <Text style={{ marginBottom: 8 }}>{overDose?.description}</Text>
              )}

              <DosageTable
                doseCaps={doseCaps}
                doseLitres={doseLitres}
                doseMl={doseMl}
                doseOz={doseOz}
                dosageInstructions={
                  calculatorConfig?.productConfig?.dosageInstructions
                }
              />
            </View>
          );
        })}
      <CalculatorDisclaimer />
    </Grid>
  );
};

const calculateDosage = (
  doseMultiplier,
  dosePerLitre,
  tankLitres,
  multiplier = 1,
  rounding = "none"
) => {
  if (!tankLitres || !dosePerLitre || !doseMultiplier) {
    return {
      ml: null,
      litres: null,
      oz: null,
      caps: null,
    };
  }

  const m = tankLitres / dosePerLitre;
  const ml = m * doseMultiplier * multiplier;
  const litres = ml / 1000;
  const oz = litres * 33.814;
  const caps = ml / doseMultiplier;

  let mlFormatted, litresFormatted, ozFormatted, capsFormatted;

  if (rounding === "up") {
    mlFormatted = Math.ceil(ml).toString();
    litresFormatted = Math.ceil(litres).toString();
    ozFormatted = Math.ceil(oz).toString();
    capsFormatted = Math.ceil(caps).toString();
  } else if (rounding === "down") {
    mlFormatted = Math.floor(ml).toString();
    litresFormatted = Math.floor(litres).toString();
    ozFormatted = Math.floor(oz).toString();
    capsFormatted = Math.floor(caps).toString();
  } else {
    mlFormatted = ml?.toFixed(2);
    litresFormatted = litres?.toFixed(2);
    ozFormatted = oz?.toFixed(2);
    capsFormatted = Math.ceil(caps).toString();
  }

  return {
    ml: mlFormatted,
    litres: litresFormatted,
    oz: ozFormatted,
    caps: capsFormatted,
  };
};
