import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-native";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

import {
  useGetLiveStockExperiencePosts,
  useGetLiveStockImageContributions,
  useGetLiveStockPastVotes,
  useGetLiveStockProfile,
} from "../../hooks/useLiveStock";
import { useAppSelector } from "../../hooks/useRedux";
import { useModal } from "../../hooks/useModal";
import { useAddToRecentlyViewed } from "../../hooks/useRecentlyViewed";

import { getAppDimensions } from "../../utility/dimensions";

import { selectLiveStockProfile } from "../../store/slices/liveStockSlice";
import { selectUser } from "../../store/slices/globalSlice";

import { Grid, GridItem, Heading, Icon, Text } from "../../components";
import { LiveStockDataCard } from "../../elements/LiveStockDataCard/LiveStockDataCard";
import { CarouselIndicators } from "../../components/CarouselIndicators/CarouselIndicators";
import { Pill } from "../../components/Pill/Pill";

import { BLACK, REEF_DOCS_BLUE, WHITE } from "../../constants";
import {
  STRUCTURED_CONFIGURATION_LIVESTOCK_CARE_LEVEL_TYPES,
  STRUCTURED_CONFIGURATION_LIVESTOCK_DIET_TYPES,
  STRUCTURED_CONFIGURATION_LIVESTOCK_FEEDING_DIFFICULTY,
  STRUCTURED_CONFIGURATION_LIVESTOCK_HARDY_TYPES,
  STRUCTURED_CONFIGURATION_LIVESTOCK_INVERT_SAFE,
  STRUCTURED_CONFIGURATION_LIVESTOCK_REEF_SAFE_TYPES,
  STRUCTURED_CONFIGURATION_LIVESTOCK_SWIMMING_ZONES,
  STRUCTURED_CONFIGURATION_LIVESTOCK_TEMPERAMENT_TYPES,
} from "../../constants/global";

import { Accordion } from "../../components/Accordion/Accordion";
import {
  getFishSizeForUser,
  getTankSizeForUser,
} from "../../utility/liquidUnitSelector";
import { sendEvent, sendEventOnce } from "../../utility/analytics";
import { Carousel } from "../../elements/Carousel/Carousel";
import { LiveStockProfileCarousel } from "../../components/LiveStockProfileCarousel/LiveStockProfileCarousel";
import { BannerImage } from "../../components/BannerImage/BannerImage";
import { getLiveStockPreLoadedData } from "../../utility/livestock";
import { Skeleton } from "../../components/Skeleton/Skeleton";
import { useAudience } from "../../hooks/useAudience";
import { StructuredConfigurationKey } from "../../store/slices/structuredConfigurationSlice";
import { LiveStockSuggestEdits } from "../../components/LiveStockSuggestEdits/LiveStockSuggestEdits";
import { LiveStockAskQuestion } from "../../components/LiveStockAskQuestion/LiveStockAskQuestion";
import { LiveStockTaggedPosts } from "../../components/LiveStockTaggedPosts/LiveStockTaggedPosts";

const { width } = getAppDimensions();

