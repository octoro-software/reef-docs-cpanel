import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";

import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  Transforms3d,
  vec,
  Skia,
} from "@shopify/react-native-skia";

import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";

import { Grid, Icon, LoadingSpinner, Text } from "../../components";
import { REEF_DOCS_BLUE, WHITE } from "../../constants";
import { useModal } from "../../hooks/useModal";
import { createAppDate } from "../../utility/date";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  selectChartData,
  selectDosageData,
  setChartData,
  setDosageData,
} from "../../store/slices/testingSlice";
import apiClient from "../../api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_HEIGHT = 250;
const CHART_WIDTH = SCREEN_WIDTH - 30;
const INDICATOR_OUTER_RADIUS = 10;

export const TestHistoryChart = ({
  elementId,
  measurementUnit,
  elementName,
  activeTab,
}) => {
  const dispatch = useAppDispatch();

  const isDosing = activeTab === "Dosing";

  const [activeTimeframe, setActiveTimeframe] = useState("1Y");
  const [loading, setLoading] = useState(true);
  const [currentDosage, setCurrentDosage] = useState("");
  const [currentDosageData, setCurrentDosageData] = useState([]);

  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentComment, setCurrentComment] = useState<string>("");
  const [priceChange, setPriceChange] = useState<number | null>(null);

  const chartData = useAppSelector(selectChartData);

  const dosageData = useAppSelector(selectDosageData);

  const getHistoricResults = async () => {
    setLoading(true);

    const tankId = await AsyncStorage.getItem("tankId");

    const response = await apiClient.post("/tests/elementGraphHistory", {
      elementId,
      tankId,
      months: 12,
    });

    const results = response?.data?.data?.history || [];

    dispatch(setChartData(results));

    const dosageResults = response?.data?.data?.dosages || [];
    dispatch(setDosageData(dosageResults));

    indicatorXIndex.value = results.length > 0 ? results.length - 1 : 0;

    setLoading(false);
  };

  const activeData = isDosing ? dosageData : chartData;

  useEffect(() => {
    if (elementId) {
      getHistoricResults();
    }
  }, [elementId]);

  const indicatorXIndex = useSharedValue<number>(0);

  const timeframes = ["1M", "2M", "3M", "6M", "1Y"];

  useEffect(() => {
    if (activeData.length > 1) {
      const lastTest = activeData[activeData.length - 1];
      const prevTest = activeData[activeData.length - 2];

      setPriceChange(lastTest.result - prevTest.result);
      setCurrentPrice(lastTest.result);
      setCurrentDate(lastTest.testDate);

      const currentDosageData = dosageData.filter((d) => {
        const dTime = new Date(d.dosageDate).getTime();
        const prevTime = new Date(prevTest.testDate).getTime();
        const lastTime = new Date(lastTest.testDate).getTime();
        // only include dosages after the previous test, but strictly before the current test
        return dTime >= prevTime && dTime < lastTime;
      });

      // ✅ Add this block to compute total dosage between prevTest and lastTest
      const totalDosage = currentDosageData.reduce(
        (sum, d) => sum + (d.result || 0),
        0
      );

      setCurrentDosage(totalDosage > 0 ? totalDosage.toFixed(2) : null);

      setCurrentDosageData(currentDosageData);
    } else if (activeData.length === 1) {
      const onlyTest = activeData[0];
      setPriceChange(null);
      setCurrentPrice(onlyTest.result);
      setCurrentDate(onlyTest.testDate);
      setCurrentDosage(null);
      setCurrentDosageData([]);
    } else {
      setPriceChange(null);
      setCurrentPrice(0);
      setCurrentDate("");
      setCurrentDosage(null);
      setCurrentDosageData([]);
    }
  }, [activeData, dosageData]);

  const handleTimeframeSelect = async (tf: string) => {
    setActiveTimeframe(tf);
    const monthsMap = {
      "1M": 1,
      "2M": 2,
      "3M": 3,
      "6M": 6,
      "1Y": 12,
    };
    const months = monthsMap[tf] || 1;

    const tankId = await AsyncStorage.getItem("tankId");

    const response = await apiClient.post("/tests/elementGraphHistory", {
      elementId,
      tankId,
      months,
    });

    const newData: { result: number; testDate: string }[] =
      response?.data?.data?.history || [];

    setChartData(newData);

    setDosageData(response?.data?.data?.dosages || []);

    indicatorXIndex.value = newData.length > 0 ? newData.length - 1 : 0;

    if (newData.length > 0) {
      setCurrentPrice(newData[newData.length - 1].result);
      setCurrentDate(newData[newData.length - 1].testDate);
      setCurrentComment(newData[newData.length - 1]?.testAction);
      if (newData.length > 1) {
        setPriceChange(
          newData[newData.length - 1].result -
            newData[newData.length - 2].result
        );
      } else {
        setPriceChange(null);
      }
    } else {
      setCurrentPrice(0);
      setCurrentDate("");
      setCurrentComment("");
      setPriceChange(null);
    }
  };

  const { path, areaPath, points } = useMemo(() => {
    const data = activeData?.map((item) => item.result);
    if (!data || data.length === 0) {
      return {
        path: Skia.Path.Make(),
        areaPath: Skia.Path.Make(),
        points: [],
      };
    }

    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    const yPadding =
      (dataMax - dataMin) * 0.1 ||
      (dataMax === 0 ? 0.5 : 0.1 * Math.abs(dataMax) || 0.5);
    const currentMinY = dataMin - yPadding;
    const currentMaxY = dataMax + yPadding;
    const yRange = currentMaxY - currentMinY || 1;

    const drawableWidth = CHART_WIDTH - 2 * INDICATOR_OUTER_RADIUS;

    const localPoints = activeData.map((item, index) => {
      let x: number;
      if (activeData.length === 1) {
        x = CHART_WIDTH / 2;
      } else {
        x =
          INDICATOR_OUTER_RADIUS +
          (index / (activeData.length - 1)) * drawableWidth;
      }
      const y =
        CHART_HEIGHT - ((item.result - currentMinY) / yRange) * CHART_HEIGHT;
      return {
        x,
        y,
        price: item.result,
        testDate: item.testDate ?? item?.dosageDate,
        testAction: item?.test?.testAction,
      };
    });

    const skPath = Skia.Path.Make();
    const skAreaPath = Skia.Path.Make();

    if (localPoints.length === 0) {
    } else if (localPoints.length === 1) {
      const point = localPoints[0];
      skPath.addCircle(point.x, point.y, 2.5);
      skAreaPath.addCircle(point.x, point.y, 2.5);
    } else {
      skPath.moveTo(localPoints[0].x, localPoints[0].y);
      for (let i = 1; i < localPoints.length; i++) {
        skPath.lineTo(localPoints[i].x, localPoints[i].y);
      }
      skAreaPath.addPath(skPath.copy());
      skAreaPath.lineTo(localPoints[localPoints.length - 1].x, CHART_HEIGHT);
      skAreaPath.lineTo(localPoints[0].x, CHART_HEIGHT);
      skAreaPath.close();
    }
    return { path: skPath, areaPath: skAreaPath, points: localPoints };
  }, [activeData]);

  const indicatorSkX = useSharedValue<number>(0);
  const indicatorSkY = useSharedValue<number>(0);

  useAnimatedReaction(
    () => ({ index: indicatorXIndex.value, chartPoints: points }),
    (currentData) => {
      if (currentData.chartPoints && currentData.chartPoints.length > 0) {
        const clampedIndex = Math.max(
          0,
          Math.min(Math.round(currentData.index), activeData.length - 1)
        );

        const point = currentData.chartPoints[clampedIndex];
        if (point) {
          indicatorSkX.value = point.x;
          indicatorSkY.value = point.y;
          runOnJS(setCurrentPrice)(point.price);
          runOnJS(setCurrentDate)(point.testDate);
          runOnJS(setCurrentComment)(point?.testAction);

          const prev = currentData.chartPoints[clampedIndex - 1]?.price;
          runOnJS(setPriceChange)(
            prev !== undefined ? point.price - prev : null
          );

          // ✅ Add dosage accumulation
          if (activeData.length > 1 && clampedIndex >= 1) {
            const lastTest = activeData[clampedIndex]; // test the user is on
            const prevTest = activeData[clampedIndex - 1]; // previous test

            const dosageDataDates = dosageData.filter((d) => {
              const dTime = new Date(d.dosageDate).getTime();
              const prevTime = new Date(prevTest.testDate).getTime();
              const lastTime = new Date(lastTest.testDate).getTime();
              return dTime >= prevTime && dTime < lastTime;
            });

            const totalDosage = dosageDataDates.reduce(
              (sum, d) => sum + (d.result || 0),
              0
            );

            runOnJS(setCurrentDosage)(
              totalDosage > 0 ? totalDosage.toFixed(2) : null
            );
            runOnJS(setCurrentDosageData)(dosageDataDates);
          } else {
            runOnJS(setCurrentDosage)(null);
            runOnJS(setCurrentDosageData)([]);
          }
        }
      } else {
        indicatorSkX.value = CHART_WIDTH / 2;
        indicatorSkY.value = CHART_HEIGHT / 2;
        runOnJS(setCurrentPrice)(0);
        runOnJS(setCurrentDate)("");
        runOnJS(setCurrentComment)("");
        runOnJS(setPriceChange)(null);
        runOnJS(setCurrentDosage)(null);
        runOnJS(setCurrentDosageData)([]);
      }
    },
    [points, activeData, dosageData]
  );

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (points.length <= 1) return;
      const relativeX = event.x - INDICATOR_OUTER_RADIUS;
      const activeDrawableWidth = CHART_WIDTH - 2 * INDICATOR_OUTER_RADIUS;
      if (activeDrawableWidth <= 0) return;
      let newIndex =
        (relativeX / activeDrawableWidth) * (activeData.length - 1);
      newIndex = Math.max(0, Math.min(newIndex, activeData.length - 1));
      indicatorXIndex.value = newIndex;
    })
    .onEnd(() => {
      if (points.length <= 1) return;
      indicatorXIndex.value = Math.round(indicatorXIndex.value);
    });

  const indicatorTransform = useSharedValue<Transforms3d>([]);

  useAnimatedReaction(
    () => ({ x: indicatorSkX.value, y: indicatorSkY.value }),
    ({ x, y }) => {
      indicatorTransform.value = [
        { translateX: x },
        { translateY: y },
      ] as Transforms3d;
    },
    []
  );

  const lineShaderColors = [
    "#FF8C00",
    "#FFD700",
    "#ADFF2F",
    "#00CED1",
    "#1E90FF",
  ];
  const lineShaderPositions = [0, 0.25, 0.5, 0.75, 1];

  const lineGradientStart = vec(INDICATOR_OUTER_RADIUS, CHART_HEIGHT / 2);
  const lineGradientEnd = vec(
    CHART_WIDTH - INDICATOR_OUTER_RADIUS,
    CHART_HEIGHT / 2
  );

  const { openModal } = useModal();

  const handleDosingPress = () => {
    const richText = `<p>The dosing history between the current point and the previous point. </p> </br><ul>${currentDosageData
      .reverse()
      .map((d) => {
        const date = createAppDate(d.dosageDate);
        const value = d.result ?? 0;
        return `<li> ${date} – ${value}ml</li>`;
      })
      .join("\n")}</ul> `;

    openModal({
      type: "richTextModal",
      modalTitle: "Dose History",
      height: "small",
      data: {
        richText,
      },
    });
  };

  const handleCommentPress = () => {
    openModal({
      type: "richTextModal",
      modalTitle: "Test Action",
      height: "small",
      data: {
        richText: currentComment,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{elementName} </Text>
        {isDosing ? (
          <Text style={{ color: WHITE }}>(Dosing)</Text>
        ) : (
          <Text style={{ color: WHITE }}>({measurementUnit})</Text>
        )}
      </View>
      {!!currentDate ? (
        <Text style={{ textAlign: "center", color: WHITE, marginBottom: 6 }}>
          {createAppDate(currentDate)}
        </Text>
      ) : (
        <Text
          style={{ textAlign: "center", color: WHITE, marginBottom: 6 }}
        ></Text>
      )}

      <Grid
        direction="row"
        style={{ height: 50 }}
        alignItems="center"
        gap={16}
        justifyContent="center"
      >
        {currentComment && (
          <TouchableOpacity
            onPress={handleCommentPress}
            style={{
              alignItems: "center",
              height: 50,
            }}
          >
            <Icon
              name="reefDocsComment"
              fill={WHITE}
              strokeFill={WHITE}
              width={32}
            />
          </TouchableOpacity>
        )}
        {currentDosage && (
          <TouchableOpacity
            onPress={handleDosingPress}
            style={{
              alignItems: "center",
            }}
          >
            <Grid direction="row" alignItems="center" gap={8}>
              <Icon
                width={24}
                height={24}
                fill={REEF_DOCS_BLUE}
                name="droplet"
              />
              <Text style={{ color: WHITE }}>{currentDosage} ml</Text>
            </Grid>
          </TouchableOpacity>
        )}
      </Grid>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>
          {currentPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          {isDosing && " ml"}
        </Text>
        <View style={{ height: 22, justifyContent: "center" }}>
          {priceChange !== null && (
            <Text
              style={[
                styles.priceChangeText,
                priceChange >= 0 ? styles.priceUp : styles.priceDown,
              ]}
            >
              {priceChange.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                signDisplay: "exceptZero", // shows "+" or "-" automatically
              })}
              {isDosing && " ml"}
            </Text>
          )}
        </View>
      </View>
      <GestureDetector gesture={panGesture}>
        <View style={styles.chartWrapper}>
          {!loading ? (
            <Canvas style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
              {points && points.length > 0 && (
                <>
                  <Path path={areaPath} style="fill">
                    <LinearGradient
                      start={vec(CHART_WIDTH / 2, 0)}
                      end={vec(CHART_WIDTH / 2, CHART_HEIGHT)}
                      colors={[
                        "rgba(0, 255, 163, 0.2)",
                        "rgba(0, 255, 163, 0)",
                      ]}
                    />
                  </Path>
                  <Path
                    path={path}
                    style="stroke"
                    strokeWidth={3}
                    strokeJoin="round"
                    strokeCap="round"
                  >
                    <LinearGradient
                      start={lineGradientStart}
                      end={lineGradientEnd}
                      colors={lineShaderColors}
                      positions={lineShaderPositions}
                    />
                  </Path>
                </>
              )}
              {points && points.length > 0 && (
                <Group transform={indicatorTransform}>
                  <Circle
                    cx={0}
                    cy={0}
                    r={INDICATOR_OUTER_RADIUS}
                    color="rgba(255, 255, 255, 0.5)"
                  />
                  <Circle cx={0} cy={0} r={5} color="#FFD700" />
                </Group>
              )}
            </Canvas>
          ) : (
            <LoadingSpinner width={200} />
          )}
        </View>
      </GestureDetector>
      <View style={styles.timeframeSelector}>
        {timeframes.map((tf) => (
          <TouchableOpacity
            key={tf}
            style={[
              styles.timeframeButton,
              activeTimeframe === tf && styles.activeTimeframeButton,
            ]}
            onPress={() => handleTimeframeSelect(tf)}
          >
            <Text
              style={[
                styles.timeframeText,
                activeTimeframe === tf && styles.activeTimeframeText,
              ]}
            >
              {tf}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#12121A",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginRight: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  balanceContainer: {
    alignItems: "center",
    marginVertical: 14,
  },
  balanceText: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "bold",
  },
  priceChangeText: {
    fontSize: 16,
  },
  priceUp: {
    color: "#00FFA3",
  },
  priceDown: {
    color: "#FF4747",
  },
  chartWrapper: {
    alignItems: "center",
    marginVertical: 20,
    height: CHART_HEIGHT,
    width: CHART_WIDTH,
  },
  timeframeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 25,
    backgroundColor: "#1E1B2E",
    borderRadius: 10,
    padding: 5,
    maxWidth: 600,
    alignSelf: "center",
  },
  timeframeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeTimeframeButton: {
    backgroundColor: REEF_DOCS_BLUE,
  },
  timeframeText: {
    color: "#AAA",
    fontWeight: "600",
  },
  activeTimeframeText: {
    color: WHITE,
    fontWeight: "bold",
  },
});
