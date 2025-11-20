import { combineReducers, configureStore } from "@reduxjs/toolkit";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import tankReducer from "./slices/tankSlice";
import testingReducer from "./slices/testingSlice";
import globalSlice from "./slices/globalSlice";
import userConfigSlice from "./slices/userConfigSlice";
import redSeaSlice from "./slices/redSeaSlice";

// Persist configuration: only persist userConfig
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["userConfig"], // Persist only this slice
};

// Combine all reducers
const rootReducer = combineReducers({
  tanks: tankReducer,
  testing: testingReducer,
  global: globalSlice,
  userConfig: userConfigSlice, // No need to wrap separately
  redSea: redSeaSlice,
});

// Apply persistReducer to the entire rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
});

export const persistor = persistStore(store);
export default store;
