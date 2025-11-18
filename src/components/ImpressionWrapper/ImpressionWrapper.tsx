import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { InView } from "react-native-intersection-observer";

import { useImpressRequest } from "../../hooks/useImressionRequest";

const ImpressionWrapper = ({ location, promo, children }) => {
  const [hasFired, setHasFired] = useState(false);

  const [postImpression] = useImpressRequest();

  const handleChange = useCallback(
    (isVisible) => {
      if (isVisible && !hasFired) {
        setHasFired(true);
        postImpression({ location, promo });
      }
    },
    [hasFired]
  );

  return (
    <InView onChange={handleChange}>
      <View>{children}</View>
    </InView>
  );
};

export default ImpressionWrapper;
