import { Vibration } from "react-native";
import { BLACK, REEF_DOCS_BLUE, WHITE } from "../constants";
import { getAppEnv } from "./environment";

export const getLiveStockPreLoadedData = (state, data) => {
  const reefSafe = data?.reef_safe || state?.data?.reef_safe;
  const hardy = data?.hardy || state?.data?.hardy;

  const coralSafe = data?.coral_safe || state?.data?.coral_safe;

  const plantSafe = data?.plant_safe || state?.data?.plant_safe;

  const community = data?.community || state?.data?.community;

  const scientificName = data?.scientific_name || state?.data?.scientific_name;

  const name = data?.name || state?.data?.name;

  const alternateNamesData =
    data?.alternate_names || state?.data?.alternate_names;

  const alternateNames =
    alternateNamesData?.length > 0
      ? alternateNamesData?.length > 1
        ? `${alternateNamesData?.[0]} +${alternateNamesData?.length - 1}`
        : alternateNamesData?.[0]
      : false;

  const tankExtraRole = data?.tank_extra_role || state?.data?.tank_extra_role;

  const images = data?.images || state?.data?.images;

  const growthForm = data?.growth_form || state?.data?.growth_form;

  const regionOfOrigin =
    data?.region_of_origin || state?.data?.region_of_origin;

  const canAquaCulture =
    data?.can_be_aquacultured !== undefined
      ? data?.can_be_aquacultured
        ? "Yes"
        : "No"
      : state?.data?.can_be_aquacultured !== undefined
        ? state?.data?.can_be_aquacultured
          ? "Yes"
          : "No"
        : "";

  return {
    reefSafe,
    hardy,
    alternateNames,
    tankExtraRole,
    coralSafe,
    plantSafe,
    images,
    name,
    scientificName,
    community,
    growthForm,
    regionOfOrigin,
    canAquaCulture,
  };
};

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array?.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const generateCoralData = (
  handleOpenLiveStockModal,
  setContributeMode,
  contributeMode,
  state,
  data,
  openModal,
  id
) => {
  const handleToggleContributionModal = () => {
    Vibration.vibrate();
    setContributeMode((prevState) => !prevState);
  };

  const { growthForm, regionOfOrigin, canAquaCulture } =
    getLiveStockPreLoadedData(state, data);

  const buttons = [
    {
      icon: "reefDocsCoralCamera",
      onPress: () =>
        openModal({
          type: "liveStockProfileUserPhotosModal",
          height: "large",
          modalTitle: "Reefer Photos",
          data: {
            liveStockId: id,
            icon: "reefDocsCoralCamera",
          },
        }),
      iconFill: BLACK,
      backgroundColor: WHITE,
    },
    {
      icon: "reefDocsCoralVideo",
      onPress: () =>
        openModal({
          type: "liveStockProfileUserVideosModal",
          height: "large",
          modalTitle: "Reefer Videos",
          data: {
            icon: "reefDocsCoralVideo",
          },
        }),
      iconFill: BLACK,
      backgroundColor: WHITE,
    },
    {
      icon: "reefDocsCoralComment",
      onPress: () =>
        openModal({
          type: "liveStockProfileUserExperienceModal",
          height: "large",
          modalTitle: "Community Experiences",
          data: {
            liveStockId: id,
            icon: "reefDocsCoralComment",
          },
        }),
      backgroundColor: WHITE,
      iconFill: BLACK,
    },
    {
      icon: "reefDocsCoralInformation",
      onPress: () => handleToggleContributionModal(),
      backgroundColor: contributeMode ? REEF_DOCS_BLUE : WHITE,
      iconFill: contributeMode ? WHITE : BLACK,
    },
  ];

  const cardData = [
    {
      icon: "reefDocsCoralType",
      label: "Type",
      value: data?.type || state?.data?.type,
      definition: "coral_type",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_type"),
    },
    {
      icon: "reefDocsCoralGrowthForm",
      label: "Growth Form",
      value: growthForm,
      definition: "coral_growth_form",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_growth_form"),
    },
    {
      icon: "reefDocsCoralRegionOfOrigin",
      label: "Region of Origin",
      value: regionOfOrigin,
      onPressEnabled: false,
      votable: false,
    },
    {
      icon: "reefDocsCoralAquaCulture",
      label: "Aqua Culture",
      value: canAquaCulture,
      onPressEnabled: false,
      votable: false,
    },
    {
      icon: "reefDocsCoralCareLevel",
      label: "Care Level",
      value: data?.care_level,
      definition: "coral_care_level",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_care_level"),
    },
    {
      icon: "reefDocsCoralAggression",
      label: "Aggression Level",
      value: data?.aggression_level,
      extraData: data?.aggression_level_extra,
      definition: "livestock_tank_limit",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_aggression_level"),
    },
    {
      icon: "reefDocsCoralPlacement",
      label: "Placement",
      value: data?.placement,
      definition: "coral_placement",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_placement"),
    },

    {
      icon: "reefDocsCoralLighting",
      label: "Lighting",
      value: data?.lighting,
      onPressEnabled: contributeMode,
      definition: "coral_lighting_level",
      onPress: () => handleOpenLiveStockModal("coral_lighting_level"),
    },
    {
      icon: "reefDocsCoralFlow",
      label: "Flow",
      value: data?.flow,
      definition: "coral_flow_rate",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_flow_rate"),
    },
    {
      icon: "reefDocsTesting",
      label: "Salinity",
      value: `${data?.salinity?.min} - ${data?.salinity?.max} ppt`,
      onPressEnabled: false,
      votable: false,
    },

    {
      icon: "reefDocsTesting",
      label: "Alkalinity",
      value: `${data?.alkalinity?.min} - ${data?.alkalinity?.max}`,
      onPressEnabled: false,
      votable: false,
    },
    {
      icon: "reefDocsTesting",
      label: "Calcium",
      value: `${data?.calcium?.min} - ${data?.calcium?.max}`,
      onPressEnabled: false,
      votable: false,
    },
    {
      icon: "reefDocsTesting",
      label: "Magnesium",
      value: `${data?.magnesium?.min} - ${data?.magnesium?.max}`,
      onPressEnabled: false,
      votable: false,
    },
    {
      icon: "reefDocsCoralTemperature",
      label: "Temperature",
      value: `${data?.temperature?.min} - ${data?.temperature?.max}`,
      onPressEnabled: false,
      votable: false,
    },
    {
      icon: "reefDocsCoralTargetFeeding",
      label: "Target Feeding",
      value: data?.target_feeding,
      definition: "coral_target_feeding",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_target_feeding"),
    },

    {
      icon: "reefDocsCoralSweeper",
      label: "Sweeper Tent",
      value: data?.sweeper_tentacles,
      definition: "coral_sweeper_tentacles",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_sweeper_tentacles"),
    },
    {
      icon: "reefDocsCoralGrowthRate",
      label: "Growth Rate",
      value: data?.growth_rate,
      definition: "coral_growth_rate",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_growth_rate"),
    },
    {
      icon: "reefDocsFragging",
      label: "Frag Difficulty",
      value: data?.fragging_difficulty,
      definition: "coral_fragging_difficulty",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_fragging_difficulty"),
    },
    {
      icon: "reefDocsPhotosynthetic",
      label: "Photosynthetic",
      value: data?.photosynthetic,
      definition: "coral_photosynthetic",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("coral_photosynthetic"),
    },
    {
      icon: "reefDocsCoralStressIndicator",
      label: "Stress Indicators",
      value: data?.stress_indicators?.length,
      extraData: `Some stress indicators to watch out for. This is a guide only.
            ${data?.stress_indicators?.map((item) => `\n- ${item}`)}
          `,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsCoralPests",
      label: "Pests",
      value: data?.pest_susceptibility?.length,
      extraData: `Some pests to watch out for. This is a guide only.
            ${data?.pest_susceptibility?.map((item) => `\n- ${item}`)}
          `,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsCoralDiseaseIndicator",
      label: "Diseases",
      value: data?.disease_susceptibility?.length,
      extraData: `Some diseases to watch out for. This is a guide only.
            ${data?.disease_susceptibility?.map((item) => `\n- ${item}`)}
          `,
      onPressEnabled: false,
      notVotable: true,
    },
  ];

  const cardGroups = chunkArray(cardData, 4);

  const topSectionButtons =
    getAppEnv() !== "production"
      ? buttons
      : buttons?.filter((item) => item.icon !== "reefDocsVideo");

  return { cardGroups, topSectionButtons };
};

