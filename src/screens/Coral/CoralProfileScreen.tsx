import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-native";

import {
  useGetLiveStockExperiencePosts,
  useGetLiveStockImageContributions,
  useGetLiveStockPastVotes,
} from "../../hooks/useLiveStock";
import { useAppSelector } from "../../hooks/useRedux";
import { useModal } from "../../hooks/useModal";
import { useGetPlantCoralProfile } from "../../hooks/useCoral";
import { useAddToRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { useAudience } from "../../hooks/useAudience";

import { sendEvent, sendEventOnce } from "../../utility/analytics";
import {
  generateCoralData,
  generatePlantData,
  getLiveStockPreLoadedData,
} from "../../utility/livestock";

import { selectPlantCoralProfile } from "../../store/slices/coralPlantSlice";
import { StructuredConfigurationKey } from "../../store/slices/structuredConfigurationSlice";

import { Grid, GridItem, Text } from "../../components";
import { Accordion } from "../../components/Accordion/Accordion";
import { Carousel } from "../../elements/Carousel/Carousel";
import { LiveStockProfileCarousel } from "../../components/LiveStockProfileCarousel/LiveStockProfileCarousel";
import { BannerImage } from "../../components/BannerImage/BannerImage";
import { LiveStockActionButtons } from "../../elements/LiveStockActionButtons/LiveStockActionButtons";
import { LiveStockProfileHeader } from "../../elements/LiveStockProfileHeader/LiveStockProfileHeader";
import { LiveStockDataCarousel } from "../../elements/LiveStockDataCarousel/LiveStockDataCarousel";
import { LiveStockSuggestEdits } from "../../components/LiveStockSuggestEdits/LiveStockSuggestEdits";
import { TouchableOpacity } from "react-native";
import { WHITE } from "../../constants";

export const CoralProfileScreen: React.FC = () => {
  const { isFresh } = useAudience();

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [contributeMode, setContributeMode] = useState(false);

  const [addToRecentlyViewed] = useAddToRecentlyViewed();

  const handleAddToRecentlyViewed = async (id) => await addToRecentlyViewed(id);

  const { openModal } = useModal();

  const params = useParams();

  const { state } = useLocation();

  const id = params?.id?.replace(":", "");

  sendEventOnce(isFresh ? "PLANT_PROFILE_VIEW" : "CORAL_PROFILE_VIEW", {
    liveStockId: id,
  });

  const data = useAppSelector(selectPlantCoralProfile(id));

  const [getLiveStock] = useGetPlantCoralProfile();
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
    navigate(`/coral/${id}`, {
      state: { data: item },
    });
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

  const handleOpenLiveStockModal = (option?: StructuredConfigurationKey) => {
    if (!contributeMode) return;

    sendEvent("LIVESTOCK_VOTE_MODAL", {
      option,
      liveStockId: data?.id,
    });

    openModal({
      type: "liveStockVoteModal",
      height: "medium",
      modalTitle: "Contribute",
      data: {
        option,
        liveStockId: data?.id,
      },
    });
  };

  useEffect(() => {
    handleFetchLiveStockProfile();
  }, [id]);

  const { alternateNames, tankExtraRole, images, name, scientificName } =
    getLiveStockPreLoadedData(state, data);

  const products = data?.related_products
    ?.map((p) => p?.product)
    .filter((product) => product !== undefined && product !== null);

  const dataMethod = isFresh ? generatePlantData : generateCoralData;

  const { cardGroups, topSectionButtons } = dataMethod(
    handleOpenLiveStockModal,
    setContributeMode,
    contributeMode,
    state,
    data,
    openModal,
    id
  );

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
              modalTitle: "Reefer Photos",
              data: {
                liveStockId: id,
                icon: isFresh ? "reefDocsPlantCamera" : "reefDocsCoralCamera",
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

      <LiveStockActionButtons buttons={topSectionButtons} />

      <LiveStockProfileHeader
        scientificName={scientificName}
        name={name}
        handleOpenNameModal={handleOpenNameModal}
        alternateNames={alternateNames}
        tankExtraRole={tankExtraRole}
      />

      <LiveStockDataCarousel
        cardGroups={cardGroups}
        loading={loading}
        id={id}
      />

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
          title="Compatability Notes"
          analyticsEventId="LIVESTOCK_ACCORDION_OPEN"
          loading={loading}
          liveStockId={id}
          renderIf={data?.compatibility_notes}
        >
          <Text>{data?.compatibility_notes}</Text>
        </Accordion>
        <Accordion
          title="Maintenance Notes"
          analyticsEventId="LIVESTOCK_ACCORDION_OPEN"
          loading={loading}
          liveStockId={id}
          renderIf={data?.maintenance_notes}
        >
          <Text>{data?.maintenance_notes}</Text>
        </Accordion>
      </Grid>

      <GridItem>
        <Carousel
          title={`${data?.name} Family`}
          data={data?.family}
          eventId="LIVESTOCK_FAMILY_CAROUSEL"
          onPressCallback={handleLiveStockNavigate}
          showAllResultsUrl={`/coral?filter=family_common:${data?.family_common}&init=true`}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
        />
      </GridItem>
      <GridItem>
        <Carousel
          title={"Similar Aggression Level"}
          data={data?.similarTemperament}
          eventId="LIVESTOCK_SIMILAR_TEMPERAMENT_CAROUSEL"
          onPressCallback={handleLiveStockNavigate}
          showAllResultsUrl={`/coral?filter=aggression_level:${data?.aggression_level}&init=true`}
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

      <LiveStockSuggestEdits id={id} />
    </Grid>
  );
};
