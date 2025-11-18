import React, { Fragment, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import {
  AppImage,
  Grid,
  Heading,
  ModalComposition,
  Text,
} from "../../../components";

import { useUser } from "../../../hooks/useAuth";

import { createAppDate } from "../../../utility/date";
import { getTankVolumeForUser } from "../../../utility/liquidUnitSelector";

import { REEF_DOCS_BLUE, WHITE } from "../../../constants";
import { getAppDimensions } from "../../../utility/dimensions";
import { useGetPostSharedTank } from "../../../hooks/usePosts";
import { useAudience } from "../../../hooks/useAudience";

const width = getAppDimensions().width;

export const UserPostShareTankModal = ({ postId }) => {
  const [tankSnapshot, setTankSnapshot] = useState({});

  const [getTankData] = useGetPostSharedTank();

  const handleGetTankData = async () => {
    const response = await getTankData(postId);

    if (response?.data) {
      setTankSnapshot(response.data);
    }
  };

  const { isFresh } = useAudience();

  const setupDate = createAppDate(tankSnapshot?.setupDate);

  const user = useUser();

  const volumeLabel = getTankVolumeForUser(user?.liquidUnit, tankSnapshot);

  useEffect(() => {
    handleGetTankData();
  }, []);

  return (
    <ModalComposition disableScroll={false}>
      <Grid direction="column" gap={8} style={styles.container}>
        <Heading variant={4} weight="semiBold" style={styles.heading}>
          {tankSnapshot?.name}
        </Heading>

        <Text style={styles.heading}>{volumeLabel}</Text>

        <Text style={styles.heading}>Setup Date: {setupDate}</Text>

        <AppImage
          path={tankSnapshot?.image}
          width={width - 32}
          height={200}
          style={styles.tankImage}
          transform={false}
        />

        {tankSnapshot?.livestock?.livestock?.length > 0 && (
          <>
            <Heading variant={5} weight="semiBold" style={styles.sectionTitle}>
              Fish
            </Heading>

            <SliderComponent items={tankSnapshot?.livestock?.livestock} />
          </>
        )}

        {tankSnapshot?.livestock?.inverts?.length > 0 && (
          <>
            <Heading variant={5} weight="semiBold" style={styles.sectionTitle}>
              Inverts
            </Heading>

            <SliderComponent items={tankSnapshot?.livestock?.inverts} />
          </>
        )}

        {tankSnapshot?.livestock?.reptiles?.length > 0 && (
          <>
            <Heading variant={5} weight="semiBold" style={styles.sectionTitle}>
              Reptiles
            </Heading>

            <SliderComponent items={tankSnapshot?.livestock?.reptiles} />
          </>
        )}

        {tankSnapshot?.livestock?.amphibians?.length > 0 && (
          <>
            <Heading variant={5} weight="semiBold" style={styles.sectionTitle}>
              Amphibians
            </Heading>

            <SliderComponent items={tankSnapshot?.livestock?.amphibians} />
          </>
        )}

        {tankSnapshot?.livestock?.plants_corals?.length > 0 && (
          <>
            <Heading variant={5} weight="semiBold" style={styles.sectionTitle}>
              {isFresh ? "Plants" : "Corals"}
            </Heading>

            <SliderComponent items={tankSnapshot?.livestock?.plants_corals} />
          </>
        )}

        {tankSnapshot?.equipment && (
          <>
            <EquipmentItem
              label="Substrate"
              value={
                tankSnapshot?.equipment?.environment?.substrate
                  ?.customOptionName ??
                tankSnapshot?.equipment?.environment?.substrate?.optionName
              }
            />

            <EquipmentItem
              label="Rock"
              value={
                tankSnapshot?.equipment?.environment?.rock?.customOptionName ??
                tankSnapshot?.equipment?.environment?.rock?.optionName
              }
            />

            <EquipmentItem
              label="Rock Weight (KG)"
              value={tankSnapshot?.equipment?.environment?.rockWeight}
            />

            <EquipmentList
              title="Lighting"
              items={tankSnapshot?.equipment?.lights}
            />

            <EquipmentList
              title="Pumps"
              items={tankSnapshot?.equipment?.pumps}
            />
            <EquipmentList
              title="Heaters"
              items={tankSnapshot?.equipment?.heaters}
            />
            <EquipmentList
              title="Chillers"
              items={tankSnapshot?.equipment?.chillers}
            />
            <EquipmentList
              title="Reators"
              items={tankSnapshot?.equipment?.reators}
            />
            <EquipmentList
              title="Filter Sock / Roller"
              items={tankSnapshot?.equipment?.filterSockOrRoller}
            />
            <EquipmentList
              title="UV"
              items={tankSnapshot?.equipment?.uvSterilizer}
            />
            <EquipmentList
              title="Dosing Pump"
              items={tankSnapshot?.equipment?.dosingPump}
            />
            <EquipmentList
              title="Skimmer"
              items={tankSnapshot?.equipment?.skimmer}
            />
            <EquipmentList
              title="Auto Top Off"
              items={tankSnapshot?.equipment?.ato}
            />
          </>
        )}
      </Grid>
    </ModalComposition>
  );
};

const SliderComponent = ({ items }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Grid direction="row" gap={16}>
        {items?.map((item, index) => (
          <Grid
            direction="column"
            key={index}
            justifyContent="center"
            alignItems="center"
          >
            <View>
              {item?.count > 1 && (
                <View style={styles.count}>
                  <Text style={styles.countText}>{item?.count}</Text>
                </View>
              )}
              <AppImage
                path={item.images?.[0]?.url}
                width={80}
                height={80}
                style={{ margin: 5, borderRadius: 80 }}
              />
            </View>
            <Text weight="bold">{item?.name}</Text>
            <Text style={{ fontSize: 10 }}>{item?.scientific_name}</Text>
          </Grid>
        ))}
      </Grid>
    </ScrollView>
  );
};

const EquipmentItem = ({ label, value }) => {
  if (!value) return null;

  return (
    <>
      <Heading variant={5} weight="semiBold" style={styles.sectionTitle}>
        {label}
      </Heading>
      <Text>{value}</Text>
    </>
  );
};

const EquipmentList = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <>
      <Heading variant={5} weight="semiBold" style={styles.sectionTitle}>
        {title}
      </Heading>
      {items.map((item, key) => (
        <Fragment key={key}>
          <Text weight="bold">{item?.optionName}</Text>
          <Text>Added: {createAppDate(item?.date)}</Text>
        </Fragment>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    textAlign: "center",
  },
  tankImage: {
    borderRadius: 8,
    resizeMode: "cover",
  },
  sectionTitle: {
    marginVertical: 8,
  },
  count: {
    position: "absolute",
    backgroundColor: REEF_DOCS_BLUE,
    top: 0,
    left: 4,
    width: 24,
    height: 24,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  countText: {
    fontWeight: "bold",
    color: WHITE,
  },
});