export const generatePlantData = (
  handleOpenLiveStockModal,
  setContributeMode,
  contributeMode,
  state,
  data,
  openModal,
  id
) => {
  const handleToggleContributionModal = () => {
    Vibration.vibrate();
    setContributeMode((prevState) => !prevState);
  };

  const { growthForm, regionOfOrigin, canAquaCulture } =
    getLiveStockPreLoadedData(state, data);

  const buttons = [
    {
      icon: "reefDocsPlantCamera",
      onPress: () =>
        openModal({
          type: "liveStockProfileUserPhotosModal",
          height: "large",
          modalTitle: "Community Photos",
          data: {
            liveStockId: id,
            icon: "reefDocsPlantCamera",
          },
        }),
      iconFill: BLACK,
      backgroundColor: WHITE,
    },
    {
      icon: "reefDocsPlantVideo",
      onPress: () =>
        openModal({
          type: "liveStockProfileUserVideosModal",
          height: "large",
          modalTitle: "Reefer Videos",
          data: {
            icon: "reefDocsPlantVideo",
          },
        }),
      iconFill: BLACK,
      backgroundColor: WHITE,
    },
    {
      icon: "reefDocsPlantComment",
      onPress: () =>
        openModal({
          type: "liveStockProfileUserExperienceModal",
          height: "large",
          modalTitle: "Community Experiences",
          data: {
            liveStockId: id,
            icon: "reefDocsPlantComment",
          },
        }),
      backgroundColor: WHITE,
      iconFill: BLACK,
    },
    {
      icon: "reefDocsPlantInformation",
      onPress: () => handleToggleContributionModal(),
      backgroundColor: contributeMode ? REEF_DOCS_BLUE : WHITE,
      iconFill: contributeMode ? WHITE : BLACK,
    },
  ];

  const cardData = [
    {
      icon: "reefDocsPlantType",
      label: "Type",
      value: data?.type || state?.data?.type,
      definition: "plant_type",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("plant_type"),
    },
    {
      icon: "reefDocsPlantGrowthForm",
      label: "Growth Form",
      value: growthForm,
      definition: "plant_growth_form",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("plant_growth_form"),
    },
    {
      icon: "reefDocsPlantRegionOfOrigin",
      label: "Region of Origin",
      value: regionOfOrigin,
      onPressEnabled: false,
      votable: false,
    },
    {
      icon: "reefDocsPlantAquaCulture",
      label: "Aqua Culture",
      value: canAquaCulture,
      onPressEnabled: false,
      votable: false,
    },
    {
      icon: "reefDocsPlantCareLevel",
      label: "Care Level",
      value: data?.care_level,
      definition: "plant_care_level",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("plant_care_level"),
    },
    {
      icon: "reefDocsPlantLighting",
      label: "Lighting",
      value: data?.lighting,
      onPressEnabled: contributeMode,
      definition: "plant_lighting_level",
      onPress: () => handleOpenLiveStockModal("plant_lighting_level"),
    },
    {
      icon: "reefDocsTesting",
      label: "Alkalinity",
      value: `${data?.alkalinity?.min} - ${data?.alkalinity?.max}`,
      onPressEnabled: false,
      votable: false,
    },
    {
      icon: "reefDocsPlantTemperature",
      label: "Temperature",
      value: `${data?.temperature?.min} - ${data?.temperature?.max}`,
      onPressEnabled: false,
      votable: false,
    },
    {
      icon: "reefDocsPlantGrowthRate",
      label: "Growth Rate",
      value: data?.growth_rate,
      definition: "plant_growth_rate",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("plant_growth_rate"),
    },
    {
      icon: "reefDocsPlantStressIndicator",
      label: "Stress Indicators",
      value: data?.stress_indicators?.length,
      extraData: `Some stress indicators to watch out for. This is a guide only.
            ${data?.stress_indicators?.map((item) => `\n- ${item}`)}
          `,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsFriendOrFoe",
      label: "Pests",
      value: data?.pest_susceptibility?.length,
      extraData: `Some pests to watch out for. This is a guide only.
            ${data?.pest_susceptibility?.map((item) => `\n- ${item}`)}
          `,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsPlantDiseaseIndicator",
      label: "Diseases",
      value: data?.disease_susceptibility?.length,
      extraData: `Some diseases to watch out for. This is a guide only.
            ${data?.disease_susceptibility?.map((item) => `\n- ${item}`)}
          `,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsPlantFeatures",
      label: "Features",
      value: data?.highlight_features?.length,
      extraData: `Highlight Features. This is a guide only.
            ${data?.highlight_features?.map((item) => `\n- ${item}`)}
          `,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsPlantCo2",
      label: "Difficult w/o CO2",
      value: data?.difficulty_without_co2,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsPlantLeafShape",
      label: "Leaf Shape",
      value: data?.leaf_shape,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsPlantEmergentGrowth",
      label: "Emergent Growth",
      value: data?.emergent_growth_possible === true ? "Yes" : "No",
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsPlantCanFloat",
      label: "Can Float",
      value: data?.can_float,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsPlantCo2",
      label: "Co2 Requirement",
      value: data?.co2_requirement,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsPlantSubstrate",
      label: "Substrate",
      value: data?.substrate_requirement,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsPlantPlacement",
      label: "Placement",
      value: data?.placement,
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsPlantFamily",
      label: "Family",
      value: data?.family_common,
      onPressEnabled: false,
      notVotable: true,
    },
  ];

  const cardGroups = chunkArray(cardData, 4);

  const topSectionButtons =
    getAppEnv() !== "production"
      ? buttons
      : buttons?.filter((item) => item.icon !== "reefDocsVideo");

  return { cardGroups, topSectionButtons };
};
