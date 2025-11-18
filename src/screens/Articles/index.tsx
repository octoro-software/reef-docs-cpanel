import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Grid, GridItem, Heading, Icon, Text } from "../../components";

import { useNavigate, useParams } from "react-router-native";
import { RichText } from "../../components/RichText/RichText";
import { BLACK, INPUT_BORDER_COLOR, WHITE } from "../../constants";
import { AppImage } from "../../components/AppImage/AppImage";
import { useGetArticleBySlug } from "../../hooks/useArticles";

export const ArticleScreen = () => {
  const [data, setData] = useState();

  const { url } = useParams();

  const [getArticleBySlug] = useGetArticleBySlug();

  const navigate = useNavigate();

  const handleGetArticle = async () => {
    const response = await getArticleBySlug(url);

    if (response?.status === 200) {
      setData(response?.data?.data);
    }
  };

  const handlePreviousStep = () => navigate(-1);

  useEffect(() => {
    handleGetArticle();
  }, [url]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => handlePreviousStep()}
        style={[styles.menuWrapper, { marginBottom: 16 }]}
      >
        <Grid direction="row" gap={8}>
          <Icon name="chevronLeft" fill={BLACK} />
          <GridItem flex={1} justifyContent="center">
            <Text>Back</Text>
          </GridItem>
        </Grid>
      </TouchableOpacity>
      <Heading variant={4} weight="semiBold">
        {data?.title}
      </Heading>

      <Grid
        direction="row"
        gap={8}
        alignItems="center"
        style={{ marginBottom: 16, marginTop: 8 }}
      >
        <Grid direction="row" alignItems="center" gap={8}>
          <Icon
            name="reefDocsArticles"
            width={32}
            height={32}
            strokeWidth={1}
          />

          <Text>
            <Text weight="bold">{data?.readTime ?? 20} </Text>Minute Read
          </Text>
        </Grid>
        <Grid direction="row" style={{ flex: 1 }}>
          <Text>Author:</Text>
          <View style={{ position: "absolute", left: 40, top: -20 }}>
            <AppImage
              path="app/logo.png"
              transform={false}
              width={64}
              height={64}
              resizeMode="cover"
            />
          </View>
        </Grid>
      </Grid>

      <TouchableWithoutFeedback onPress={() => null}>
        <RichText html={data?.content} />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  menuWrapper: {
    padding: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: INPUT_BORDER_COLOR,
    backgroundColor: WHITE,
    marginLeft: -16,
    marginRight: -16,
    marginTop: -16,
  },
});
