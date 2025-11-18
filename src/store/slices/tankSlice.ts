import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tanks: [],
  tankProfiles: {},
  activeTank: "",
  tankTaskPreferences: {},
  tankTasks: {},
  currentDate: "",
  tankProgress: {
    data: [],
    page: 1,
    loading: false,
    hasMore: true,
    initialLoading: true,
    sortBy: "desc",
  },
};

export const selectTankProgress = (state) => state.tanks.tankProgress;

const slice = createSlice({
  name: "tanks",
  initialState,
  reducers: {
    setTanks: (state, action) => {
      state.tanks = action.payload;
    },
    setCurrentDateValue: (state, action) => {
      state.currentDate = action.payload;
    },
    setTankProfile: (state, action) => {
      state.tankProfiles[action.payload.id] = action.payload;
    },

    addTankProfile: (state, action) => {
      state.tankProfiles[action.payload.id] = action.payload;
      state.tanks.push(action.payload);
    },

    updateTankProfile: (state, action) => {
      state.tankProfiles[action.payload.id] = action.payload;
      state.tanks = state.tanks.map((tank) =>
        tank.id === action.payload.id ? action.payload : tank
      );
    },
    updatePartialTank: (state, action) => {
      // Update tankProfiles
      state.tankProfiles[action.payload.id] = {
        ...state.tankProfiles[action.payload.id],
        ...action.payload,
      };
      // Also update the tanks array
      state.tanks = state.tanks.map((tank) =>
        tank.id === action.payload.id ? { ...tank, ...action.payload } : tank
      );
    },

    appendTankLiveStock: (state, action) => {
      const { tankId, type, data, pagination } = action.payload;
      if (!state.tankProfiles[tankId]) return;
      if (!state.tankProfiles[tankId][type]) {
        state.tankProfiles[tankId][type] = { data: [], pagination: {} };
      }
      state.tankProfiles[tankId][type].data = [
        ...(state.tankProfiles[tankId][type].data || []),
        ...data,
      ];
      state.tankProfiles[tankId][type].pagination = pagination;
    },

    removeTankLiveStockById: (state, action) => {
      const { tankId, type, uuid } = action.payload;
      if (!state.tankProfiles[tankId] || !state.tankProfiles[tankId][type])
        return;
      state.tankProfiles[tankId][type].data = state.tankProfiles[tankId][
        type
      ].data.filter((item) => item.uuid !== uuid);
    },

    removeTankProfile: (state, action) => {
      const tankId = action.payload;

      // Remove from tankProfiles
      delete state.tankProfiles[tankId];

      // Remove from tanks array
      state.tanks = state.tanks.filter((tank) => tank.id !== tankId);
    },

    setTankActiveTank: (state, action) => {
      state.activeTank = action.payload;
    },
    setTankTaskPreferences: (state, action) => {
      state.tankTaskPreferences = action.payload;
    },
    setInitTankTasks: (state, action) => {
      state.tankTasks = action.payload;
    },
    setTankTasks: (state, action) => {
      if (!state.tankTasks) state.tankTasks = {};
      state.tankTasks[action.payload.tankId] = action.payload.data;
    },
    updateSingleTankTask: (state, action) => {
      const { tankId, id, completed, skipped, weekDate } = action.payload;

      if (!state.tankTasks[tankId]) return;

      state.tankTasks[tankId] = state.tankTasks[tankId].map((group) => {
        if (group.weekDate !== weekDate) return group;

        const updatedDates = group.dates.map((task) =>
          task.id === id ? { ...task, completed, skipped } : task
        );

        const totalComplete = updatedDates.filter(
          (task) => task.completed
        ).length;

        return {
          ...group,
          dates: updatedDates,
          totalComplete,
        };
      });
    },
    setTankProgressState: (state, action) => {
      state.tankProgress = { ...state.tankProgress, ...action.payload };
    },
    resetTankProgressState: (state) => {
      state.tankProgress = {
        data: [],
        page: 1,
        loading: false,
        hasMore: true,
        initialLoading: true,
        sortBy: "desc",
      };
    },
  },
});

export const {
  setTanks,
  setTankProfile,
  setTankActiveTank,
  addTankProfile,
  updateTankProfile,
  removeTankProfile,
  setTankTaskPreferences,
  setInitTankTasks,
  setTankTasks,
  updateSingleTankTask,
  setCurrentDateValue,
  setTankProgressState,
  resetTankProgressState,
  updatePartialTank,
  appendTankLiveStock,
  removeTankLiveStockById,
} = slice.actions;

export default slice.reducer;

export const selectTanks = (state) => state.tanks.tanks;

export const selectTankProfile = (id) => (state) =>
  state.tanks.tankProfiles?.[id];

export const selectActiveTank = (state) => state.tanks.activeTank;

export const selectTankTaskPreferences = (state) =>
  state.tanks.tankTaskPreferences;

export const selectTankTasks = (id) => (state) => state.tanks.tankTasks?.[id];

export const selectCurrentDate = (state) => state.tanks.currentDate;
