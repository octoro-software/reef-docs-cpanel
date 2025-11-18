import React from "react";
import { Platform } from "react-native";

import {
  Button,
  Grid,
  Heading,
  Text,
  ModalComposition,
} from "../../../../components";

export const ICPImportGuide = ({ handleGuideBack }) => {
  return (
    <ModalComposition
      renderFooter={() => (
        <Button
          title="Back"
          onPress={() => handleGuideBack(-1)}
          variant="secondary"
        />
      )}
    >
      {Platform.OS === "android" ? <AndroidGuide /> : <IOSGuide />}
    </ModalComposition>
  );
};

const IOSGuide = () => {
  return (
    <Grid gap={8}>
      <Grid gap={8}>
        <Heading variant={5} weight="semiBold">
          How to Screen Record (Step-by-Step Guide)
        </Heading>

        <Text>
          Most modern iOS devices (iOS 11 and above) come with a built-in screen
          recording feature that allows you to capture your screen without
          installing any third-party apps.
        </Text>

        <Heading variant={5} weight="semiBold">
          Step 1: Enable Screen Recording
        </Heading>

        <Text>1. Open the "Settings" app on your iPhone or iPad.</Text>
        <Text>
          2. Navigate to "Control Center" and tap "Customize Controls."
        </Text>
        <Text>
          3. Scroll down and tap the "+" icon next to "Screen Recording" to add
          it to your Control Center.
        </Text>
      </Grid>
      <Grid gap={8}>
        <Heading variant={5} weight="semiBold">
          Step 2: Start the Screen Recording
        </Heading>

        <Text>
          1. Swipe down from the top-right corner of your screen to open the
          Control Center (or swipe up from the bottom on older devices).
        </Text>
        <Text>2. Tap the "Screen Recording" button (a circle icon).</Text>
        <Text>3. A 3-second countdown will begin before recording starts.</Text>
        <Text>
          4. Scroll through your results at a medium speed until you reach the
          end of your results.
        </Text>
        <Text>
          5. A red status bar or red recording icon will appear at the top of
          the screen, indicating that recording is in progress.
        </Text>
      </Grid>
      <Grid gap={8}>
        <Heading variant={5} weight="semiBold">
          Step 3: Stop and Upload the Recording
        </Heading>

        <Text>
          1. Tap the red status bar at the top and select "Stop" or return to
          the Control Center and tap the "Screen Recording" button again.
        </Text>
        <Text>2. The recording will be saved to the Photos app.</Text>
        <Text>3. Return to the App and upload the new recording.</Text>
      </Grid>
    </Grid>
  );
};

const AndroidGuide = () => {
  return (
    <Grid gap={8}>
      <Grid gap={8}>
        <Heading variant={5} weight="semiBold">
          How to Screen Record (Step-by-Step Guide)
        </Heading>

        <Text>
          Most modern Android devices (Android 10 and above) come with a
          built-in screen recording feature that allows you to capture your
          screen without installing any third-party apps.
        </Text>

        <Heading variant={5} weight="semiBold">
          Step 1: Access the Quick Settings Panel
        </Heading>

        <Text>
          1. Navigate to your ICP providers website and open your results.
        </Text>
        <Text>
          2. Swipe down from the top of your screen to open the Notification
          Shade.
        </Text>
        <Text>
          3. Swipe down again to fully expand the Quick Settings panel.
        </Text>
        <Text>
          4. Look for the "Screen Recorder" icon (it may appear as a camcorder
          or screen icon).
        </Text>
      </Grid>
      <Grid gap={8}>
        <Heading variant={5} weight="semiBold">
          Step 2: Start the Screen Recording
        </Heading>

        <Text>1. Tap the "Screen Record" icon</Text>
        <Text>
          2. A prompt will appear asking if you want to include audio or show
          touches on the screen. Select your preferred options.
        </Text>
        <Text>3. Tap "Start" to begin recording.</Text>
        <Text>
          4. Scroll through your results at a medium speed until you reach the
          end of your results.
        </Text>
        <Text>
          5. A menu should be present allowing you to stop the recording.
        </Text>
      </Grid>
      <Grid gap={8}>
        <Heading variant={5} weight="semiBold">
          Step 3: Upload the Recording
        </Heading>

        <Text>1. Return to the App</Text>
        <Text>2. Upload the new recording.</Text>
      </Grid>
    </Grid>
  );
};
