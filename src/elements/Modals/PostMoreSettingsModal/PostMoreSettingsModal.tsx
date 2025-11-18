import React from "react";
import { Button, Grid } from "../../../components";
import { StyleSheet } from "react-native";
import { useDeletePost, useReportPost } from "../../../hooks/usePosts";
import { useModal } from "../../../hooks/useModal";
import { ButtonWithConfirmation } from "../../../components/ButtonWithConfirmation/ButtonWithConfirmation";

export const PostMoreSettingsModal = ({
  postId,
  isAuthor,
  postClassification,
  type,
}) => {
  const { closeModal, openModal } = useModal();

  const [reportPost, loading, error, success] = useReportPost();
  const [deletePost, loadingDelete, errorDelete, successDelete] =
    useDeletePost();

  const handleEditPost = () => {
    closeModal(() =>
      openModal({
        type: "helpPostModal",
        modalTitle: "Edit Post",
        height: "large",
        data: {
          classification: postClassification,
          icon: "reefDocsFish",
          edit: true,
          postId,
          taggable: {
            coral: true,
            liveStock: true,
            articles: false,
            tags: true,
            users: false,
          },
        },
      })
    );
  };

  const handleReportPost = async () => {
    await reportPost(postId);

    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  const handleDeletePost = async () => {
    await deletePost(postId, type);

    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  return (
    <Grid direction="column" gap={16} style={styles.container}>
      {isAuthor && (
        <Button
          title="Edit Post"
          variant="secondary"
          onPress={handleEditPost}
        />
      )}
      {isAuthor && (
        <ButtonWithConfirmation
          title="Delete Post"
          variant="primary"
          confirmationTitle="Are you sure ?"
          confirmationVariant="delete"
          onPress={handleDeletePost}
          isLoading={loadingDelete}
          success={successDelete}
          successMessage="Post Deleted!"
        />
      )}
      {!isAuthor && (
        <Button
          title="Report Post"
          onPress={handleReportPost}
          isLoading={loading}
          error={error}
          success={success}
          successMessage="Post Reported!"
        />
      )}
    </Grid>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
