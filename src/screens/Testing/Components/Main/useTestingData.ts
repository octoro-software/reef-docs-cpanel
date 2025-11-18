import { useAppSelector } from "../../../../hooks/useRedux";
import { selectElements } from "../../../../store/slices/IcpSlice";

type TestType = "homeTest" | "icpTest" | "ndoc" | "all";

export const useTestingData = ({
  data,
  testType,
  grouped = false,
}: {
  data: any[];
  testType: TestType;
  grouped?: boolean;
}) => {
  const elements = useAppSelector(selectElements);

  // Filter based on test type
  const localData = data?.filter((item) =>
    testType === "homeTest"
      ? item?.home
      : testType === "icpTest"
      ? item?.icp
      : testType === "ndoc"
      ? item?.ndoc
      : item
  );

  // Enrich with element data
  const enrichedData = localData?.map((item) => {
    const element = elements?.find((el) => el.id === item?.elementId);
    return {
      ...item,
      element: element ? { ...element, name: element.name } : null,
    };
  });

  // If not grouped, return as-is
  if (!grouped) {
    return enrichedData;
  }

  // Group by element.groupName
  const groupedData: { group: string; records: typeof enrichedData }[] = [];

  enrichedData?.forEach((item) => {
    const groupName = item.element?.groupName || "Ungrouped";
    const existingGroup = groupedData.find((g) => g.group === groupName);
    if (existingGroup) {
      existingGroup.records.push(item);
    } else {
      groupedData.push({ group: groupName, records: [item] });
    }
  });

  return groupedData;
};
