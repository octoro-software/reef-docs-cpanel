import React from "react";

import {
  Button,
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  RichText,
} from "../../../components";
import { useModal } from "../../../hooks/useModal";
import { Image } from "react-native";
0;
export const WhatsNewModal = ({}) => {
  const { closeModal } = useModal();

  const updateInformation = [
    {
      title: "Calculators - Fresh Water Calculator",
      description: `<p>Auto Dose Calculator based on tank size.</p>
        `,
    },
    {
      title: "Improvements - Social Media Sensoring",
      description: `<p>Moderators can now sensor videos that may be offensive. You can choose to see these videos or just scroll past them.</p>
        `,
    },
    {
      title: "Improvements - Notifications",
      description: `<p>Direct comments via targeting a user @username will now have a low priority notification sent to the device. You can opt out by turning off the post scope for notifications.</p>
        `,
    },
    {
      title: "Improvements - Freshwater Testing",
      description: `<p>Calcium, Magnesium, Potassium, Silicate, Oxygen and Co2 Tracking has been added to Freshwater Testing.</p>
        `,
    },
    {
      title: "Performance - Tank Inhabitants Improved",
      description: `<p>The performance of tank fish, coral / plants and inverts has been improved.</p>
        `,
    },
  ];
  const nextUpdateInformation = [
    {
      title: "Live Stock Selling - Pre Registration",
      description: `<p>The next phase of Aqua Docs, a safe and intuative place to sell live stock</p>`,
    },
  ];

  return (
    <ModalComposition
      footerFix
      renderFooter={() => (
        <Button variant="primary" onPress={closeModal} title="Got It!" />
      )}
    >
      <Grid direction="column" gap={8} style={{ padding: 16 }}>
        <GridItem flex={1} justifyContent="center" alignItems="center">
          <Image
            source={require("../../../logo.png")}
            height={100}
            width={100}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 2,
            }}
          />
        </GridItem>

        <Heading variant={4} weight="semiBold" style={{ textAlign: "center" }}>
          Update Information
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
        <Heading variant={4} weight="semiBold" style={{ textAlign: "center" }}>
          Next Update
        </Heading>

        <Grid direction="column" gap={8}>
          {nextUpdateInformation.map((item, index) => (
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
