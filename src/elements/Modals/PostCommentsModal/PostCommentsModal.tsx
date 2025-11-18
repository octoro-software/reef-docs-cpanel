import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useForm, useWatch } from "react-hook-form";

import {
  AppImage,
  Button,
  Grid,
  GridItem,
  Icon,
  ModalComposition,
  SlideInModal,
  Text,
} from "../../../components";

import { BLACK, INPUT_BORDER_COLOR, WHITE } from "../../../constants";

import { useUser } from "../../../hooks/useAuth";

import {
  useAddPostComment,
  useDeleteComment,
  useGetPostComments,
  usePostCommentVote,
  useReportComment,
  useUpdatePostComment,
} from "../../../hooks/usePosts";

import { MentionTextInput } from "../../../components/Form/MentionTextInput/MentionTextInput";
import { getAppDimensions } from "../../../utility/dimensions";
import { captureError } from "../../../utility/errors";

import { NoDataFallbackCard } from "../../NoDataFallbackCard/NoDataFallbackCard";
import { renderComments } from "./Components/CommentWithReplies";
import { Skeleton } from "../../../components/Skeleton/Skeleton";
import { ButtonWithConfirmation } from "../../../components/ButtonWithConfirmation/ButtonWithConfirmation";
import { useCameraOrMedia } from "../../../utility/camera";
import { useModal } from "../../../hooks/useModal";
import { useAppDispatch } from "../../../hooks/useRedux";
import { removePostById } from "../../../store/slices/postSlice";

const width = getAppDimensions().width;

