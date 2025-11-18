export const calculateAverageTarget = (data) => {
  const deviations = data
    .map(({ element, result }) => {
      const { target } = element;
      if (target > 0) {
        // Avoid division by zero
        return ((result - target) / target) * 100;
      }
      return null;
    })
    .filter((p) => p !== null); // Remove invalid values

  const averageDeviation = deviations.length
    ? deviations.reduce((sum, p) => sum + p, 0) / deviations.length
    : 0;

  return averageDeviation.toFixed(2);
};