export const LiveStockProfileScreen: React.FC = () => {
  const user = useAppSelector(selectUser);

  const { isFresh } = useAudience();

  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const [contributeMode, setContributeMode] = useState(false);

  const [addToRecentlyViewed] = useAddToRecentlyViewed();

  const handleAddToRecentlyViewed = async (id) => await addToRecentlyViewed(id);

  const { openModal } = useModal();

  const params = useParams();

  const { state } = useLocation();

  const id = params?.id?.replace(":", "");

  sendEventOnce("LIVESTOCK_PROFILE_VIEW", {
    liveStockId: id,
  });

  const data = useAppSelector(selectLiveStockProfile(id));

  const [getLiveStock] = useGetLiveStockProfile();
  const [getLiveStockImages] = useGetLiveStockImageContributions();
  const [getLiveStockExperiences] = useGetLiveStockExperiencePosts();
  const [getLiveStockPastVotes] = useGetLiveStockPastVotes();

  const handleFetchLiveStockProfile = async () => {
    const response = await getLiveStock(id);

    setLoading(false);

    handleAddToRecentlyViewed(response?.data?.id);

    Promise.all([
      getLiveStockImages(id),
      getLiveStockExperiences(id),
      getLiveStockPastVotes(id),
    ]);
  };

  const handleLiveStockNavigate = (id, item) => {
    navigate(`/livestock/${id}`, {
      state: { data: item },
    });
  };

  const handleToggleContributionModal = () => {
    Vibration.vibrate();
    setContributeMode((prevState) => !prevState);
  };

  const handleOpenNameModal = () => {
    sendEvent("LIVESTOCK_NAME_MODAL", {
      liveStockId: id,
    });

    openModal({
      type: "liveStockNameModal",
      height: "medium",
      modalTitle: "Names",
      data: {
        liveStockId: data?.id,
        name: data?.name,
        scientificName: data?.scientific_name,
        alternateNames: data?.alternate_names,
      },
    });
  };

  const handleOpenLiveStockModal = (option: StructuredConfigurationKey) => {
    if (!contributeMode) return;

    sendEvent("LIVESTOCK_VOTE_MODAL", {
      option,
      liveStockId: data?.id,
    });

    openModal({
      type: "liveStockVoteModal",
      height: "large",
      modalTitle: "Contribute",
      data: {
        option,
        liveStockId: data?.id,
      },
    });
  };

  const topSectionButtons = [
    {
      icon: "reefDocsCamera",
      onPress: () =>
        openModal({
          type: "liveStockProfileUserPhotosModal",
          height: "large",
          modalTitle: isFresh ? "Community Photos" : "Reefer Photos",
          data: {
            liveStockId: id,
          },
        }),
      iconFill: BLACK,
      backgroundColor: WHITE,
    },
    {
      icon: "reefDocsVideo",
      onPress: () =>
        openModal({
          type: "liveStockProfileUserVideosModal",
          height: "large",
          modalTitle: isFresh ? "Community Videos" : "Reefer Videos",
          data: {
            liveStockId: id,
          },
        }),
      iconFill: BLACK,
      backgroundColor: WHITE,
    },
    {
      icon: "reefDocsComment",
      onPress: () =>
        openModal({
          type: "liveStockProfileUserExperienceModal",
          height: "large",
          modalTitle: "Community Experiences",
          data: {
            liveStockId: id,
          },
        }),
      backgroundColor: WHITE,
      iconFill: BLACK,
    },
    {
      icon: "reefDocsContribution",

      onPress: () => handleToggleContributionModal(),
      backgroundColor: contributeMode ? REEF_DOCS_BLUE : WHITE,
      iconFill: contributeMode ? WHITE : BLACK,
    },
  ];

  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width); // Calculate index based on width
    setCurrentIndex(index);
  };

  useEffect(() => {
    handleFetchLiveStockProfile();
  }, [id]);

  const {
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
  } = getLiveStockPreLoadedData(state, data);

  const products = data?.related_products
    ?.map((p) => p?.product)
    .filter((product) => product !== undefined && product !== null);

  const minimumTankSize = getTankSizeForUser(
    user?.liquidUnit,
    data || state?.data
  );

  const maxFishSize = getFishSizeForUser(
    user?.measurementUnit,
    data || state?.data
  );

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const cardData = [
    {
      icon: "reefDocsTemperament",
      label: "Temperament",
      value: data?.temperament || state?.data?.temperament,
      extraData: data?.temperament_extra,
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_TEMPERAMENT_TYPES,
      onPressEnabled: contributeMode,
      onPress: () =>
        handleOpenLiveStockModal(
          STRUCTURED_CONFIGURATION_LIVESTOCK_TEMPERAMENT_TYPES
        ),
    },

    {
      icon: isFresh ? "reefDocsPlantSafe" : "reefDocsCoralSafe",
      label: isFresh ? "Plant Safe" : "Coral Safe",
      value: isFresh ? plantSafe : coralSafe,
      extraData: `How likely this animal is to disturb or damage ${
        isFresh ? "plants" : "coral"
      }.`,
      definition: "livestock_coral_safe",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("livestock_coral_safe"),
    },
    {
      icon: "reefDocsReefSafe",
      label: isFresh ? "Community" : "Reef Safe",
      value: isFresh ? community : reefSafe,
      extraData: isFresh ? data?.community_extra : data?.reef_safe_extra,
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_REEF_SAFE_TYPES,
      onPressEnabled: contributeMode,
      onPress: () =>
        handleOpenLiveStockModal(
          STRUCTURED_CONFIGURATION_LIVESTOCK_REEF_SAFE_TYPES
        ),
    },
    {
      icon: "reefDocsHardy",
      label: "Hardy",
      value: hardy,
      extraData:
        "How sensitive this animal is to changes in water quality and tank conditions.",
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_HARDY_TYPES,
      onPressEnabled: contributeMode,
      onPress: () =>
        handleOpenLiveStockModal(
          STRUCTURED_CONFIGURATION_LIVESTOCK_HARDY_TYPES
        ),
    },
    {
      icon: "reefDocsCareLevel",
      label: "Care Level",
      value: data?.care_level,
      extraData:
        "The care and attention required for this animal above the minimum standard.",
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_CARE_LEVEL_TYPES,
      onPressEnabled: contributeMode,
      onPress: () =>
        handleOpenLiveStockModal(
          STRUCTURED_CONFIGURATION_LIVESTOCK_CARE_LEVEL_TYPES
        ),
    },
    {
      icon: "reefDocsTankLimit",
      label: "Tank Limit",
      value: data?.tank_limit === 0 ? "No Limit" : data?.tank_limit,
      extraData: data?.tank_limit_extra_data,
      definition: "livestock_tank_limit",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("livestock_tank_limit"),
    },
    {
      icon: "reefDocsDiet",
      label: "Diet",
      value: data?.diet,
      extraData: data?.diet_extra_data,
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_DIET_TYPES,
      onPressEnabled: contributeMode,
      onPress: () =>
        handleOpenLiveStockModal(STRUCTURED_CONFIGURATION_LIVESTOCK_DIET_TYPES),
    },
    {
      icon: "reefDocsMaxSize",
      label: "Max Size",
      value: data?.id ? maxFishSize : undefined,
      extraData:
        "The maximum size this animal can grow to in a tank. These are live animals and this should be used for reference only.",
      definition: "livestock_size",
      onPressEnabled: false,
      notVotable: true,
      onPress: () => handleOpenLiveStockModal("livestock_size"),
    },
    {
      icon: "reefDocsTankBreed",
      label: "Can Tank Breed",
      value: data?.id ? (data?.can_be_tank_bred ? "Yes" : "No") : undefined,
      extraData:
        "This animal can breed in a tank. This is very dependant on the animal and also the special breeding requirements for each species.",
      definition: "livestock_can_tank_breed",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("livestock_can_tank_breed"),
    },
    {
      icon: "reefDocsMinTankSize",
      label: "Min Tank Size",
      value: data?.id ? minimumTankSize : undefined,
      extraData:
        "The minimum tank size this animal needs to sustain the maximum size this fish can grow to.",
      definition: "livestock_size",
      onPressEnabled: false,
      notVotable: true,
    },
    {
      icon: "reefDocsSwimZone",
      label: "Swimming Zone",
      value: data?.swimming_zone,
      extraData:
        "The swimming zone this animal may prefer. This is a guide only.",
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_SWIMMING_ZONES,
      onPressEnabled: contributeMode,
      onPress: () =>
        handleOpenLiveStockModal(
          STRUCTURED_CONFIGURATION_LIVESTOCK_SWIMMING_ZONES
        ),
    },
    {
      icon: "reefDocsInvertSafe",
      label: "Invert Safe",
      value: data?.invert_safe,
      extraData: "How likely this animal is to pick or eat inverts.",
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_INVERT_SAFE,
      onPressEnabled: contributeMode,
      onPress: () =>
        handleOpenLiveStockModal(
          STRUCTURED_CONFIGURATION_LIVESTOCK_INVERT_SAFE
        ),
    },

    {
      icon: "reefDocsFamily",
      label: "Family",
      value: data?.fish_type_family,
      extraData: "The scientific family name for this animal.",
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_DIET_TYPES,
      onPressEnabled: false,
      notVotable: true,
      onPress: () =>
        handleOpenLiveStockModal(STRUCTURED_CONFIGURATION_LIVESTOCK_DIET_TYPES),
    },
    {
      icon: "reefDocsFamily",
      label: "Family Common",
      value: data?.fish_type_family_common,
      extraData: "The common family name for this animal.",
      definition: "livestock_size",
      onPressEnabled: false,
      notVotable: true,
      onPress: () => handleOpenLiveStockModal("livestock_size"),
    },
    {
      icon: "reefDocsCountryOfOrigin",
      label: "Country Origin",
      value: data?.country_place_of_origin,
      extraData: "The country this animal is from. This is a guide only.",
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_DIET_TYPES,
      onPressEnabled: false,
      notVotable: true,
      onPress: () =>
        handleOpenLiveStockModal(STRUCTURED_CONFIGURATION_LIVESTOCK_DIET_TYPES),
    },
    {
      icon: "reefDocsCountryOfOrigin",
      label: "Region Origin",
      value: data?.region_of_origin,
      extraData: "The region this animal is from. This is a guide only.",
      definition: "livestock_size",
      onPressEnabled: false,
      notVotable: true,
      onPress: () => handleOpenLiveStockModal("livestock_size"),
    },
    {
      icon: "reefDocsLifeExpect",
      label: "Life Span",
      value:
        data?.expected_life_span_in_a_tank?.min &&
        `${data?.expected_life_span_in_a_tank?.min} - ${data?.expected_life_span_in_a_tank?.max} Years`,
      extraData: "The typical life span for this animal in a tank environment.",
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_DIET_TYPES,
      onPressEnabled: false,
      notVotable: true,
      onPress: () =>
        handleOpenLiveStockModal(STRUCTURED_CONFIGURATION_LIVESTOCK_DIET_TYPES),
    },
    {
      icon: "reefDocsLongTankPref",
      label: "Long Tank",
      value: data?.long_tank_preference,
      extraData: "If this animal prefers a longer tank for swimming.",
      definition: "livestock_long_tank_preferred",
      onPressEnabled: contributeMode,
      onPress: () => handleOpenLiveStockModal("livestock_long_tank_preferred"),
    },
    {
      icon: "reefDocsFeedingDifficulty",
      label: "Feeding Difficulty",
      value: data?.feeding_difficulty,
      extraData: data?.feeding_difficulty_extra,
      definition: STRUCTURED_CONFIGURATION_LIVESTOCK_FEEDING_DIFFICULTY,
      onPressEnabled: contributeMode,
      onPress: () =>
        handleOpenLiveStockModal(
          STRUCTURED_CONFIGURATION_LIVESTOCK_FEEDING_DIFFICULTY
        ),
    },
    {
      icon: "reefDocsDiseaseFish",
      label: "Stress Indicators",
      value: data?.stress_indicators?.length,
      extraData: `Some stress indicators to watch out for. This is a guide only.
        ${data?.stress_indicators?.map((item) => `\n- ${item}`)}
      `,
      definition: "livestock_stress_indicators",
      onPressEnabled: false,
      notVotable: true,
    },
  ];

  const cardGroups = chunkArray(cardData, 4); // each group is 2x2 cards

  const buttons = topSectionButtons;

  return (
    <Grid direction="column" gap={16}>
      <LiveStockProfileCarousel
        images={images}
        loading={loading}
        indicatorAbsolute
        priority="high"
      />

      {images?.length === 0 && (
        <TouchableOpacity
          onPress={() =>
            openModal({
              type: "liveStockProfileUserPhotosModal",
              height: "large",
              modalTitle: isFresh ? "Community Photos" : "Reefer Photos",
              data: {
                liveStockId: id,
              },
            })
          }
          style={{ backgroundColor: WHITE, padding: 8, borderRadius: 8 }}
        >
          <Text>
            Got an image we can use ? Submit an image contribution and receive
            attribution on this profile.
          </Text>
        </TouchableOpacity>
      )}

      <Grid
        direction="row"
        gap={8}
        justifyContent="space-between"
        alignItems="center"
      >
        {buttons.map((button, key) => {
          const handlePress = () => {
            return button.onPress();
          };

          return (
            <TouchableOpacity
              onPress={handlePress}
              style={{
                backgroundColor: button.backgroundColor,
                padding: 8,
                borderRadius: 8,
                flex: 1,
              }}
            >
              <GridItem alignItems="center">
                <Icon
                  strokeFill={button.iconFill}
                  fill={button.iconFill}
                  strokeWidth={2}
                  name={button.icon}
                  width={32}
                  height={32}
                />
              </GridItem>
            </TouchableOpacity>
          );
        })}
      </Grid>

      <GridItem>
        <GridItem>
          <Grid
            direction="row"
            alignItems="center"
            gap={8}
            style={{ flexWrap: "wrap" }}
          >
            <TouchableOpacity onPress={handleOpenNameModal}>
              {name ? (
                <Heading variant={4} weight="semiBold">
                  {name}
                </Heading>
              ) : (
                <Skeleton marginBottom={8} height={18} width={200} />
              )}
            </TouchableOpacity>
          </Grid>
          <Grid direction="row" gap={8}>
            <TouchableOpacity style={{ flex: 1 }} onPress={handleOpenNameModal}>
              {scientificName ? (
                <GridItem>
                  {alternateNames && <Text>{alternateNames}</Text>}
                  <Text>{scientificName}</Text>
                </GridItem>
              ) : (
                <GridItem>
                  <Skeleton marginBottom={8} height={15} width={180} />
                  <Skeleton marginBottom={0} height={15} width={150} />
                </GridItem>
              )}
            </TouchableOpacity>
            <GridItem>
              <Grid direction="row" gap={4}>
                {tankExtraRole?.map((item) => (
                  <Pill key={item}>
                    <Text style={style.pillText}>{item}</Text>
                  </Pill>
                ))}
              </Grid>
            </GridItem>
          </Grid>
        </GridItem>
      </GridItem>

      <GridItem flex={1} gap={16}>
        <ScrollView
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={{ flexDirection: "row" }}>
            {cardGroups.map((group, index) => {
              const isLast = index === cardGroups.length - 1;

              return (
                <View
                  key={index}
                  style={{ width: isLast ? width - 32 : width }}
                >
                  <Grid direction="row" gap={16}>
                    {Array(2)
                      .fill(0)
                      .map((_, colIndex) => (
                        <Grid
                          key={colIndex}
                          direction="column"
                          gap={16}
                          flex={1}
                        >
                          {group
                            .filter((_, i) => Math.floor(i / 2) === colIndex)
                            .map((card, i) => {
                              if (
                                group?.[0]?.definition ===
                                "livestock_temperament"
                              ) {
                                <LiveStockDataCard
                                  {...card}
                                  id={id}
                                  loading={loading && !card?.value}
                                />;
                              }

                              return (
                                <LiveStockDataCard
                                  {...card}
                                  id={id}
                                  loading={loading && !card?.value}
                                />
                              );
                            })}
                        </Grid>
                      ))}
                  </Grid>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <CarouselIndicators total={5} activeIndex={currentIndex} />
      </GridItem>

      <Grid direction="column" gap={16}>
        <Accordion
          title="Description"
          analyticsEventId="LIVESTOCK_ACCORDION_OPEN"
          loading={loading}
          renderIf={data?.description}
          liveStockId={id}
        >
          <Text>{data?.description}</Text>
        </Accordion>
        <Accordion
          title="Behavioural Notes"
          analyticsEventId="LIVESTOCK_ACCORDION_OPEN"
          loading={loading}
          liveStockId={id}
          renderIf={data?.behavioural_notes}
        >
          <Text>{data?.behavioural_notes}</Text>
        </Accordion>
        <Accordion
          title="Aquascaping Needs"
          analyticsEventId="LIVESTOCK_ACCORDION_OPEN"
          loading={loading}
          liveStockId={id}
          renderIf={data?.aquascaping_needs}
        >
          <Text>{data?.aquascaping_needs}</Text>
        </Accordion>
        <Accordion
          title="Special Requirements"
          analyticsEventId="LIVESTOCK_ACCORDION_OPEN"
          liveStockId={id}
          loading={loading}
          renderIf={data?.special_requirements}
        >
          <Text>
            {data?.special_requirements ??
              "We have no special requirements documented yet"}
          </Text>
        </Accordion>

        <Accordion
          title="Substrate Preference"
          analyticsEventId="LIVESTOCK_ACCORDION_OPEN"
          loading={loading}
          liveStockId={id}
          renderIf={data?.substrate_preference}
        >
          <Text>
            {data?.substrate_preference ??
              "We have no substrate preference documented yet"}
          </Text>
        </Accordion>
      </Grid>

      <LiveStockAskQuestion liveStockName={data?.name} liveStockId={id} />

      <LiveStockTaggedPosts liveStockId={id} />

      <GridItem>
        <Carousel
          title={`${data?.name} Family`}
          data={data?.family}
          eventId="LIVESTOCK_FAMILY_CAROUSEL"
          onPressCallback={handleLiveStockNavigate}
          showAllResultsUrl={`/livestock?filter=fish_type_family:${data?.fish_type_family}&init=true`}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
        />
      </GridItem>
      <GridItem>
        <Carousel
          title={"Similar Temperament"}
          data={data?.similarTemperament}
          eventId="LIVESTOCK_SIMILAR_TEMPERAMENT_CAROUSEL"
          onPressCallback={handleLiveStockNavigate}
          showAllResultsUrl={`/livestock?filter=temperament:${data?.temperament}&init=true`}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
        />
      </GridItem>

      {data?.articles?.length > 0 && (
        <GridItem>
          <Carousel
            title="Featured Articles"
            data={data?.articles}
            eventId="LIVESTOCK_RELATED_ARTICE_CAROUSEL"
            generateEventData={(item) => ({
              dataId: item?.id,
            })}
            slidesToShow={1.3}
            disableContent
            renderCard={(item, cardWidth) => {
              return (
                <BannerImage
                  width={cardWidth}
                  url={item.article?.images?.[0]?.url}
                  aspectRatio={1.778}
                  onPress={() => {
                    navigate(
                      `/more?article=${item?.article?.url}&showRootMenu=true`
                    );
                  }}
                />
              );
            }}
          />
        </GridItem>
      )}

      {products?.length > 0 && (
        <GridItem>
          <Carousel
            title={"Related Products"}
            data={products}
            resizeMode="contain"
            eventId="LIVESTOCK_RELATED_PRODUCTS_CAROUSEL"
            generateEventData={(item) => ({
              name: item?.name,
              dataId: item?.id,
              uk: item?.uk,
            })}
            onPressCallback={(id, item) => {
              openModal({
                type: "relatedProductModal",
                height: "large",
                modalTitle: "Related Products",
                data: { ...item },
              });
            }}
          />
        </GridItem>
      )}
      <GridItem>
        <LiveStockSuggestEdits id={id} />
      </GridItem>
    </Grid>
  );
};

const style = StyleSheet.create({
  image: {
    borderRadius: 16,
    resizeMode: "cover",
  },
  carouselBase: {
    height: 320,
    width: width - 32,
  },
  pillText: {
    color: WHITE,
  },
});
