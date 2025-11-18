import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Grid,
  GridItem,
  Heading,
  Icon,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../components";
import { useModal } from "../../../hooks/useModal";
import { BLACK, REEF_DOCS_BLUE, WHITE } from "../../../constants";
import { sendEventOnce } from "../../../utility/analytics";

export const LiveStockContributionInfoModal = ({ liveStockId }) => {
  const { closeModal } = useModal();

  sendEventOnce("LIVESTOCK_CONTRIBUTION_MODAL_OPEN", {
    liveStockId,
  });

  return (
    <ModalComposition
      footerFix
      renderFooter={() => (
        <Grid gap={8}>
          <Button title={"Close"} onPress={closeModal} variant="primary" />
        </Grid>
      )}
    >
      <View style={styles.wrapper}>
        <ModalHeader
          title="Livestock Guide"
          icon="reefDocsContribution"
          iconWidth={48}
          iconHeight={48}
        />

        <Grid gap={16}>
          <Text>
            Contribution Mode empowers reefers to share their experience in a
            structured way. Doing so gives vital insights based on the
            experience of many.
          </Text>

          <GridItem gap={8}>
            <Heading variant={5} weight="semiBold">
              Contributions
            </Heading>
            <Grid direction="row" gap={8}>
              <Icon name="reefDocsCamera" fill={BLACK} />
              <GridItem flex={1}>
                <Text>
                  Tap to view images submitted by other reefers. You can also
                  upload your own. All images are moderated to ensure quality.
                </Text>
              </GridItem>
            </Grid>
            <Grid direction="row" gap={8}>
              <Icon name="reefDocsVideo" fill={BLACK} />
              <GridItem flex={1}>
                <Text>
                  Tap to view videos submitted by other reefers. You can also
                  upload your own. Videos are muted and moderated to ensure
                  quality.
                </Text>
              </GridItem>
            </Grid>
            <Grid direction="row" gap={8}>
              <Icon name="reefDocsSubmitExperience" fill={BLACK} />
              <GridItem flex={1}>
                <Text>
                  Tap to read personal experiences submitted by other reefers.
                  Each user can submit one experience. All submissions are
                  moderated for quality.
                </Text>
              </GridItem>
            </Grid>
            <Grid direction="row" gap={8}>
              <Icon name="reefDocsContribution" fill={BLACK} />
              <GridItem flex={1}>
                <Text>
                  Vote Contribution Mode toggle. Allows you to enter vote
                  contribution mode.
                </Text>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem gap={8}>
            <Heading variant={5} weight="semiBold">
              Vote Contributions
            </Heading>
            <Grid direction="row" gap={8}>
              <View
                style={{
                  backgroundColor: REEF_DOCS_BLUE,
                  padding: 8,
                  borderRadius: 8,
                  flex: 1,
                  maxHeight: 55,
                  maxWidth: 100,
                  alignItems: "center",
                }}
              >
                <Icon
                  name="reefDocsContribution"
                  fill={WHITE}
                  strokeFill={WHITE}
                  width={32}
                  height={32}
                />
              </View>

              <GridItem flex={1}>
                <Text>
                  When in Vote Contribution Mode, votable content borders turn
                  blue. Tap an item to see voting options.
                </Text>
              </GridItem>
            </Grid>
            <Grid direction="row" gap={8}>
              <View
                style={{
                  backgroundColor: WHITE,
                  borderColor: REEF_DOCS_BLUE,
                  borderWidth: 2,
                  padding: 8,
                  borderRadius: 8,
                  flex: 1,
                  maxHeight: 55,
                  maxWidth: 100,
                  alignItems: "center",
                }}
              >
                <Icon
                  name="reefDocsCoralSafe"
                  fill={BLACK}
                  strokeFill={BLACK}
                  width={32}
                  height={32}
                />
              </View>

              <GridItem flex={1}>
                <Text>
                  When not in Vote Contribution Mode, borders return to their
                  original colors. Tap to view voting results and more details.
                </Text>
              </GridItem>
            </Grid>
            <Grid direction="row" gap={8}>
              <View
                style={{
                  backgroundColor: WHITE,
                  borderColor: BLACK,
                  borderWidth: 2,
                  padding: 8,
                  borderRadius: 8,
                  flex: 1,
                  maxWidth: 100,
                  maxHeight: 55,
                  alignItems: "center",
                }}
              >
                <Icon
                  name="reefDocsCoralSafe"
                  fill={BLACK}
                  strokeFill={BLACK}
                  width={32}
                  height={32}
                />
              </View>

              <GridItem flex={1}>
                <Text>
                  When NOT IN vote contribution mode, the border return to its
                  original colors. Tap it to see the voting results and extra
                  information.
                </Text>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem gap={8}>
            <Heading variant={5} weight="semiBold">
              Quick Menu
            </Heading>
            <Grid direction="row" gap={8}>
              <View
                style={{
                  backgroundColor: REEF_DOCS_BLUE,
                  borderColor: REEF_DOCS_BLUE,
                  borderWidth: 2,
                  padding: 8,
                  borderRadius: 40,
                  flex: 1,
                  maxWidth: 60,
                  height: 60,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="menu" fill={WHITE} width={32} height={32} />
              </View>

              <GridItem flex={1}>
                <Text>Tap the Quick Menu for shortcuts to extra features.</Text>
              </GridItem>
            </Grid>

            <Grid direction="row" gap={8}>
              <Icon name="reefDocsWishList" fill={BLACK} />
              <GridItem flex={1}>
                <Text>
                  Tap to add this livestock to your wishlist, which appears on
                  the Explore (Home) screen. Tap again to remove it.
                </Text>
              </GridItem>
            </Grid>
            <Grid direction="row" gap={8}>
              <Icon name="reefDocsAddToTank" fill={BLACK} />
              <GridItem flex={1}>
                <Text>
                  Tap to add this livestock to your tank. If you have more than
                  one tank, a second input will appear asking you to select your
                  tank.
                </Text>
              </GridItem>
            </Grid>
            <Grid direction="row" gap={8}>
              <Icon name="reefDocsShare" fill={BLACK} />
              <GridItem flex={1}>
                <Text>
                  Tap to share this livestock with others. Choose your preferred
                  method after tapping.
                </Text>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
});
