import apiClient from "../api/apiClient";
import { setStructuredConfiguration } from "../store/slices/structuredConfigurationSlice";
import { useAppDispatch } from "./useRedux";

export const useInitStructuredConfiguration = () => {
  const [setStructuredConfiguration] = useSetStructuredConfiguration();

  const fn = async () => {
    const response = await apiClient.get("/structuredConfiguration");

    setStructuredConfiguration(response.data?.data);

    return;
  };

  return [fn];
};

export const useSetStructuredConfiguration = () => {
  const dispatch = useAppDispatch();

  const fn = (data) => {
    const units = data?.filter((f) => f.definition === "element_test_unit");

    const kits = data?.filter((f) => f.definition === "test_kit");

    const testReason = data?.filter((f) => f.definition === "test_reason");

    // sort by priority
    const post_tags = data
      ?.filter((f) => f.definition === "post_tag")
      ?.sort((a, b) => a.priority - b.priority);

    const diseaseTags = data?.filter(
      (f) => f.definition === "disease_identification"
    );

    const friend_or_foe = data?.filter((f) => f.definition === "friend_or_foe");

    const coral_disease = data?.filter((f) => f.definition === "coral_disease");

    const livestock_temperament = data?.filter(
      (f) => f.definition === "livestock_temperament"
    );

    const livestock_hardy = data?.filter(
      (f) => f.definition === "livestock_hardy"
    );

    const livestock_invert_safe = data?.filter(
      (f) => f.definition === "livestock_invert_safe"
    );

    const livestock_diet = data?.filter(
      (f) => f.definition === "livestock_diet"
    );

    const livestock_care_level = data?.filter(
      (f) => f.definition === "livestock_care_level"
    );

    const livestock_reef_safe = data?.filter(
      (f) => f.definition === "livestock_reef_safe"
    );

    const livestock_size = data?.filter(
      (f) => f.definition === "livestock_size"
    );

    const livestock_tank_limit = data?.filter(
      (f) => f.definition === "livestock_tank_limit"
    );

    const livestock_extra_tank_role = data?.filter(
      (f) => f.definition === "livestock_extra_tank_role"
    );
    const livestock_warnings = data?.filter(
      (f) => f.definition === "livestock_warnings"
    );
    const livestock_swimming_zones = data?.filter(
      (f) => f.definition === "livestock_swimming_zones"
    );
    const livestock_feeding_difficulty = data?.filter(
      (f) => f.definition === "livestock_feeding_difficulty"
    );
    const livestock_family = data?.filter(
      (f) => f.definition === "livestock_family"
    );
    const livestock_family_common = data?.filter(
      (f) => f.definition === "livestock_family_common"
    );
    const livestock_can_tank_breed = data?.filter(
      (f) => f.definition === "livestock_can_tank_breed"
    );
    const livestock_coral_safe = data?.filter(
      (f) => f.definition === "livestock_coral_safe"
    );
    const livestock_long_tank_preferred = data?.filter(
      (f) => f.definition === "livestock_long_tank_preferred"
    );

    const coral_type = data?.filter((f) => f.definition === "coral_type");

    const coral_growth_form = data?.filter(
      (f) => f.definition === "coral_growth_form"
    );
    const coral_care_level = data?.filter(
      (f) => f.definition === "coral_care_level"
    );
    const coral_aggression_level = data?.filter(
      (f) => f.definition === "coral_aggression_level"
    );
    const coral_lighting_level = data?.filter(
      (f) => f.definition === "coral_lighting_level"
    );
    const coral_flow_rate = data?.filter(
      (f) => f.definition === "coral_flow_rate"
    );
    const coral_placement = data?.filter(
      (f) => f.definition === "coral_placement"
    );
    const coral_photosynthetic = data?.filter(
      (f) => f.definition === "coral_photosynthetic"
    );
    const coral_sweeper_tentacles = data?.filter(
      (f) => f.definition === "coral_sweeper_tentacles"
    );
    const coral_growth_rate = data?.filter(
      (f) => f.definition === "coral_growth_rate"
    );
    const coral_fragging_difficulty = data?.filter(
      (f) => f.definition === "coral_fragging_difficulty"
    );
    const coral_family = data?.filter((f) => f.definition === "coral_family");
    const coral_family_common = data?.filter(
      (f) => f.definition === "coral_family_common"
    );
    const coral_target_feeding = data?.filter(
      (f) => f.definition === "coral_target_feeding"
    );
    const plant_type = data?.filter((f) => f.definition === "plant_type");
    const plant_care_level = data?.filter(
      (f) => f.definition === "plant_care_level"
    );
    const plant_lighting_level = data?.filter(
      (f) => f.definition === "plant_lighting_level"
    );
    const plant_placement = data?.filter(
      (f) => f.definition === "plant_placement"
    );
    const plant_growth_form = data?.filter(
      (f) => f.definition === "plant_growth_form"
    );
    const plant_family = data?.filter((f) => f.definition === "plant_family");

    const plant_family_common = data?.filter(
      (f) => f.definition === "plant_family_common"
    );
    const plant_growth_rate = data?.filter(
      (f) => f.definition === "plant_growth_rate"
    );
    const plant_fragging_difficulty = data?.filter(
      (f) => f.definition === "plant_fragging_difficulty"
    );
    const plant_CO2_requirement = data?.filter(
      (f) => f.definition === "plant_CO2_requirement"
    );
    const plant_substrate_requirement = data?.filter(
      (f) => f.definition === "plant_substrate_requirement"
    );
    const plant_leaf_shape = data?.filter(
      (f) => f.definition === "plant_leaf_shape"
    );
    const plant_difficulty_without_co2 = data?.filter(
      (f) => f.definition === "plant_difficulty_without_co2"
    );

    const dominant_colour = data?.filter(
      (f) => f.definition === "dominant_colour"
    );

    const diseaseGroupTags = Object.values(
      diseaseTags.reduce((acc, disease) => {
        if (!acc[disease.group]) {
          acc[disease.group] = { name: disease.group, children: [] };
        }
        acc[disease.group].children.push(disease);
        return acc;
      }, {})
    );

    // Sort children within each group by priority
    diseaseGroupTags.forEach((group) => {
      group.children.sort((a, b) => a.priority - b.priority);
    });

    const friendOrFoeGroupTags = Object.values(
      friend_or_foe.reduce((acc, disease) => {
        if (!acc[disease.group]) {
          acc[disease.group] = { name: disease.group, children: [] };
        }
        acc[disease.group].children.push(disease);
        return acc;
      }, {})
    );

    // Sort children within each group by priority
    friendOrFoeGroupTags.forEach((group) => {
      group.children.sort((a, b) => a.priority - b.priority);
    });

    const coralDiseaseGroupTags = Object.values(
      coral_disease.reduce((acc, disease) => {
        if (!acc[disease.group]) {
          acc[disease.group] = { name: disease.group, children: [] };
        }
        acc[disease.group].children.push(disease);
        return acc;
      }, {})
    );

    // Sort children within each group by priority
    coralDiseaseGroupTags.forEach((group) => {
      group?.children.sort((a, b) => a.priority - b.priority);
    });

    dispatch(
      setStructuredConfiguration({
        units,
        kits,
        testReason,
        diseaseTags: diseaseGroupTags,
        friendOrFoeTags: friendOrFoeGroupTags,
        coralDiseaseTags: coralDiseaseGroupTags,
        livestock_temperament,
        livestock_hardy,
        livestock_reef_safe,
        livestock_care_level,
        livestock_diet,
        livestock_invert_safe,
        livestock_size,
        livestock_tank_limit,
        livestock_extra_tank_role,
        livestock_warnings,
        livestock_family,
        livestock_family_common,
        livestock_swimming_zones,
        livestock_feeding_difficulty,
        livestock_coral_safe,
        livestock_can_tank_breed,
        livestock_long_tank_preferred,
        coral_type,
        coral_growth_form,
        coral_care_level,
        coral_aggression_level,
        coral_lighting_level,
        coral_flow_rate,
        coral_placement,
        coral_photosynthetic,
        coral_sweeper_tentacles,
        coral_growth_rate,
        coral_fragging_difficulty,
        coral_family,
        coral_family_common,
        coral_target_feeding,
        plant_type,
        plant_care_level,
        plant_lighting_level,
        plant_placement,
        plant_growth_form,
        plant_family,
        plant_family_common,
        plant_growth_rate,
        plant_fragging_difficulty,
        plant_CO2_requirement,
        plant_substrate_requirement,
        plant_leaf_shape,
        plant_difficulty_without_co2,
        dominant_colour,
        post_tags,
      })
    );
  };

  return [fn];
};
