import React, { useEffect, useRef, useState } from "react";
import {
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Keyboard,
} from "react-native";
import { TriggersConfig, useMentions } from "react-native-controlled-mentions";
import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  Z_INDEX,
} from "../../../constants";
import apiClient from "../../../api/apiClient";
import { AppImage } from "../../AppImage/AppImage";
import { Grid } from "../../Grid/Grid";
import { Icon } from "../../Icon/Icon";

const triggersConfig: TriggersConfig<"mention"> = {
  mention: {
    trigger: "@",
    textStyle: { fontWeight: "bold", color: REEF_DOCS_BLUE },
    isInsertSpaceAfterMention: true,
  },
};

export const MentionTextInput = ({
  value,
  onChange,
  placeholder,
  taggable = [],
  style,
  multiline = false,
  numberOfLines = 4,
  textAlignVertical = "top",
  suggestionContainerStyle = {},
  hideSuggestionSearch = false,
  minHeight = true,
  focus,
}) => {
  const [tagData, setTagData] = useState({
    liveStock: [],
    plantCoral: [],
    articles: [],
    tags: [],
    users: [],
  });
  const [textValue, setTextValue] = useState(value || "");

  useEffect(() => {
    if (focus) {
      inputRef.current?.focus();
    }
  }, [focus]);

  useEffect(() => {
    setTextValue(value || "");
  }, [value]);

  const { textInputProps, triggers } = useMentions({
    value: textValue,
    onChange: (val) => {
      setTextValue(val);
      onChange?.(val);
    },
    triggersConfig,
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (textValue.length <= 1) {
      setTagData({
        liveStock: [],
        plantCoral: [],
        articles: [],
        tags: [],
        users: [],
      });
    }
  }, [textValue]);

  const handleFetchTags = async (keyword) => {
    if (!keyword) {
      return setTagData({
        liveStock: [],
        plantCoral: [],
        articles: [],
        tags: [],
        users: [],
      });
    }

    await apiClient
      .post(`/search/tagSearch?search=${keyword}`, {
        tags: taggable,
      })
      .then((res) => {
        setTagData(
          res?.data?.data || {
            liveStock: [],
            plantCoral: [],
            articles: [],
            tags: [],
            users: [],
          }
        );
      });
  };

  useEffect(() => {
    if (triggers.mention.keyword) {
      handleFetchTags(triggers.mention.keyword);
    } else {
      setTagData({
        liveStock: [],
        plantCoral: [],
        articles: [],
        tags: [],
        users: [],
      });
    }
  }, [triggers.mention.keyword]);

  useEffect(() => {
    if (!triggers.mention.keyword) {
      setTagData({
        liveStock: [],
        plantCoral: [],
        articles: [],
        tags: [],
        users: [],
      });
    }
  }, [triggers.mention.keyword]);

  const getTagIcon = (definition) => {
    switch (definition) {
      case "friend_or_foe":
        return "reefDocsFriendOrFoe"; // Replace with actual icon path
      case "coral_disease":
        return "reefDocsCoral"; // Replace with actual icon path
      case "disease_identification":
        return "reefDocsDiseaseFish"; // Replace with actual icon path
      default:
        return null;
    }
  };

  const suggestionList = [
    ...tagData?.liveStock?.map((item) => ({
      ...item,
      id: `liveStock-${item.id}`,
    })),
    ...tagData?.plantCoral?.map((item) => ({
      ...item,
      id: `plantCoral-${item.id}`,
    })),
    ...tagData?.articles?.map((item) => ({
      ...item,
      id: `article-${item.id}`,
    })),
    ...tagData?.tags?.map((item) => ({
      ...item,
      id: `tag-${item.id}`,
      icon: getTagIcon(item?.definition),
    })),
    ...tagData?.users?.map((item) => ({
      ...item,
      id: `user-${item.userName}`,
      name: `${item?.userName}`,
      images: [{ url: item?.image }],
    })),
  ];

  const inputRef = useRef(null);

  const handleSuggestionPress = (item) => {
    triggers.mention.onSelect(item);
    inputRef?.current?.focus();
    setTagData({
      liveStock: [],
      plantCoral: [],
      articles: [],
      tags: [],
      users: [],
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <RNTextInput
          {...textInputProps}
          ref={inputRef}
          style={[
            styles.input,
            style,
            multiline && minHeight && { minHeight: 150 },
          ]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={textAlignVertical}
          placeholder={placeholder}
          placeholderTextColor={BLACK}
        />

        {suggestionList.length > 0 &&
          textValue?.length > 0 &&
          keyboardVisible && (
            <View
              style={[styles.suggestionsContainer, suggestionContainerStyle]}
            >
              {!hideSuggestionSearch && (
                <RNTextInput
                  value={triggers.mention.keyword}
                  onChangeText={(text) => handleFetchTags(text)}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: INPUT_BORDER_COLOR,
                  }}
                />
              )}
              <ScrollView
                nestedScrollEnabled
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{ paddingBottom: 16 }}
                style={{ maxHeight: 200 }}
              >
                {suggestionList.map((item, index) => (
                  <View key={item.id || item._id} style={styles.suggestionItem}>
                    <Grid
                      alignItems="center"
                      direction="row"
                      style={
                        index !== 0
                          ? {
                              borderTopWidth: 1,
                              borderTopColor: INPUT_BORDER_COLOR,
                              paddingTop: 8,
                            }
                          : {
                              paddingTop: 8,
                            }
                      }
                    >
                      <TouchableOpacity
                        onPress={() => handleSuggestionPress(item)}
                      >
                        <Grid direction="row" alignItems="center">
                          {item?.icon ? (
                            <View
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: 80,
                                borderWidth: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 8,
                              }}
                            >
                              <Icon name={item?.icon} width={32} height={32} />
                            </View>
                          ) : (
                            <AppImage
                              width={42}
                              height={42}
                              path={item?.images?.[0]?.url}
                              style={{ borderRadius: 21, marginRight: 8 }}
                            />
                          )}

                          <Grid direction="column">
                            {item?.displayName && (
                              <Text style={styles.suggestionText}>
                                {item.displayName}
                              </Text>
                            )}

                            <Text
                              style={[
                                styles.suggestionText,
                                { color: BLACK, fontSize: 12 },
                              ]}
                            >
                              {item.name}
                            </Text>
                          </Grid>
                        </Grid>
                      </TouchableOpacity>
                    </Grid>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: INPUT_BORDER_COLOR,
    color: "black",
    fontFamily: "Inter-Regular",
    fontSize: 12,
    minHeight: 55,
  },
  mirrorText: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0,
  },
  suggestionsContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: Z_INDEX.mentionTextInput,
    width: "100%",
    height: "100%",
  },
  suggestionItem: {
    paddingVertical: 6,
  },
  suggestionText: {
    color: REEF_DOCS_BLUE,
  },
});
