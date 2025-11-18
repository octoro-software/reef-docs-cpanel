import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useNavigate } from "react-router-native";
import { parse, format } from "date-fns";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  useElements,
  useTestHistoryCurrentStanding,
  useTestHistoryForTank,
} from "../../hooks/useTestHistory";
import { useModal } from "../../hooks/useModal";
import { useGetActiveTank } from "../../hooks/useTanks";

import {
  selectLatestTest,
  selectTestCurrentStanding,
} from "../../store/slices/testingSlice";
import { selectStructuredConfiguration } from "../../store/slices/structuredConfigurationSlice";

import { UserPostCardScreenHeader } from "../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";
import { AppTip } from "../../components/AppTip/AppTip";
import { TestingTabs } from "./Components/TestingTabs";
import { CurrentStandingMainView } from "./Components/Main/CurrentStandingMainView";
import { HistoricMainView } from "./Components/Main/HistoricMainView";
import {
  selectTestingView,
  setTestingView,
} from "../../store/slices/userConfigSlice";

export const TestingScreen = () => {
  const dispatch = useAppDispatch();

  const activeTab = useAppSelector(selectTestingView) || "Current Standing";

  const [loading, setLoading] = useState(true);

  const [getTestHistoryForTank] = useTestHistoryForTank();

  const elements = useElements();

  const [getCurrentStanding] = useTestHistoryCurrentStanding();

  const navigate = useNavigate();

  const structuredConfiguration = useAppSelector(selectStructuredConfiguration);

  const { openModal } = useModal();

  const tank = useGetActiveTank();

  const handleAddTest = () =>
    openModal({
      type: "homeTestCreateModal",
      modalTitle: "Home Test",
      height: "large",
    });

  const { data, monthsWithTests, selectedMonth } =
    useAppSelector(
      activeTab === "Current Standing"
        ? selectTestCurrentStanding
        : selectLatestTest
    ) || [];

  const getData = async (month) => {
    setLoading(true);

    if (activeTab === "Current Standing") {
      await getCurrentStanding();
    } else {
      await getTestHistoryForTank(month);
    }

    setLoading(false);
  };

  useEffect(() => {
    getData(selectedMonth);
  }, [selectedMonth]);

  const onElementPress = (element, testId, unit) => {
    navigate(`element`, {
      state: {
        data: { ...element, testId, unit },
      },
      replace: false,
    });
  };

  const monthOptions = monthsWithTests
    ? monthsWithTests.map((month) => ({
        label: format(parse(month, "yyyy-MM", new Date()), "MMMM yyyy"),
        value: month,
      }))
    : [];

  const tabNames = ["Current Standing", "Historic"];

  const handleTabPress = (index, name) => {
    dispatch(setTestingView(name));
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 560,
      }}
    >
      <UserPostCardScreenHeader title="Testing" icon="reefDocsTesting" />

      <AppTip
        tipId="TESTING_SETTINGS_REMINDER"
        text="Remember to update your test settings and dosages. Select the menu and press test settings."
        style={{ marginTop: 8 }}
      />

      <TestingTabs
        activeTab={activeTab}
        handleTabPress={handleTabPress}
        tabNames={tabNames}
      />

      {activeTab === "Current Standing" && (
        <CurrentStandingMainView
          data={data}
          tank={tank}
          onElementPress={onElementPress}
          elements={elements}
          getTestHistoryForTankLoading={loading}
        />
      )}

      {activeTab === "Historic" && (
        <HistoricMainView
          data={data}
          tank={tank}
          onElementPress={onElementPress}
          monthOptions={monthOptions}
          selectedMonth={selectedMonth}
          getTestHistoryForTankLoading={loading}
          handleAddTest={handleAddTest}
          structuredConfiguration={structuredConfiguration}
        />
      )}
    </ScrollView>
  );
};
