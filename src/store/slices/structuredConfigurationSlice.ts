import { createSlice } from "@reduxjs/toolkit";

type StructuredConfigurationItem = {
  name: string;
  description: string;
  priority: number;
  definition: string;
  updated_at: string; // or Date if you're parsing it
  created_at: string; // or Date
  id: string;
};

type StructuredConfigurationState = {
  [key in StructuredConfigurationKey]?: StructuredConfigurationItem[];
};

const initialState: StructuredConfigurationState = {
  units: [],
  kits: [],
  testReason: [],
  diseaseTags: [],
  friendOrFoeTags: [],
  coralDiseaseTags: [],
};

const slice = createSlice({
  name: "structuredConfiguration",
  initialState,
  reducers: {
    setStructuredConfiguration: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { actions } = slice;

export default slice.reducer;

export const { setStructuredConfiguration } = actions;

export const selectStructuredConfiguration = (state) =>
  state.structuredConfiguration;

export const selectStructuredConfigurationById = (id) => (state) =>
  state.structuredConfiguration[id];

export type StructuredConfigurationKey =
  | "test_kit"
  | "units"
  | "kits"
  | "testReason"
  | "diseaseTags"
  | "friendOrFoeTags"
  | "coralDiseaseTags"
  | "element_test_unit"
  | "test_reason"
  | "disease_identification"
  | "friend_or_foe"
  | "coral_disease"
  | "livestock_temperament"
  | "livestock_reef_safe"
  | "livestock_hardy"
  | "livestock_care_level"
  | "livestock_diet"
  | "livestock_invert_safe"
  | "livestock_size"
  | "livestock_tank_limit"
  | "livestock_extra_tank_role"
  | "livestock_warnings"
  | "livestock_swimming_zones"
  | "livestock_feeding_difficulty"
  | "livestock_family"
  | "livestock_family_common"
  | "livestock_can_tank_breed"
  | "livestock_coral_safe"
  | "livestock_long_tank_preferred"
  | "coral_type"
  | "coral_growth_form"
  | "coral_care_level"
  | "coral_aggression_level"
  | "coral_lighting_level"
  | "coral_flow_rate"
  | "coral_placement"
  | "coral_photosynthetic"
  | "coral_sweeper_tentacles"
  | "coral_growth_rate"
  | "coral_fragging_difficulty"
  | "coral_family"
  | "coral_family_common"
  | "coral_target_feeding"
  | "plant_type"
  | "plant_care_level"
  | "plant_lighting_level"
  | "plant_placement"
  | "plant_growth_form"
  | "plant_family"
  | "plant_family_common"
  | "plant_growth_rate"
  | "plant_fragging_difficulty"
  | "plant_CO2_requirement"
  | "plant_substrate_requirement"
  | "plant_leaf_shape"
  | "plant_difficulty_without_co2"
  | "dominant_colour";
