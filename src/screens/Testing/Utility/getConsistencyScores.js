export const getStabilityConsistencyText = (consistency) => {
  if (consistency === null) {
    return `<p>Stability consistency not available</p>`;
  }

  if (consistency >= 80) {
    return `<p>Your stability consistency is great!</p>`;
  } else if (consistency >= 50) {
    return `<p>Your stability consistency for the month has room for improvement.</p>`;
  } else {
    return `<p>Your stability consistency for the month is low.</p>`;
  }
};
export const getRangeConsistencyText = (consistency) => {
  if (consistency === null) {
    return `<p>Range consistency not available</p>`;
  }

  if (consistency >= 80) {
    return `<p>Your range consistency is great!</p>`;
  } else if (consistency >= 50) {
    return `<p>Your range consistency for the month has room for improvement.</p>`;
  } else {
    return `<p>Your range consistency for the month is low.</p>`;
  }
};
export const getTargetConsistencyText = (consistency) => {
  if (consistency === null) {
    return `<p>Target consistency not available</p>`;
  }

  if (consistency >= 80) {
    return `<p>Your target consistency for the month is great!</p>`;
  } else if (consistency >= 50) {
    return `<p>Your target consistency for the month has room for improvement.</p>`;
  } else {
    return `<p>Your target consistency for the month is low.</p>`;
  }
};

export const getConsistencyScores = (data, chosenElement) => {
  const values = data
    ?.map((d) => d?.result)
    .filter((v) => typeof v === "number");

  const rangeLow = chosenElement?.element?.rangeLow;
  const rangeHigh = chosenElement?.element?.rangeHigh;

  // Optional: Define a target value. If not provided, use midpoint of the range.
  const target =
    chosenElement?.element?.target ??
    (rangeLow != null && rangeHigh != null ? (rangeLow + rangeHigh) / 2 : null);

  let rangeConsistency = null;
  let targetConsistency = null;
  let stabilityConsistency = null;

  if (values && values.length > 0) {
    // ----- 1️⃣ Range Consistency -----
    const inRangeCount = values.filter(
      (v) => v >= rangeLow && v <= rangeHigh
    ).length;
    rangeConsistency = Math.round((inRangeCount / values.length) * 100);

    // ----- 2️⃣ Target Consistency -----
    if (target != null) {
      const deviations = values.map((v) => Math.abs(v - target));
      const avgDeviation =
        deviations.reduce((a, b) => a + b, 0) / deviations.length;

      // You could normalize based on range size
      const maxPossibleDeviation =
        Math.max(Math.abs(rangeLow - target), Math.abs(rangeHigh - target)) ||
        1; // avoid dividing by zero

      const deviationScore = 100 - (avgDeviation / maxPossibleDeviation) * 100;
      targetConsistency = Math.max(
        0,
        Math.min(100, Math.round(deviationScore))
      );
    }

    // ----- 3️⃣ Stability Consistency -----
    if (values.length > 1) {
      const min = Math.min(...values);
      const max = Math.max(...values);

      const spread = max - min;
      const spreadScore = 100 - spread * 10; // multiplier can be tuned
      stabilityConsistency = Math.max(
        0,
        Math.min(100, Math.round(spreadScore))
      );
    } else {
      stabilityConsistency = 100; // if only one value, technically perfect stability
    }
  }

  return {
    rangeConsistency,
    targetConsistency,
    stabilityConsistency,
  };
};
