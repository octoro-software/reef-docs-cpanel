import React from "react";
import { Grid, GridItem, Icon } from "../../components";
import { BLACK, WHITE } from "../../constants";
import { TouchableOpacity } from "react-native";

export const UserPostQuickOptions = () => {
  return <></>;
  return (
    <Grid
      style={{ marginTop: 4 }}
      direction="row"
      justifyContent="space-between"
      gap={1}
    >
      <GridItem
        alignItems="center"
        flex={1}
        style={{
          backgroundColor: WHITE,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          marginTop: 8,
          padding: 6,
        }}
      >
        <TouchableOpacity>
          <Icon name="reefDocsWishList" width={32} height={32} fill={BLACK} />
        </TouchableOpacity>
      </GridItem>
      <GridItem
        alignItems="center"
        flex={1}
        style={{
          backgroundColor: WHITE,
          marginTop: 8,
          padding: 6,
        }}
      >
        <TouchableOpacity>
          <Icon name="reefDocsWishList" width={32} height={32} fill={BLACK} />
        </TouchableOpacity>
      </GridItem>
      <GridItem
        alignItems="center"
        flex={1}
        style={{
          backgroundColor: WHITE,

          marginTop: 8,
          padding: 6,
        }}
      >
        <TouchableOpacity>
          <Icon name="reefDocsWishList" width={32} height={32} fill={BLACK} />
        </TouchableOpacity>
      </GridItem>
      <GridItem
        alignItems="center"
        flex={1}
        style={{
          backgroundColor: WHITE,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          marginTop: 8,
          padding: 6,
        }}
      >
        <TouchableOpacity>
          <Icon name="reefDocsWishList" width={32} height={32} fill={BLACK} />
        </TouchableOpacity>
      </GridItem>
    </Grid>
  );
};