const PostCommentInterface = ({
  postId,
  handleGetComments,
  listRef,
  replyingToComment,
  cancelReply,
  editingComment,
  editCommentData,
  cancelEditing,
}) => {
  const [loading, setLoading] = useState(false);
  const [addPostComment] = useAddPostComment();
  const [updatePostComment] = useUpdatePostComment();
  const [mentionPrefix, setMentionPrefix] = useState("");

  const { control, setValue, reset } = useForm({});

  const value = useWatch({ name: "comment", control });
  const image = useWatch({ name: "image", control });
  const existingImages = useWatch({ name: "images", control });

  const handleAddComment = async () => {
    setLoading(true);

    const formData: any = new FormData();

    formData.append(
      "content",
      mentionPrefix ? `${mentionPrefix} ${value}` : value
    );
    formData.append("postId", postId);
    formData.append("replyingToCommentId", replyingToComment?.commentId || "");
    formData.append(
      "replyingToCommentUserName",
      replyingToComment?.userName || ""
    );
    formData.append("id", editCommentData?.id || "");
    formData.append("images", JSON.stringify(existingImages || []));

    if (image) {
      formData.append(`image`, {
        uri: image.uri,
        name: image.fileName || `image_${0}.jpg`,
        type: image.type || "image/jpeg",
      });
    }

    try {
      if (editingComment) {
        await updatePostComment(formData);
      } else {
        await addPostComment(formData);
      }
    } catch (error) {
      captureError(error, "Error adding comment");
    }

    setValue("comment", "");

    await handleGetComments();

    reset({ comment: "", image: null });

    Keyboard.dismiss();

    handleCancelEditing();

    try {
      listRef?.current?.scrollToEnd({ animated: true });
    } catch (error) {}

    handleCancel();

    setLoading(false);
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    setMentionPrefix("");
    cancelReply && cancelReply();
  };

  const handleCancelEditing = () => {
    Keyboard.dismiss();
    setMentionPrefix("");
    setValue("image", null);
    setValue("images", null);
    setValue("comment", "");
    cancelEditing && cancelEditing();
  };

  useEffect(() => {
    if (replyingToComment) {
      const mentionText = `{@}[${replyingToComment.userName}](user-${replyingToComment.userName})`;
      setMentionPrefix(mentionText);
    }
  }, [replyingToComment]);

  useEffect(() => {
    if (editingComment && editCommentData) {
      setValue("comment", editCommentData?.content || "");
      setValue("image", editCommentData?.image || null);
      setValue("images", editCommentData?.images || null);
    }

    if (!editingComment) {
      setValue("comment", "");
      setValue("image", null);
      setValue("images", null);
    }
  }, [editingComment, editCommentData]);

  const handleChange = (value) => {
    setValue("comment", value);
  };

  const handleMediaChoice = (key, result) => {
    setValue(key, result?.assets?.[0]);
  };
  const { CameraMediaModal } = useCameraOrMedia(handleMediaChoice);

  const handleClearImage = () => {
    setValue("image", null);
    setValue("images", null);
  };

  const hasImage = !!image || existingImages?.length > 0;

  const disableSubmit = !value && !hasImage;

  return (
    <Grid direction="column" gap={8}>
      <GridItem flex={1}>
        {replyingToComment && (
          <Grid direction="row" gap={8}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              {`Replying to @${replyingToComment.userName}`}
            </Text>
            <TouchableOpacity onPress={handleCancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </Grid>
        )}
        {editingComment && (
          <Grid direction="row" gap={8}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              {`Editing comment...`}
            </Text>
            <TouchableOpacity onPress={handleCancelEditing}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </Grid>
        )}
        <MentionTextInput
          taggable={{
            coral: true,
            liveStock: true,
            articles: false,
            tags: true,
            users: true,
          }}
          focus={!!replyingToComment}
          onChange={handleChange}
          placeholder={"Add a comment..."}
          value={value}
          textAlignVertical="middle"
          hideSuggestionSearch={true}
          multiline={true}
          minHeight={false}
          style={{ backgroundColor: INPUT_BORDER_COLOR, color: BLACK }}
          suggestionContainerStyle={{
            top: -200,
            height: 200,
            width: width,
            left: -16,
            borderRadius: 0,
          }}
        />
      </GridItem>
      <Grid direction="row" justifyContent="space-between" gap={8}>
        <Grid direction="row" gap={8}>
          <CameraMediaModal
            limit={1}
            keyName="image"
            maxSizeMB={100}
            video={false}
            beforeOnPress={() => Keyboard.dismiss()}
          >
            <Icon name="reefDocsCamera" width={32} />
          </CameraMediaModal>
          {hasImage && (
            <TouchableOpacity onPress={handleClearImage}>
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: -4,
                  right: -4,
                  width: 16,
                  height: 16,
                  backgroundColor: "red",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="close" width={12} height={12} fill={WHITE} />
              </View>
              {image ? (
                <Image
                  source={{ uri: image?.uri }}
                  width={48}
                  height={48}
                  style={styles.imagePreview}
                />
              ) : existingImages ? (
                <AppImage
                  path={existingImages?.[0]}
                  width={48}
                  height={48}
                  style={styles.imagePreview}
                />
              ) : null}
            </TouchableOpacity>
          )}
        </Grid>
        <Button
          variant={disableSubmit ? "grey" : "secondary"}
          disabled={disableSubmit}
          onPress={handleAddComment}
          isLoading={loading}
          iconRight="send"
        />
      </Grid>
    </Grid>
  );
};

export const PostCommentsModal = ({
  postId,
  commentId,
  classification,
  type,
}) => {
  const { openModal, closeModal } = useModal();

  const [replyingToComment, setReplyingToComment] = useState(null);

  const [editingComment, setEditingComment] = useState(null);

  const [commentMoreOptions, setCommentMoreOptions] = useState({
    open: false,
    isAuthor: false,
  });

  const [expandedCommentIds, setExpandedCommentIds] = useState([]);

  const handleCommentLongPress = (comment) => {
    const isAuthor = comment?.user?.userName === userName;

    setCommentMoreOptions({
      ...comment,
      open: true,
      isAuthor,
    });
  };

  const updateExpandedCommentIds = (ids) => {
    setExpandedCommentIds(ids);
  };

  const handleFullScreenImage = (uri) => {
    openModal({
      type: "imageFullScreenModal",
      height: "large",
      modalTitle: "Image",
      data: { imageUri: uri },
    });
  };

  const findPathToComment = (comments, targetId, path = []) => {
    for (let comment of comments) {
      const newPath = [...path, comment.id];
      if (comment.id === targetId) return newPath;
      if (comment.replies?.length) {
        const found = findPathToComment(comment.replies, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  const { userName } = useUser();

  const listRef = useRef(null);

  const dispatch = useAppDispatch();

  const [notFoundOrReported, setNotFoundOrReported] = useState(false);

  const [targetIndex, setTargetIndex] = useState(null);

  const [showSkeleton, setShowSkeleton] = useState(false);

  const [postComments, setPostComments] = React.useState([]);

  const [deleteComment] = useDeleteComment();

  const [reportComment] = useReportComment();

  const [getPostComments, loading] = useGetPostComments(postId);

  const [commentVote] = usePostCommentVote(postId);

  const handleCancel = () => {
    setReplyingToComment(null);
  };

  const handleCancelEditing = () => {
    setEditingComment(null);
  };

  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);

  const handleDeleteComment = async () => {
    setDeleteCommentLoading(true);

    await deleteComment(commentMoreOptions?.id);

    await handleGetComments();

    setDeleteCommentLoading(false);

    setCommentMoreOptions((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleEditComment = () => {
    setCommentMoreOptions((prev) => ({
      ...prev,
      open: false,
    }));

    handleCancel(); // cancel reply
    setEditingComment(true);
  };

  const handleReportComment = async () => {
    await reportComment(commentMoreOptions?.id);

    setCommentMoreOptions((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleGetComments = async () => {
    const response = await getPostComments();

    if (response?.notFoundOrReported) {
      setPostComments([]);
      setNotFoundOrReported(true);
      dispatch(removePostById({ type, classification, postId }));
    } else {
      setPostComments(response);
    }

    if (commentId && response?.length) {
      const pathToTarget = findPathToComment(response, commentId);
      if (pathToTarget) {
        updateExpandedCommentIds(pathToTarget.slice(0, -1)); // expand all parents, not the target itself
      }

      const flatComments = flattenComments(response);
      const index = flatComments.findIndex((item) => item.id === commentId);
      if (index !== -1) setTargetIndex(index);
    }
  };

  const flattenComments = (comments, flat = []) => {
    for (let comment of comments) {
      flat.push(comment);
      if (comment.replies?.length) {
        flattenComments(comment.replies, flat);
      }
    }
    return flat;
  };

  useEffect(() => {
    if (targetIndex !== null && listRef.current && postComments?.length) {
      try {
        listRef?.current?.scrollToIndex({
          index: targetIndex,
          animated: true,
        });
      } catch (e) {
        console.warn("ScrollToIndex failed:", e);
      }
    }
  }, [targetIndex]);

  const handleVote = async (upvote, comment) => {
    if (comment.user.userName === userName) return;

    await commentVote(upvote, comment.id);

    await handleGetComments();
  };

  const handleStartReply = (commentId, userName) => {
    handleCancelEditing(); //cancel edit

    setReplyingToComment({
      commentId,
      userName,
    });
  };

  const handlePostResourcePress = (resourceId: string) => {
    openModal({
      type: "postResourceModal",
      modalTitle: "Post Resources",
      height: "large",
      data: {
        resourceId,
        commentsModal: true,
      },
    });
  };

  useEffect(() => {
    handleGetComments();
  }, []);

  useEffect(() => {
    let timeout;
    if (loading) {
      timeout = setTimeout(() => {
        setShowSkeleton(true);
      }, 400);
    } else {
      setShowSkeleton(false);
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [loading]);
  return (
    <ModalComposition
      footerFix
      disableScroll={true}
      stickyFooter
      renderFooter={() =>
        !notFoundOrReported ? (
          <PostCommentInterface
            postId={postId}
            handleGetComments={handleGetComments}
            listRef={listRef}
            replyingToComment={replyingToComment}
            editingComment={editingComment}
            editCommentData={commentMoreOptions}
            cancelReply={handleCancel}
            cancelEditing={handleCancelEditing}
          />
        ) : null
      }
    >
      <View style={styles.container}>
        {showSkeleton ? (
          <>
            {[...Array(12)].map((_, idx) => (
              <Grid direction="row" key={idx} gap={8}>
                <GridItem>
                  <Skeleton
                    style={{ borderRadius: 80 }}
                    width={42}
                    height={42}
                  />
                </GridItem>
                <GridItem flex={1}>
                  <Skeleton style={styles.commentText} height={50} />
                  <Skeleton style={styles.commentText} height={8} />
                </GridItem>
              </Grid>
            ))}
          </>
        ) : postComments.length === 0 ? (
          notFoundOrReported ? (
            <NoDataFallbackCard
              title="Post Not Available"
              icon="reefDocsFish"
              description="This post has been reported or has been removed by the author."
              buttonTitle="Close"
              onPress={() => closeModal()}
            />
          ) : (
            <NoDataFallbackCard
              title="No Comments Yet!"
              icon="reefDocsComment"
              description="Be the first to comment"
            />
          )
        ) : (
          <ScrollView
            ref={listRef}
            contentContainerStyle={{ paddingBottom: 160 }}
          >
            {renderComments({
              comments: postComments,
              handleVote,
              handleStartReply,
              expandedCommentIds,
              handleCommentLongPress,
              handleFullScreenImage,
              handlePostResourcePress,
            })}
          </ScrollView>
        )}
      </View>

      <SlideInModal
        visible={commentMoreOptions.open}
        title="More Options"
        height={400}
        scrollView
        onClose={() =>
          setCommentMoreOptions((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <View style={{ padding: 16 }}>
          <Grid direction="column" gap={8}>
            {commentMoreOptions?.isAuthor && (
              <Button
                title="Edit"
                variant="secondary"
                onPress={handleEditComment}
              />
            )}
            {!commentMoreOptions?.isAuthor && (
              <Button title="Report" onPress={handleReportComment} />
            )}
            {commentMoreOptions?.isAuthor && (
              <ButtonWithConfirmation
                confirmationTitle="Confirm Delete?"
                confirmationVariant="delete"
                title="Delete"
                onPress={handleDeleteComment}
                isLoading={deleteCommentLoading}
              />
            )}
          </Grid>
        </View>
      </SlideInModal>
    </ModalComposition>
  );
};

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
  imagePreview: {
    borderRadius: 8,
  },
});
