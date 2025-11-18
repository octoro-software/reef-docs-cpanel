import React from "react";

import {
  Button,
  Grid,
  GridItem,
  Heading,
  Icon,
  ModalComposition,
  RichText,
} from "../../../components";
import { useModal } from "../../../hooks/useModal";

export const SocialHelpModal = ({}) => {
  const { closeModal } = useModal();

  const updateInformation = [
    {
      title: "Post",
      description: `<p>Please tag when creating a post where possible. Include the live stock, plant or coral if we have it. This will help us build the information and resource for the community.</p>
        `,
    },
    {
      title: "Menu",
      description: `<p>Access the menu wheel below to view different feeds.</p>
        `,
    },
    {
      title: "Urgent Posts",
      description: `<p>When creating your post you will have an option to select urgent. Selecting Urgent will offer priority approval as well as home screen exposure. This is reserved for emergencies only and we will decline posts that do not meet this.</p>
        `,
    },
    {
      title: "Save Posts",
      description: `<p>Save any posts from the feed. Use the wheel to access your saved posts.</p>
        `,
    },
    {
      title: "Comments",
      description: `<p>Comments are moderated live, when you submit a comment with an image it is moderated. Please wait a few seconds.</p>
        `,
    },
    {
      title: "Reporting",
      description: `<p>Report a post using the 3 dots in the top right corner of the post. Report a comment by pressing and holding on the comment.</p>
        `,
    },
    {
      title: "Support",
      description: `<p>Please report any issues to us directly via email or feedback. We may need to contact you via email for clarity so please keep this in mind.</p>
        `,
    },
  ];
  const nextUpdateInformation = [];

  return (
    <ModalComposition
      footerFix
      renderFooter={() => (
        <Button variant="primary" onPress={closeModal} title="Got It!" />
      )}
    >
      <Grid direction="column" gap={8} style={{ padding: 16 }}>
        <GridItem flex={1} justifyContent="center" alignItems="center">
          <Icon name="reefDocsComment" />
        </GridItem>

        <Heading variant={4} weight="semiBold" style={{ textAlign: "center" }}>
          Social Help
        </Heading>

        <Grid direction="column" gap={8}>
          {updateInformation.map((item, index) => (
            <GridItem key={index}>
              <Heading variant={5} weight="semiBold">
                {item.title}
              </Heading>
              <RichText html={item.description} />
            </GridItem>
          ))}
        </Grid>
      </Grid>
    </ModalComposition>
  );
};
