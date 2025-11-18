import React from "react";
import {
  AppImage,
  Button,
  Grid,
  GridItem,
  Heading,
  RichText,
  Text,
} from "../../components";
import { WHITE } from "../../constants";
import { getAppDimensions } from "../../utility/dimensions";

export const UsedEquipmentMarketplace = () => {
  return (
    <Grid
      direction="column"
      gap={16}
      style={{
        backgroundColor: WHITE,
        margin: -16,
        padding: 16,
        marginTop: -6,
        minHeight: getAppDimensions().height,
      }}
    >
      <GridItem alignItems="center">
        <AppImage
          path="/app/equipment-marketplace.png"
          width={200}
          height={200}
          style={{ resizeMode: "contain" }}
        />
      </GridItem>

      <Heading variant={4} weight="semiBold" style={{ textAlign: "center" }}>
        Equipment Marketplace
      </Heading>
      <Text style={{ textAlign: "center", marginTop: -16 }}>
        Saltwater and Freshwater
      </Text>

      <RichText
        html={`<p>Grab a bargain, <b>buy used equipment</b> at unbeatable prices!</p>`}
      />
      <RichText
        html={`<p>If your getting out of the hobby, or just getting started. This is the place for you.</p>`}
      />

      <RichText
        html={`<p>Vendors are all <b>verified</b> and have public reputation features. We emplor strict selling procedures to ensure <b>quality</b> and <b>trust</b> in every transaction.</p>`}
      />

      <Button title="Coming Soon" variant="secondary" />
    </Grid>
  );
};
