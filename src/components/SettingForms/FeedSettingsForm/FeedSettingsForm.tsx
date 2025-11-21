import React from "react";
import { TouchableOpacity } from "react-native";

import { Grid } from "../../Grid/Grid";
import { Heading } from "../../Heading/Heading";
import { Text } from "../../Text/Text";
import { Select } from "../../Form/Select/Select";
import { RawTextInput } from "../../Form/RawTextInput/RawTextInput";

import { WHITE } from "../../../constants";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import {
  selectApexFeed,
  selectAquaDocsFeed,
  selectRedSeaFeed,
  setApexFeed,
  setAquaDocsFeed,
  setRedseaFeed,
} from "../../../store/slices/userConfigSlice";
import { useDeviceDiscovery } from "../../../hooks/useDeviceDiscovery";

export const FeedSettingsForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const redSeaFeed = useAppSelector(selectRedSeaFeed);

  const apexFeed = useAppSelector(selectApexFeed);

  const aquaDocsFeed = useAppSelector(selectAquaDocsFeed);

  const handleRedSeaIpChange = (value: string) => {
    dispatch(setRedseaFeed({ ipAddress: value }));
  };
  const handleRedSeaRefreshTimeChange = (value: string) => {
    dispatch(setRedseaFeed({ refreshTime: value }));
  };
  const handleApexIpChange = (value: string) => {
    dispatch(setApexFeed({ ipAddress: value }));
  };
  const handleApexRefreshTimeChange = (value: string) => {
    dispatch(setApexFeed({ refreshTime: value }));
  };

  const handleAquaDocsRefreshTimeChange = (value: string) => {
    dispatch(setAquaDocsFeed({ refreshTime: value }));
  };

  const {
    devices: devices,
    loading: deviceScanning,
    scan: scanDevices,
  } = useDeviceDiscovery();

  const handleSelectApexDevice = (host: string, port?: number) => {
    // store host (and port if needed) instead of raw IP
    dispatch(setApexFeed({ ipAddress: host })); // maybe rename this to baseUrl later
  };

  const handleSelectReefMatDevice = (host: string, port?: number) => {
    // store host (and port if needed) instead of raw IP

    const chosenDevice = devices.find((d) => d.host === host);

    dispatch(
      setRedseaFeed({ ipAddress: host, deviceName: chosenDevice?.name })
    ); // maybe rename this to baseUrl later
  };

  return (
    <Grid direction="column" gap={16}>
      <Text style={{ color: WHITE }}>
        Setup your data feeds here. Minimum refresh time of 5 minutes.
      </Text>

      <Heading variant={5} weight="semiBold" style={{ color: WHITE }}>
        Aqua Docs
      </Heading>

      <RawTextInput
        label="Refresh Time ( Minutes )"
        onChange={(v) => handleAquaDocsRefreshTimeChange(v)}
        value={aquaDocsFeed?.refreshTime}
        style={{ color: WHITE }}
      />

      <Heading variant={5} weight="semiBold" style={{ color: WHITE }}>
        Red Sea
      </Heading>

      <TouchableOpacity
        onPress={scanDevices}
        style={{
          padding: 12,
          backgroundColor: "#28304a",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: WHITE }}>
          {deviceScanning ? "Scanning..." : "Scan Network for Reef Mat"}
        </Text>
      </TouchableOpacity>

      {devices?.length > 0 && (
        <Select
          options={devices}
          labelKey="name"
          valueKey="host"
          label="Detected Reef Mat Devices"
          onConfirm={(host) => handleSelectReefMatDevice(host)}
          title="Select Reef Mat"
          value={redSeaFeed?.ipAddress}
        />
      )}

      <RawTextInput
        label="Reef Mat Host / IP (Manual Override)"
        onChange={(v) => handleRedSeaIpChange(v)}
        value={redSeaFeed?.ipAddress}
        style={{ color: WHITE }}
      />
      <RawTextInput
        label="Refresh Time ( Minutes )"
        onChange={(v) => handleRedSeaRefreshTimeChange(v)}
        value={redSeaFeed?.refreshTime}
        style={{ color: WHITE }}
      />

      <Heading variant={5} weight="semiBold" style={{ color: WHITE }}>
        Apex
      </Heading>

      <TouchableOpacity
        onPress={scanDevices}
        style={{
          padding: 12,
          backgroundColor: "#28304a",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: WHITE }}>
          {deviceScanning ? "Scanning..." : "Scan Network for Apex"}
        </Text>
      </TouchableOpacity>

      {devices?.length > 0 && (
        <Select
          options={devices}
          labelKey="name"
          valueKey="host"
          label="Detected Apex Devices"
          onConfirm={(host) => handleSelectApexDevice(host)}
          title="Select Apex"
          value={apexFeed?.ipAddress}
        />
      )}

      <RawTextInput
        label="Apex Host / IP (Manual Override)"
        onChange={(v) => handleApexIpChange(v)}
        value={apexFeed?.ipAddress}
        style={{ color: WHITE }}
      />

      <RawTextInput
        label="Refresh Time ( Minutes )"
        onChange={(v) => handleApexRefreshTimeChange(v)}
        value={apexFeed?.refreshTime}
        style={{ color: WHITE }}
      />
    </Grid>
  );
};
