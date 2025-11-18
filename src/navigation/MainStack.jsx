import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-native";
import { BackHandler } from "react-native";

import { HomeScreen } from "../screens";
import { TestingScreen } from "../screens/Testing/Testing";
import { AccountScreen } from "../screens/Account";
import { LiveStockScreen } from "../screens/LiveStock/LiveStockScreen";

import {
  ACCOUNTS_PATH,
  ARTICLES_PATH,
  EXPLORE_PATH,
  LIVESTOCK_PATH,
  MORE_PATH,
  TANKS_PATH,
  TESTING_PATH,
  TANK_FISH_PATH,
  TANK_INVERTS_PATH,
  TANK_PROGRESS_PATH,
  TANK_TASKS_PATH,
  TANK_REMINDERS_PATH,
  POLLS_PATH,
  SOCIAL_PATH,
  CORAL_PATH,
  TANK_CORAL_PATH,
  TANK_SETUP,
  SOCIAL_URGENT_PATH,
  SOCIAL_MY_POSTS_PATH,
  SOCIAL_SAVED_POSTS_PATH,
  TANK_PAR_PATH,
  SOCIAL_PENDING_POSTS_PATH,
  TANK_AMPHIBIANS_PATH,
  TANK_REPTILES_PATH,
  READING_AND_TOOLS_PATH,
  READING_AND_TOOLS_TAP_WATER_CONDITIONERS_PATH,
  READING_AND_TOOLS_MEDICATIONS_PATH,
  READING_AND_TOOLS_NITRIFYING_BACTERIA_PATH,
  READING_AND_TOOLS_PLANT_CORAL_FOOD_PATH,
  READING_AND_TOOLS_LIQUID_CO2_PATH,
  READING_AND_TOOLS_ADDITIVES_AND_BUFFERS_PATH,
  BASKET_PATH,
} from "../constants";

import { LiveStockProfileScreen } from "../screens/LiveStock/LiveStockProfileScreen";
import { MoreScreen } from "../screens/More";
import { ArticleScreen } from "../screens/Articles";
import { MainTankScreen } from "../screens/Tanks/MainTankScreen";
import { TankDetailsScreen } from "../screens/Tanks/TankDetailsScreen";
import { TankFishScreen } from "../screens/Tanks/Fish/TankFishScreen";
import { TankInvertsScreen } from "../screens/Tanks/Inverts/TankInvertsScreen";
import { TankProgressScreen } from "../screens/Tanks/Progress/TankProgressScreen";
import { TankTasksScreen } from "../screens/Tanks/Tasks/TankTasksScreen";
import { TankRemindersScreen } from "../screens/Tanks/Reminders/TankRemindersScreen";
import { PollScreen } from "../screens/Polls/PollScreen";
import { SocialScreen } from "../screens/Social/SocialScreen";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import {
  selectSocialFullScreen,
  setWheelMenuOpen,
} from "../store/slices/globalSlice";
import { TestingSingleElementView } from "../screens/Testing/TestingSingleElementView";
import { CoralScreen } from "../screens/Coral/CoralScreen";
import { CoralProfileScreen } from "../screens/Coral/CoralProfileScreen";
import { TankCoralScreen } from "../screens/Tanks/Corals/TankCoralScreen";
import { TankSetupScreen } from "../screens/Tanks/Setup/TankSetupScreen";
import { UsedEquipmentMarketplace } from "../screens/UsedEquipmentMarketplace/UsedEquipmentMarketplace";
import { TankParReadings } from "../screens/Tanks/ParReadings/TankParReadings";
import { TankReptilesScreen } from "../screens/Tanks/Reptiles/TankReptilesScreen";
import { TankAmphibiansScreen } from "../screens/Tanks/Amphibians/AmphibiansScreen";
import { TankLiveStockFile } from "../screens/Tanks/LiveStockFile/LiveStockFiles";
import { ReadingAndTools } from "../screens/ReadingAndTools/ReadingAndTools";
import { TapWaterConditionerCalculator } from "../screens/ReadingAndTools/Calculators/TapWaterConditionerCalculator";
import { MedicationsCalculator } from "../screens/ReadingAndTools/Calculators/MedicationsCalculator";
import { NitrifyingBacteriaCalculator } from "../screens/ReadingAndTools/Calculators/NitrifyingBacteriaCalculator";
import { PlantCoralFoodCalculator } from "../screens/ReadingAndTools/Calculators/PlantCoralFoodCalculator";
import { AdditivesAndBuffersCalculator } from "../screens/ReadingAndTools/Calculators/AdditivesAndBuffersCalculator";
import { LiquidCo2Calculator } from "../screens/ReadingAndTools/Calculators/LiquidCo2Calculator";
import { BasketScreen } from "../screens/Basket/BasketScreen";

