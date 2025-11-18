import React from "react";
import { StyleSheet } from "react-native";

import {
  Button,
  Grid,
  Heading,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";

import { useModal } from "../../../../hooks/useModal";

export const HelpPostComplete = ({ icon, edit }) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button title="Close" variant="primary" onPress={closeModal} />
        </Grid>
      )}
    >
      <Grid gap={16}>
        <ModalHeader
          icon={icon}
          iconHeight={48}
          iconWidth={48}
          title={edit ? "Post Updated" : "Post Submitted"}
        />

        <Heading variant={5} weight="regular">
          Moderation ( Please Read )
        </Heading>

        <Text style={styles.contentText}>
          We aim to review all posts within 2 hours, but depending on your
          region or the time, this may take slightly longer. We do this to
          ensure community safety and to prevent malicious acts where possible.
          We will monitor and increase moderator capacity as required. You will
          receieve a notification once your post has been reviewed, please
          ensure notifications and the post scope are enabled.
        </Text>

        <Heading variant={5} weight="regular">
          Videos
        </Heading>

        <Text style={styles.contentText}>
          If you've uploaded large videos, you will see a progress bar at the
          top of the screen indicating the upload status. Once the upload is
          complete, your post will undergo screening. To learn more about our
          screening procedures, please see below.
        </Text>

        <Heading variant={5} weight="regular">
          Community Safety
        </Heading>

        <Text style={styles.contentText}>
          All posts undergo an automated approval process to ensure a safe
          environment. In rare cases, inappropriate content may slip through,
          and we encourage users to report such posts as soon as possible.
        </Text>

        <Heading variant={5} weight="regular">
          Post Review
        </Heading>

        <Heading variant={6} weight="regular">
          Video & Image Screening
        </Heading>

        <Text style={styles.contentText}>
          All uploaded images and videos are screened for inappropriate content.
          Any flagged media will not be posted, and you will receive a
          notification if this occurs.
        </Text>

        <Heading variant={6} weight="regular">
          Content Screening
        </Heading>

        <Text style={styles.contentText}>
          All text submissions are screened for profanity. Additionally, phone
          numbers, website links, and email addresses are not permitted. Any
          flagged content will be modified while keeping the post visible.
        </Text>
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  contentText: {
    fontSize: 12,
  },
});
