import React from "react";

import {
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigate } from "react-router-native";

import { getAppDimensions } from "../../utility/dimensions";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";

import {
  selectSearchActive,
  selectSearchResults,
  selectSearchTerm,
  setSearchActive,
  setSearchResults,
  setSearchTerm,
} from "../../store/slices/globalSlice";
import {
  selectSearchHistory,
  setSearchHistory,
} from "../../store/slices/userConfigSlice";

import {
  Grid,
  GridItem,
  Heading,
  Text,
  RichText,
  Icon,
} from "../../components";

import { AppImage } from "../../components/AppImage/AppImage";

import apiClient from "../../api/apiClient";

import {
  BLACK,
  CORAL_PATH,
  LIVESTOCK_PATH,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
  WHITE,
} from "../../constants";

import { sendEvent } from "../../utility/analytics";
import { useAudience } from "../../hooks/useAudience";
import { getPostUrlByClassification } from "../../utility/post";
import { Search } from "./Search";

const { height } = getAppDimensions();

export const SearchResults = () => {
  const { isFresh } = useAudience();

  const fetchSearchResults = async (value) => {
    if (!value) {
      return;
    }

    try {
      const response = await apiClient.get(`/search?search=${value}`);
      if (response.status === 200) {
        dispatch(setSearchResults(response.data.data));
      }
    } catch (error) {
      console.log("Search error:", error);
    }
  };

  const searchTerm = useAppSelector(selectSearchTerm);

  const searchResults = useAppSelector(selectSearchResults);

  const searchHistory = useAppSelector(selectSearchHistory);

  const searchActive = useAppSelector(selectSearchActive);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleNavigateToResult = async (
    link,
    event = "GLOBAL_SEARCH_VIEW_ARTICLE_RESULT"
  ) => {
    await navigate(link);

    dispatch(setSearchHistory(searchTerm));

    dispatch(setSearchActive(false));

    dispatch(setSearchResults({}));

    dispatch(setSearchTerm(""));

    sendEvent(event, {
      link,
    });

    await Keyboard.dismiss();
  };

  const handleHistoricTermPress = async (term) => {
    dispatch(setSearchTerm(term));

    await fetchSearchResults(term);

    sendEvent("GLOBAL_SEARCH_HISTORIC_SEARCH_TERM_USED", {});
  };

  const handleViewAllSearchResults = (coral = false) => {
    const path = `${coral ? CORAL_PATH : LIVESTOCK_PATH}?search=${searchTerm}`;

    sendEvent("GLOBAL_SEARCH_LIVESTOCK_VIEW_ALL_RESULTS", {});
    navigate(path);
    dispatch(setSearchActive(false));
  };

  return (
    <>
      {searchActive && <Search />}

      {searchActive && (
        <View
          style={{ height: height, paddingTop: 16, backgroundColor: "#EEF2F4" }}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 260 }}>
            {searchTerm.length === 0 ? (
              // Show Search Suggestions when nothing has been typed
              <View style={styles.suggestions}>
                {searchHistory?.length > 0 && (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={styles.suggestionText}>
                      Previous Searches:
                    </Text>
                    {searchHistory?.map((item, key) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => handleHistoricTermPress(item)}
                      >
                        <Text style={styles.suggestionItem}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={styles.suggestionText}>Try searching for:</Text>
                <Text style={styles.suggestionItem}>- How to Cycle a Tank</Text>
                <Text style={styles.suggestionItem}>
                  - Treating ICH / Velvet
                </Text>
                <Text style={styles.suggestionItem}>
                  - What is a media reactor
                </Text>
              </View>
            ) : searchResults?.articles?.length > 0 ||
              searchResults?.liveStock?.length > 0 ||
              searchResults?.plantCoral?.length > 0 ||
              searchResults?.posts?.length > 0 ? (
              // Show Search Results
              <Grid gap={8}>
                {searchResults?.liveStock?.length > 0 && (
                  <GridItem style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <Heading variant={5} weight="semiBold">
                      Live Stock Results for "{searchTerm}"
                    </Heading>
                  </GridItem>
                )}
                {searchResults?.liveStock?.map((animal, key) => (
                  <GridItem
                    key={`ls_${animal?.id}`}
                    style={{ backgroundColor: WHITE, padding: 16 }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        handleNavigateToResult(
                          animal?.link,
                          "GLOBAL_SEARCH_VIEW_LIVESTOCK_RESULT"
                        )
                      }
                    >
                      <Grid direction="row" gap={8} alignItems="center">
                        <AppImage
                          path={animal?.images?.[0]?.url}
                          width={64}
                          height={64}
                          style={{ borderRadius: 8 }}
                          transition={0}
                        />
                        <View>
                          <Heading variant={5} weight="semiBold">
                            {animal?.name}
                          </Heading>

                          {animal?.alternate_names?.length > 0 && (
                            <Text
                              style={{
                                fontSize: 10,
                                marginBottom: 4,
                              }}
                            >
                              {animal?.alternate_names?.join(", ")}
                            </Text>
                          )}

                          <Text>{animal?.scientific_name}</Text>
                        </View>
                      </Grid>
                    </TouchableOpacity>
                  </GridItem>
                ))}
                {searchResults?.liveStock?.length >= 3 && (
                  <GridItem
                    style={{
                      backgroundColor: WHITE,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        padding: 16,
                      }}
                      onPress={() => handleViewAllSearchResults(false)}
                    >
                      <Grid direction="row" justifyContent="space-between">
                        <Heading variant={5} weight="semiBold">
                          View All Results
                        </Heading>
                        <Icon name="chevronRight" fill={BLACK} />
                      </Grid>
                    </TouchableOpacity>
                  </GridItem>
                )}

                {searchResults?.plantCoral?.length > 0 && (
                  <GridItem style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <Heading variant={5} weight="semiBold">
                      {isFresh
                        ? `Plant Results for "${searchTerm}"`
                        : `Coral Results for "${searchTerm}"`}
                    </Heading>
                  </GridItem>
                )}
                {searchResults?.plantCoral?.map((coral, key) => {
                  return (
                    <GridItem
                      key={`plant_coral_${coral?.id}`}
                      style={{ backgroundColor: WHITE, padding: 16 }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          handleNavigateToResult(
                            coral?.link,
                            "GLOBAL_SEARCH_VIEW_PLANT_CORAL_RESULT"
                          )
                        }
                      >
                        <Grid direction="row" gap={8} alignItems="center">
                          <AppImage
                            path={coral?.images?.[0]?.url}
                            width={64}
                            height={64}
                            style={{ borderRadius: 8 }}
                            transition={0}
                          />
                          <View>
                            <Heading variant={5} weight="semiBold">
                              {coral?.name}
                            </Heading>
                            <Text
                              style={{
                                fontSize: 10,
                                marginTop: -4,
                                marginBottom: 4,
                              }}
                            >
                              {coral?.alternate_names &&
                                coral?.alternate_names?.length > 0 &&
                                coral?.alternate_names?.join(", ")}
                            </Text>
                            <Text>{coral?.scientific_name}</Text>
                          </View>
                        </Grid>
                      </TouchableOpacity>
                    </GridItem>
                  );
                })}
                {searchResults?.plantCoral?.length >= 3 && (
                  <GridItem
                    style={{
                      backgroundColor: WHITE,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        padding: 16,
                      }}
                      onPress={() => handleViewAllSearchResults(true)}
                    >
                      <Grid direction="row" justifyContent="space-between">
                        <Heading variant={5} weight="semiBold">
                          View All Results
                        </Heading>
                        <Icon name="chevronRight" fill={BLACK} />
                      </Grid>
                    </TouchableOpacity>
                  </GridItem>
                )}

                {searchResults?.posts?.length > 0 && (
                  <GridItem style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <Heading variant={5} weight="semiBold">
                      Post Results for "{searchTerm}"
                    </Heading>
                  </GridItem>
                )}
                {searchResults?.posts?.map((post, key) => {
                  const basePostUrl = getPostUrlByClassification(
                    post?.classification
                  );

                  const url = `${basePostUrl}?postId=${post?.id}`;

                  return (
                    <GridItem
                      key={key}
                      style={{ backgroundColor: WHITE, padding: 16 }}
                    >
                      <TouchableOpacity
                        onPress={() => handleNavigateToResult(url)}
                      >
                        <Grid direction="row" gap={8} alignItems="center">
                          <RichText html={`${post?.content}`} />
                        </Grid>
                      </TouchableOpacity>
                    </GridItem>
                  );
                })}

                {searchResults?.articles?.length > 0 && (
                  <GridItem style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <Heading variant={5} weight="semiBold">
                      Article Results for "{searchTerm}"
                    </Heading>
                  </GridItem>
                )}

                {searchResults.articles?.map((article, key) => (
                  <GridItem
                    key={key}
                    style={{ backgroundColor: WHITE, padding: 16 }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        handleNavigateToResult(
                          article?.link,
                          "GLOBAL_SEARCH_VIEW_ARTICLE_RESULT"
                        )
                      }
                    >
                      <RichText html={`<h4>${article?.title}</h4>`} />
                      <RichText
                        styles={{
                          h1: {
                            fontFamily: "Poppins-SemiBold",
                            fontSize: 14,
                            fontWeight: "normal",
                            color: BLACK,
                          },
                          h2: {
                            fontFamily: "Poppins-SemiBold",
                            fontSize: 14,
                            fontWeight: "normal",
                            color: BLACK,
                          },
                          h3: {
                            fontFamily: "Poppins-SemiBold",
                            fontWeight: "normal",
                            color: BLACK,
                            fontSize: 14,
                          },
                          h4: {
                            fontFamily: "Poppins-SemiBold",
                            fontWeight: "normal",
                            color: BLACK,
                            fontSize: 14,
                            margin: 0,
                          },
                          h5: {
                            fontFamily: "Poppins-SemiBold",
                            fontSize: 14,
                            color: BLACK,
                            fontWeight: "normal",
                          },
                          h6: {
                            fontFamily: "Poppins-SemiBold",

                            fontSize: 14,
                            color: BLACK,
                            fontWeight: "normal",
                          },
                        }}
                        html={`<p>${article?.content}</p>`}
                      />
                    </TouchableOpacity>
                  </GridItem>
                ))}
              </Grid>
            ) : (
              // Show No Results Found if search term exists but no results are found
              <>
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No results found</Text>
                </View>

                <View style={styles.suggestions}>
                  {searchHistory?.length > 0 && (
                    <View style={{ marginBottom: 16 }}>
                      <Text style={styles.suggestionText}>
                        Previous Searches:
                      </Text>
                      {searchHistory?.map((item, key) => (
                        <TouchableOpacity
                          key={key}
                          onPress={() => setSearchTerm(item)}
                        >
                          <Text style={styles.suggestionItem}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text style={styles.suggestionText}>Try searching for:</Text>
                  <Text style={styles.suggestionItem}>
                    - How to Cycle a Tank
                  </Text>
                  <Text style={styles.suggestionItem}>
                    - Treating ICH / Velvet
                  </Text>
                  <Text style={styles.suggestionItem}>
                    - What is a media reactor
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 65,
    backgroundColor: WHITE,
    padding: 16,
    justifyContent: "center",
  },
  profile: {
    borderRadius: 100,
    borderColor: REEF_DOCS_GREY,
    borderWidth: 1,
    width: 48,
    height: 48,
  },
  searchCloseButton: {
    position: "absolute",
    backgroundColor: REEF_DOCS_BLUE,
    right: 1,
    height: 45,
    top: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 16,
  },
  suggestions: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  suggestionItem: {
    fontSize: 14,
    color: "gray",
    paddingVertical: 4,
  },
});
