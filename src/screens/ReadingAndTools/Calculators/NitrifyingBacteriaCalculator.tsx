import React, { useState } from "react";
import { Grid, Heading, Text } from "../../../components";
import { useTankList } from "../../../hooks/useTanks";
import { DosageTable } from "../Components/DosageTable";
import { View } from "react-native";
import { CalculatorConfigSetup } from "../Components/CalculatorConfigSetup";
import { CalculatorDisclaimer } from "../Components/CalculatorDisclaimer";
import { Pill } from "../../../components/Pill/Pill";
import { WHITE } from "../../../constants";

export const NitrifyingBacteriaCalculator = () => {
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
      label: "Fritz FritzZyme TurboStart 700",
      baseDoseMl: 29,
      dosePerLitre: 189,
      disableCaps: true,
      overdose: [
        {
          multiplier: 2,
          description:
            "To decrease cycling time, FritzZyme® TurboStart®700 can be safely used up to 5x recommended dosage.",
        },
        {
          multiplier: 3,
          description:
            "To decrease cycling time, FritzZyme® TurboStart®700 can be safely used up to 5x recommended dosage.",
        },
        {
          multiplier: 4,
          description:
            "To decrease cycling time, FritzZyme® TurboStart®700 can be safely used up to 5x recommended dosage.",
        },
        {
          multiplier: 5,
          description:
            "To decrease cycling time, FritzZyme® TurboStart®700 can be safely used up to 5x recommended dosage.",
        },
      ],
      dosageInstructions: ``,
      id: 1,
    },

    {
      label: "Fritz FritzZyme 7 Freshwater Nitrifying Bacteria",
      baseDoseMl: 119,
      dosePerLitre: 38,
      disableCaps: true,
      hasExistingSystemDosage: true,
      overdose: [
        {
          multiplier: 2,
          tag: "New System",
          description:
            "For a large livestock system, new system dosage may be safely increased up to 10x.",
        },
        {
          multiplier: 3,
          tag: "New System",
          description:
            "For a large livestock system, new system dosage may be safely increased up to 10x.",
        },
        {
          multiplier: 4,
          tag: "New System",
          description:
            "For a large livestock system, new system dosage may be safely increased up to 10x.",
        },
        {
          multiplier: 5,
          tag: "New System",
          description:
            "For a large livestock system, new system dosage may be safely increased up to 10x.",
        },
        {
          multiplier: 6,
          tag: "New System",
          description:
            "For a large livestock system, new system dosage may be safely increased up to 10x.",
        },
        {
          multiplier: 7,
          tag: "New System",
          description:
            "For a large livestock system, new system dosage may be safely increased up to 10x.",
        },
        {
          multiplier: 8,
          tag: "New System",
          description:
            "For a large livestock system, new system dosage may be safely increased up to 10x.",
        },
        {
          multiplier: 9,
          tag: "New System",
          description:
            "For a large livestock system, new system dosage may be safely increased up to 10x.",
        },
        {
          multiplier: 10,
          tag: "New System",
          description:
            "For a large livestock system, new system dosage may be safely increased up to 10x.",
        },
      ],
      dosageInstructions: ``,
      id: 2,
    },
    {
      label: "Dr Tims One and Only Freshwater Nitrifying Bacteria",
      baseDoseMl: 10,
      dosePerLitre: 38,
      disableCaps: true,
      overdose: [],
      dosageInstructions: ``,
      id: 3,
    },
    {
      label: "Tetra Safe Start",
      baseDoseMl: 5,
      dosePerLitre: 6,
      disableCaps: true,
      overdose: [],
      dosageInstructions: ``,
      id: 4,
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
        title="Nitrifying Bacteria Calculator"
        products={products}
        handleProductSelect={handleProductSelect}
        handleTankSelect={handleTankSelect}
        tanks={tanks}
        handleChangeRounding={handleChangeRounding}
        rounding={calculatorConfig?.rounding}
        calculatorConfig={calculatorConfig}
        setCalculatorConfig={setCalculatorConfig}
      />

      <Grid direction="row" justifyContent="space-between" alignItems="center">
        <Heading variant={5} weight="semiBold" style={{ marginTop: 8 }}>
          Dosage Instructions
        </Heading>

        {calculatorConfig?.productConfig?.hasExistingSystemDosage && (
          <Pill>
            <Text style={{ color: WHITE }}>{"New System"}</Text>
          </Pill>
        )}
      </Grid>

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
        disableCaps={calculatorConfig?.productConfig?.disableCaps}
        dosageInstructions={calculatorConfig?.productConfig?.dosageInstructions}
      />

      {calculatorConfig?.productConfig?.overdose?.length > 0 &&
        calculatorConfig?.tankConfig?.litres &&
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
              <Grid
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Heading
                  variant={5}
                  weight="semiBold"
                  style={
                    overDose?.description
                      ? { marginBottom: 0 }
                      : { marginBottom: 8 }
                  }
                >
                  Over Dosage Instructions {overDose?.multiplier}x
                </Heading>

                {overDose?.tag && (
                  <Pill>
                    <Text style={{ color: WHITE }}>{overDose.tag}</Text>
                  </Pill>
                )}
              </Grid>

              {overDose?.description && (
                <Text style={{ marginBottom: 8 }}>{overDose?.description}</Text>
              )}

              <DosageTable
                doseCaps={doseCaps}
                doseLitres={doseLitres}
                doseMl={doseMl}
                doseOz={doseOz}
                disableCaps={calculatorConfig?.productConfig?.disableCaps}
              />
            </View>
          );
        })}

      {calculatorConfig?.productConfig?.hasExistingSystemDosage && (
        <Grid
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading variant={5} weight="semiBold" style={{ marginTop: 8 }}>
            Dosage Instructions
          </Heading>

          {calculatorConfig?.productConfig?.hasExistingSystemDosage && (
            <Pill backgroundColor={"green"}>
              <Text style={{ color: WHITE }}>{"Existing System"}</Text>
            </Pill>
          )}
        </Grid>
      )}
      {calculatorConfig?.productConfig?.hasExistingSystemDosage && (
        <DosageTable
          doseCaps={doseCaps / 2}
          doseLitres={doseLitres / 2}
          doseMl={doseMl / 2}
          doseOz={doseOz / 2}
          disableCaps={calculatorConfig?.productConfig?.disableCaps}
        />
      )}

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
