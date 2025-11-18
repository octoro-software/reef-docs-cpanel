import React from "react";
import { StandardOptions } from "./Components/StandardOptions";
import { SizeOption } from "./Components/SizeOption";
import { ColourPickerOption } from "./Components/ColourPickerOption";
import { StoresOption } from "./Components/StoresOption";

export const OptionRegistry = ({ definition, ...rest }) => {
  const options = {
    option: StandardOptions,
    custom_filter_min_tank_size: (props) => (
      <SizeOption {...props} type="custom_filter_min_tank_size" />
    ),
    custom_filter_max_size: (props) => (
      <SizeOption {...props} type="custom_filter_max_size" />
    ),
    custom_filter_colour_picker: (props) => (
      <ColourPickerOption {...props} type="custom_filter_colour_picker" />
    ),
    stores: (props) => <StoresOption {...props} type="shopId" />,
  };

  const OptionComponent = options[definition];

  if (!OptionComponent) {
    return null;
  }

  return <OptionComponent definition={definition} {...rest} />;
};
