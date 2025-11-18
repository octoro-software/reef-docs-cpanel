export const calculateChemicalDosageWithDays = (
  currentConc,
  targetConc,
  waterVolume,
  productAmount, // mL or g total in the bottle
  increasePerLiter, // mg/L increase achieved by 'productAmount'
  increaseAmount, // user-desired daily ppm increase
  maxDailyDosage, // max safe ppm increase per day
  unit // 'ml' or 'g'
) => {
  if (currentConc >= targetConc) {
    return { dosageRequired: false };
  }
  if (
    waterVolume <= 0 ||
    productAmount <= 0 ||
    increasePerLiter <= 0 ||
    increaseAmount <= 0 ||
    maxDailyDosage <= 0
  ) {
    return "Invalid input values.";
  }

  const isLiquid = unit === "ml";

  // 1. Total ppm increase needed
  const concentrationIncrease = targetConc - currentConc;

  // 2. Validate user-requested increase is not above the max safe limit
  const dailyPpmIncrease = Math.min(increaseAmount, maxDailyDosage);

  // 3. Total mg of element needed
  const totalElementRequired = concentrationIncrease * waterVolume;

  // 4. Product concentration (mg per mL or g)
  const productConcentration =
    (increasePerLiter * increaseAmount) / productAmount;

  // 5. Daily mg of element needed
  const dailyElementRequired = dailyPpmIncrease * waterVolume;

  // 6. Daily amount of product needed
  const dailyProductDose = dailyElementRequired / productConcentration;

  // 7. Total amount of product needed
  const totalDosage = totalElementRequired / productConcentration;

  // 8. Total days needed
  const daysRequired = Math.ceil(concentrationIncrease / dailyPpmIncrease);

  // 9. Efficient dosing plan
  const lastDayDose =
    ((concentrationIncrease % dailyPpmIncrease) * waterVolume) /
    productConcentration;
  const hasFinalDose = lastDayDose > 0 && daysRequired > 1;

  const mostEfficient = {
    daysAtMax: hasFinalDose ? daysRequired - 1 : daysRequired,
    max: Number(dailyProductDose.toFixed(2)),
    finalDose: hasFinalDose ? Number(lastDayDose.toFixed(2)) : 0,
    totalDays: daysRequired,
    hasFinalDose,
  };

  return {
    totalDosage: Number(totalDosage.toFixed(3)),
    dailyDosage: Number(dailyProductDose.toFixed(3)),
    dosageRequired: true,
    canDose: true,
    unit,
    isLiquid,
    daysRequired,
    mostEfficient,
  };
};

export const calculateSalinityDosage = (
  volume,
  currentSalinity,
  targetSalinity,
  saltPerLitre = 0.035, // 35g per litre of saltwater
  usePPT = false // If true, input salinity values are in ppt instead of SG
) => {
  // Convert ppt to SG if necessary
  let safeDailyChange = usePPT ? 0.11 : 0.002; // 0.11 ppt ≈ 0.002 SG
  if (usePPT) {
    currentSalinity = 1 + currentSalinity / 1000;
    targetSalinity = 1 + targetSalinity / 1000;
  }

  if (currentSalinity > targetSalinity) {
    // Case: Salinity too high, need to add RO water
    let totalSalinityDecrease = currentSalinity - targetSalinity;
    let newVolume = volume * (currentSalinity / targetSalinity);
    let totalROWaterToAdd = newVolume - volume;

    // Calculate the number of safe days for adjustment
    let daysNeeded = Math.ceil(totalSalinityDecrease / safeDailyChange);
    let dailyROWater = totalROWaterToAdd / daysNeeded; // RO water per day

    return {
      totalDosage: totalROWaterToAdd.toFixed(2),
      unit: "litres",
      daysRequired: daysNeeded,
      dailyDosage: dailyROWater.toFixed(2),
      dosageRequired: true,
      canDose: true,
      type: "RO",
    };
  } else if (currentSalinity < targetSalinity) {
    // Case: Salinity too low, need to add salt
    let totalSalinityIncrease = targetSalinity - currentSalinity;
    let totalSaltToAdd =
      (volume * (totalSalinityIncrease / 0.001) * saltPerLitre) / 1000; // Convert g to kg

    // Calculate the number of safe days for adjustment
    let daysNeeded = Math.ceil(totalSalinityIncrease / safeDailyChange);
    let dailySaltDose = totalSaltToAdd / daysNeeded; // Salt per day

    return {
      totalDosage: totalSaltToAdd.toFixed(2),
      daysRequired: daysNeeded,
      dailyDosage: dailySaltDose.toFixed(2),
      unit: "grams",
      type: "salt",
      dosageRequired: true,
      canDose: true,
    };
  } else {
    return {
      dosageRequired: false,
    };
  }
};
