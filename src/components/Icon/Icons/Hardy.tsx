import React from 'react';
import {Path, Svg} from 'react-native-svg';

export const Hardy = ({width = 48, height = 48, fill = '#e8eaed'}) => {
  return (
    <Svg height={height} viewBox="0 0 48 48" width={width} fill={fill}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18.1875 10.25H22.3943L27.3262 31.7711L30.1588 21.25H41.5V24.75H32.8412L29.3412 37.75H25.1057L20.1367 16.0671L17.3125 25.75H7V22.25H14.6875L18.1875 10.25Z"
        fill="#1E1E1E"
      />
    </Svg>
  );
};
