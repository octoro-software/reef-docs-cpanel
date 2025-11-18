import { selectActiveTank, selectTanks } from "../store/slices/tankSlice";
import {
  calculateChemicalDosageWithDays,
  calculateSalinityDosage,
} from "../utility/dosage";
import { useAppSelector } from "./useRedux";

export const useCalculateDosageForActiveTank = () => {
  const activeTank = useAppSelector(selectActiveTank);

  const tanks = useAppSelector(selectTanks);

  const activeTankData = tanks.find((tank) => tank.id === activeTank);

  const tankVolume = Number(activeTankData?.volume);

  const fn = ({
    currentConcentration,
    targetConcentation,
    productVolume,
    increasePerLitre,
    increaseVolume,
    maxDailyDosage,
    unit,
  }) => {
    if (!increasePerLitre || !increaseVolume) return { canDose: false };

    const dosage = calculateChemicalDosageWithDays(
      Number(currentConcentration),
      Number(targetConcentation),
      Number(tankVolume),
      Number(productVolume),
      Number(increasePerLitre),
      Number(increaseVolume),
      Number(maxDailyDosage),
      unit
    );

    return dosage;
  };

  return [fn];
};

export const useSalinityDosage = () => {
  const activeTank = useAppSelector(selectActiveTank);

  const tanks = useAppSelector(selectTanks);

  const activeTankData = tanks.find((tank) => tank.id === activeTank);

  const tankVolume = Number(activeTankData?.volume);

  const fn = ({ current, target, usePPT }) => {
    return calculateSalinityDosage(
      Number(tankVolume),
      Number(current),
      Number(target),
      0.035,
      usePPT
    );
  };

  return [fn];
};