export const MainStack = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const location = useLocation();

  const socialFullScreenActive = useAppSelector(selectSocialFullScreen)?.active;

  useEffect(() => {
    const handleBackPress = () => {
      dispatch(setWheelMenuOpen(false));

      if (location.pathname !== "/" && !socialFullScreenActive) {
        navigate(-1); // Go back if not on the home screen

        return true; // Prevent default behavior (exiting the app)
      }

      if (!socialFullScreenActive) {
      }
    };

    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      sub.remove();
    };
  }, [location, socialFullScreenActive]);

  return (
    <Routes>
      <Route index path={"/"} element={<HomeScreen />} />
      <Route index path={EXPLORE_PATH} element={<HomeScreen />} />

      <Route index path={BASKET_PATH} element={<BasketScreen />} />

      <Route path={MORE_PATH} element={<MoreScreen />} />

      <Route path={READING_AND_TOOLS_PATH} element={<ReadingAndTools />} />
      <Route
        path={READING_AND_TOOLS_TAP_WATER_CONDITIONERS_PATH}
        element={<TapWaterConditionerCalculator />}
      />
      <Route
        path={READING_AND_TOOLS_MEDICATIONS_PATH}
        element={<MedicationsCalculator />}
      />
      <Route
        path={READING_AND_TOOLS_NITRIFYING_BACTERIA_PATH}
        element={<NitrifyingBacteriaCalculator />}
      />
      <Route
        path={READING_AND_TOOLS_PLANT_CORAL_FOOD_PATH}
        element={<PlantCoralFoodCalculator />}
      />
      <Route
        path={READING_AND_TOOLS_ADDITIVES_AND_BUFFERS_PATH}
        element={<AdditivesAndBuffersCalculator />}
      />
      <Route
        path={READING_AND_TOOLS_LIQUID_CO2_PATH}
        element={<LiquidCo2Calculator />}
      />

      <Route path={`${ARTICLES_PATH}/:url`} element={<ArticleScreen />} />

      <Route path={ACCOUNTS_PATH} element={<AccountScreen />} />

      <Route path={TANKS_PATH} element={<MainTankScreen />} />

      <Route path={`${TANKS_PATH}/:id`} element={<TankDetailsScreen />} />
      <Route path={TANK_FISH_PATH} element={<TankFishScreen />} />
      <Route path={TANK_CORAL_PATH} element={<TankCoralScreen />} />
      <Route path={TANK_INVERTS_PATH} element={<TankInvertsScreen />} />
      <Route path={TANK_AMPHIBIANS_PATH} element={<TankAmphibiansScreen />} />
      <Route path={TANK_REPTILES_PATH} element={<TankReptilesScreen />} />
      <Route path={TANK_PROGRESS_PATH} element={<TankProgressScreen />} />
      <Route path={TANK_TASKS_PATH} element={<TankTasksScreen />} />
      <Route path={TANK_REMINDERS_PATH} element={<TankRemindersScreen />} />
      <Route
        path={`${TANKS_PATH}/:tankId/livestockFile/:id`}
        element={<TankLiveStockFile />}
      />
      <Route path={TANK_SETUP} element={<TankSetupScreen />} />
      <Route path={TANK_PAR_PATH} element={<TankParReadings />} />

      <Route path={TESTING_PATH} element={<TestingScreen />} />
      <Route
        path={`${TESTING_PATH}/element`}
        element={<TestingSingleElementView />}
      />

      <Route
        path={`/used-marketplace`}
        element={<UsedEquipmentMarketplace />}
      />

      <Route
        path={SOCIAL_PATH}
        element={<SocialScreen title="Social" type="social" />}
      />

      <Route
        path={SOCIAL_URGENT_PATH}
        element={<SocialScreen title="Urgent Posts" type="urgent" />}
      />

      <Route
        path={SOCIAL_MY_POSTS_PATH}
        element={<SocialScreen title="My Posts" type="my-posts" />}
      />

      <Route
        path={SOCIAL_SAVED_POSTS_PATH}
        element={<SocialScreen title="Saved Posts" type="saved-posts" />}
      />

      <Route
        path={SOCIAL_PENDING_POSTS_PATH}
        element={<SocialScreen title="Pending Posts" type="pending-posts" />}
      />

      <Route path={POLLS_PATH} element={<PollScreen />} />

      <Route
        path={CORAL_PATH}
        shouldRevalidate={true}
        element={<CoralScreen coral={true} />}
      />
      <Route
        path={LIVESTOCK_PATH}
        element={<LiveStockScreen coral={false} />}
      />
      <Route
        path={`${LIVESTOCK_PATH}/:id`}
        element={<LiveStockProfileScreen />}
      />
      <Route path={`${CORAL_PATH}/:id`} element={<CoralProfileScreen />} />
    </Routes>
  );
};

const PrivateRoute = ({ element, condition, fallback }) => {
  return condition ? element : fallback;
};
