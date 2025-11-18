export type LiveStockProfileApiResponse = {
  data: LiveStockProfile;
};

export type LiveStockProfile = {
  _id: string;
  id: string;
  special_requirements: string;
  can_be_tank_bred: boolean;
  recommended_dkh_level: {
    min: number;
    max: number;
  };
  behaviour_insights: string;
  reef_safe_extra: string;
  temperament_extra: string;
  recommended_tank_salinity: {
    min: number;
    max: number;
  };
  hardy: boolean;
  description: string;
  coral_safe: boolean;
  tank_limit_extra_data: string;
  coral_risk: string[];
  recommended_ph_level: {
    min: number;
    max: number;
  };
  is_invert: boolean;
  aquascaping_needs: string;
  quaranteen_recommendations: string;
  tank_mate_recommendations: string[];
  tank_limit: number;
  diet: string;
  tank_size_recommendation_gallons: number;
  fish_risk: string[];
  stress_indicators: string[];
  country_place_of_origin: string;
  expected_life_span_in_a_tank: {
    min: number;
    max: number;
  };
  diseases: string[];
  max_size_centermeters: number;
  scientific_name: string;
  lighting_needs: string;
  diet_extra_data: string;
  fish_type_family: string;
  recommended_tank_temperature: {
    max_degrees_c: number;
    min_degrees_c: number;
    max_farenheight: number;
    min_farenheight: number;
  };
  alternate_names: string[];
  habitat_enrichments: string[];
  invert_safe: boolean;
  water_flow: string[];
  temperament: string;
  feeding_frequency: {
    min: number;
    max: number;
    frequency_min: string;
  };
  care_level: string;
  name: string;
  substrate_preference: string;
  tank_size_recommendation_litres: number;
  reef_safe: boolean;
  invert_risk: string[];
  images: string[];
  updated_at: string;
  fish_type_family_common: string;
  deleted_at?: {
    $date: {
      $numberLong: string;
    };
  };
};
