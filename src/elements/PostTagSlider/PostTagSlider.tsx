import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { Grid, Icon, Text } from "../../components";

import { ALL_POST_TAG_ID, BLACK, REEF_DOCS_BLUE, WHITE } from "../../constants";

export const PostTagSlider = ({ tags, activeTags, onTagPress }) => {
  // Reorder tags: first stays, active pills (except first) come next, then the rest
  const firstTag = tags?.[0];
  const restTags = tags?.slice(1) || [];
  const activeTagIds = activeTags?.filter((id) => id !== firstTag?.id) || [];

  const activeTagsList = restTags.filter((tag) =>
    activeTagIds.includes(tag?.id)
  );
  const inactiveTagsList = restTags.filter(
    (tag) => !activeTagIds.includes(tag?.id)
  );

  const orderedTags = [firstTag, ...activeTagsList, ...inactiveTagsList];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      <Grid direction="row" gap={8}>
        {orderedTags?.map((tag, key) => {
          const active = tag?.id && activeTags?.includes(tag?.id);

          return (
            <TouchableOpacity
              onPress={() => onTagPress(tag)}
              key={key}
              style={[
                styles.pill,
                active && { backgroundColor: REEF_DOCS_BLUE },
              ]}
            >
              <Text
                style={{
                  color: active ? WHITE : BLACK,
                }}
              >
                {tag.name}
              </Text>

              {active && tag?.id !== ALL_POST_TAG_ID && (
                <Icon name="close" width={16} height={16} />
              )}
            </TouchableOpacity>
          );
        })}
      </Grid>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pill: {
    padding: 8,
    backgroundColor: WHITE,
    borderRadius: 16,
    minWidth: 50,
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
  },
  container: {
    marginTop: 16,
  },
});
