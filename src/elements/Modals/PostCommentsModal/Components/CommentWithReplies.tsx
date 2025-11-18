import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { CommentItem } from "./CommentItem";
import { Text } from "../../../../components";

export const renderComments = ({
  comments,
  handleVote,
  handleStartReply,
  expandedCommentIds,
  handleCommentLongPress,
  handleFullScreenImage,
  handlePostResourcePress,
}) =>
  comments.map((comment) => (
    <CommentWithReplies
      key={comment.id}
      comment={comment}
      handleVote={handleVote}
      handleStartReply={handleStartReply}
      expandedCommentIds={expandedCommentIds}
      handleCommentLongPress={handleCommentLongPress}
      handleFullScreenImage={handleFullScreenImage}
      handlePostResourcePress={handlePostResourcePress}
    />
  ));

const MAX_DEPTH = 3;

export const CommentWithReplies = ({
  comment,
  logicalDepth = 0,
  visualDepth = 0,
  handleVote,
  handleStartReply,
  expandedCommentIds = [],
  isReply = false,
  handleCommentLongPress,
  handleFullScreenImage,
  handlePostResourcePress,
}) => {
  const isExpanded = expandedCommentIds.includes(comment.id);
  const [showAllReplies, setShowAllReplies] = useState(isExpanded);

  useEffect(() => {
    if (isExpanded) setShowAllReplies(true);
  }, [isExpanded]);

  const replies = comment.replies || [];
  const showSingle = replies.length === 1;
  const showMultiple = replies.length > 1;

  const visibleReplies =
    showSingle || showAllReplies || logicalDepth >= MAX_DEPTH ? replies : [];

  const canShowControl =
    showMultiple && !showAllReplies && logicalDepth < MAX_DEPTH;

  return (
    <View
      style={{
        marginLeft: visualDepth > 2 ? 3 : visualDepth * 24,
        marginTop: 16,
      }}
    >
      <CommentItem
        userImage={comment?.user?.image}
        created_at={comment?.created_at}
        handleVote={handleVote}
        richTextContent={comment?.richTextContent}
        displayName={comment?.user?.displayName}
        comment={comment}
        totalUpvote={comment?.totalUpvote}
        onReply={() => handleStartReply(comment.id, comment.user.userName)}
        isReply={isReply}
        handleCommentLongPress={handleCommentLongPress}
        handleFullScreenImage={handleFullScreenImage}
        handlePostResourcePress={handlePostResourcePress}
      />

      {visibleReplies.map((reply) => (
        <CommentWithReplies
          key={reply.id}
          comment={reply}
          logicalDepth={logicalDepth + 1}
          visualDepth={Math.min(visualDepth + 1, MAX_DEPTH)}
          handleVote={handleVote}
          handleStartReply={handleStartReply}
          expandedCommentIds={expandedCommentIds}
          isReply={true}
          handleCommentLongPress={handleCommentLongPress}
          handleFullScreenImage={handleFullScreenImage}
          handlePostResourcePress={handlePostResourcePress}
        />
      ))}

      {canShowControl && (
        <TouchableOpacity
          onPress={() => setShowAllReplies(true)}
          style={{ marginTop: 8, marginLeft: (visualDepth + 1) * 12 }}
        >
          <Text style={{ fontWeight: "bold", color: "#555" }}>
            Show all {replies.length} replies
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
