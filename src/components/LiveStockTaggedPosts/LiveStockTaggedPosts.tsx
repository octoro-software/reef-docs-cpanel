import React, { useEffect, useState } from "react";
import { useLiveStockTaggedPosts } from "../../hooks/useLiveStock";
import { Carousel } from "../../elements/Carousel/Carousel";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../Text/Text";
import { RichText } from "../RichText/RichText";
import { INPUT_BORDER_COLOR, REEF_DOCS_BLUE } from "../../constants";
import { Grid } from "../Grid/Grid";
import { createAppDate } from "../../utility/date";
import { useNavigate } from "react-router-native";

export const LiveStockTaggedPosts = ({ liveStockId }) => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [getPosts, loading] = useLiveStockTaggedPosts();

  const fetchPosts = async () => {
    const response = await getPosts(liveStockId);

    if (response?.data) {
      setData(response?.data);
    }
  };

  const handlePress = (item) => {
    navigate(`/social?postId=${item.id}`);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Carousel
      data={data}
      loading={loading}
      slidesToShow={1.4}
      title="Tagged Posts"
      showAllResultsUrl={`/social?liveStockId=${liveStockId}`}
      renderCard={(item) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: INPUT_BORDER_COLOR,
              height: 90,
            }}
          >
            <RichText
              html={`${item?.richTextContent}`}
              charLimit={70}
              showMore={true}
              hideShowMoreLabel={true}
            />
          </View>
          <Grid
            direction="row"
            justifyContent="space-between"
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Text style={{ fontSize: 12, color: REEF_DOCS_BLUE }}>
              @{item?.user?.userName}
            </Text>

            <Text style={{ fontSize: 12 }}>
              {createAppDate(item?.created_at)}
            </Text>
          </Grid>
        </TouchableOpacity>
      )}
    />
  );
};
