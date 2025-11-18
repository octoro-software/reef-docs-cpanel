import React from "react";
import {
  AppImage,
  Grid,
  GridItem,
  Icon,
  RichText,
  Text,
} from "../../../../components";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { INPUT_BORDER_COLOR, REEF_DOCS_BLUE } from "../../../../constants";
import { getTimeAgoShort } from "../../../../utility/date";

type CommentItemProps = {
  userImage: string;
  created_at: string;
  handleVote: (isUpvote: boolean, comment: any) => void;
  richTextContent: string;
  displayName: string;
  comment: any;
  totalUpvote: number;
  onReply: () => void;
  isReply?: boolean;
  verifiedUser?: boolean;
  handleCommentLongPress: (comment: any) => void;
};

export const CommentItem: React.FC<CommentItemProps> = React.memo(
  ({
    userImage,
    created_at,
    handleVote,
    richTextContent,
    displayName,
    comment,
    totalUpvote,
    onReply,
    isReply,
    handleCommentLongPress,
    handleFullScreenImage,
    handlePostResourcePress,
  }) => {
    const timeAgo = created_at ? getTimeAgoShort(new Date(created_at)) : "";

    return (
      <Grid direction="row" gap={8}>
        <GridItem>
          <AppImage
            path={userImage}
            width={isReply ? 24 : 42}
            height={isReply ? 24 : 42}
            style={{ borderRadius: 20, borderWidth: 1, borderColor: "#ccc" }}
          />
        </GridItem>

        <GridItem flex={1}>
          <View>
            <TouchableOpacity
              onLongPress={() => handleCommentLongPress(comment)}
              style={styles.commentBlock}
            >
              <Grid
                direction="row"
                alignItems="center"
                gap={4}
                justifyContent="space-between"
              >
                <Grid direction="row" alignItems="center" gap={4}>
                  <Text weight="bold">{displayName}</Text>

                  {comment?.user?.verifiedUser && (
                    <Icon
                      name="verifiedUser"
                      width={14}
                      height={14}
                      fill={REEF_DOCS_BLUE}
                    />
                  )}
                </Grid>
                {comment?.edited && (
                  <Text style={{ fontSize: 12, textAlign: "right" }}>
                    Edited
                  </Text>
                )}
              </Grid>
              <RichText
                html={richTextContent}
                showMore={true}
                charLimit={250}
                renderersProps={{
                  a: {
                    onPress: (_, href) => {
                      if (href.includes("liveStock")) {
                        return handlePostResourcePress(
                          href.split("liveStock://")[1]
                        );
                      }
                    },
                  },
                }}
              />
            </TouchableOpacity>

            {comment?.images &&
              comment?.moderatorMediaVerified &&
              comment?.images?.map((image, key) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleFullScreenImage(image)}
                    onLongPress={() => handleCommentLongPress(comment)}
                    activeOpacity={0.8}
                    key={key}
                  >
                    <AppImage
                      path={image}
                      width={"100%"}
                      height={500}
                      style={{
                        resizeMode: "cover",
                        marginTop: 8,
                        borderRadius: 8,
                      }}
                    />
                  </TouchableOpacity>
                );
              })}

            <Grid
              direction="row"
              justifyContent="space-between"
              gap={16}
              style={{ marginTop: 4 }}
            >
              <Grid direction="row" gap={12} alignItems="center">
                <TouchableOpacity onPress={() => handleVote(true, comment)}>
                  <Grid direction="row" gap={4}>
                    <Text weight="bold">{totalUpvote?.toString()}</Text>
                    <Text
                      style={
                        comment?.userHasVoted ? { color: REEF_DOCS_BLUE } : {}
                      }
                      weight={comment?.userHasVoted ? "bold" : "normal"}
                    >
                      {comment?.userHasVoted ? "Liked" : "Like"}
                    </Text>
                  </Grid>
                </TouchableOpacity>

                <TouchableOpacity onPress={onReply}>
                  <Grid direction="row" gap={4}>
                    <Text>Reply</Text>
                  </Grid>
                </TouchableOpacity>
              </Grid>
              <Grid direction="row" gap={4}>
                <Text style={{ fontSize: 12 }} weight="bold">
                  {timeAgo}
                </Text>
              </Grid>
            </Grid>
          </View>
        </GridItem>
      </Grid>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  commentText: {
    backgroundColor: INPUT_BORDER_COLOR,
    borderRadius: 8,
    flexWrap: "wrap",
  },
  repuation: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  commentBlock: {
    backgroundColor: INPUT_BORDER_COLOR,
    padding: 8,
    borderRadius: 8,
    flexShrink: 1,
  },
});
