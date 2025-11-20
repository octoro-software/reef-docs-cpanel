import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  latestTest: {
    data: [],
    selectedMonth: null,
    monthsWithTests: [],
  },
  syncing: false,
  currentStanding: {},
  currentStandingStability: {},
  testSelectionIndex: [],
  elementViewData: {
    dosingData: [],
    testingData: [],
  },
  chart: {
    chartData: [],
    dosageData: [],
  },
};

const testingSlice = createSlice({
  name: "testing",
  initialState,
  reducers: {
    setChartData: (state, action) => {
      state.chart.chartData = action.payload;
    },

    setAquaDocsFeedSyncing: (state, action) => {
      state.syncing = action.payload;
    },

    setDosageData: (state, action) => {
      state.chart.dosageData = action.payload;
    },

    chartRemoveDosageById: (state, action) => {
      state.chart.dosageData = state.chart.dosageData.filter(
        (dosage) => dosage.id !== action.payload
      );
    },

    setLatestTest: (state, action) => {
      state.latestTest = action.payload;
    },
    setCurrentStanding: (state, action) => {
      state.currentStanding = action.payload;
    },
    setCurrentStandingStability: (state, action) => {
      state.currentStandingStability = action.payload;
    },
    setLatestTestMonth: (state, action) => {
      state.latestTest = {
        ...state.latestTest,
        selectedMonth: action.payload,
      };
    },
    setTestSelectionIndex: (state, action) => {
      state.testSelectionIndex = action.payload;
    },
    removeTestById: (state, action) => {
      state.latestTest.data = state.latestTest.data.filter(
        (test) => test.id !== action.payload
      );
    },
    setElementViewData: (state, action) => {
      state.elementViewData = action.payload;
    },
    removeDosageById: (state, action) => {
      state.elementViewData.dosingData =
        state.elementViewData.dosingData.filter(
          (test) => test.id !== action.payload
        );
    },
  },
});

export const {
  setLatestTest,
  setTestSelectionIndex,
  setLatestTestMonth,
  removeTestById,
  setCurrentStanding,
  setElementViewData,
  removeDosageById,
  setChartData,
  setDosageData,
  chartRemoveDosageById,
  setCurrentStandingStability,
  setAquaDocsFeedSyncing,
} = testingSlice.actions;

export default testingSlice.reducer;

export const selectLatestTest = (state) => state.testing.latestTest;

export const selectTestCurrentStanding = (state) =>
  state.testing.currentStanding;

export const selectTestCurrentStandingStability = (state) =>
  state.testing.currentStandingStability;

export const selectTestSelectionIndex = (state) =>
  state.testing.testSelectionIndex;

export const selectElementViewData = (state) => state.testing.elementViewData;

export const selectChartData = (state) => state.testing.chart.chartData;

export const selectDosageData = (state) => state.testing.chart.dosageData;

export const selectAquaDocsFeedSyncing = (state) => state.testing.syncing;
