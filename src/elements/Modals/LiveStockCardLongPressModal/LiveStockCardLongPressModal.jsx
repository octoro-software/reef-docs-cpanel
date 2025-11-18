import React, { useRef } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";

import QRCode from "react-native-qrcode-svg";

import { useModal } from "../../../hooks/useModal";
import { Button, Grid, GridItem, Heading } from "../../../components";

import logo from "../../../logo.png";

export const LiveStockCardLongPressModal = ({ name, id }) => {
  const { closeModal } = useModal();
  const qrRef = useRef();

  const handleDownloadQrCode = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Cannot save image without permission."
        );
        return;
      }

      const uri = await captureRef(qrRef, {
        format: "png",
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Saved", "QR Code saved to gallery.");
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to save QR code.");
    }
  };

  const handlePrintQrCode = async () => {
    try {
      const base64 = await captureRef(qrRef, {
        format: "png",
        quality: 1,
        result: "base64",
      });

      const html = `
        <html>
          <head>
            <style>
              @page { size: 57mm 32mm; margin: 0; } /* customize for label size */
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: white;
              }
              img {
                width: 90%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <img src="data:image/png;base64,${base64}" />
          </body>
        </html>
      `;

      await Print.printAsync({ html });
    } catch (error) {
      console.error("Print error:", error);
      Alert.alert("Error", "Failed to print QR code.");
    }
  };

  return (
    <View style={styles.container}>
      <Heading style={styles.heading} variant={5} weight="semiBold">
        {name}
      </Heading>

      <View ref={qrRef} collapsable={false} style={styles.qrWrapper}>
        <QRCode
          value={`livestock://${id}`}
          size={200}
          logo={logo}
          logoBackgroundColor="transparent"
        />
      </View>

      <Grid gap={8} direction="column">
        <GridItem>
          <Button
            variant="secondary"
            title="Print QR Code"
            onPress={handlePrintQrCode}
            style={styles.button}
          />
        </GridItem>
        <GridItem>
          <Button
            variant="secondary"
            title="Download QR Code"
            onPress={handleDownloadQrCode}
            style={styles.button}
          />
        </GridItem>
      </Grid>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    textAlign: "center",
    marginBottom: 8,
  },
  button: {
    color: "black",
  },
  qrWrapper: {
    alignSelf: "center",
    marginVertical: 16,
    backgroundColor: "white", // ensures QR background is visible
    padding: 10,
  },
});
