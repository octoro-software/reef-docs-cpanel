import React from "react";
import { TouchableOpacity, View } from "react-native";

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
import { Button } from "../../Button/Button";
import {
  useApexInitialSyncComplete,
  useGetApexDataLog,
} from "../../../hooks/useApex";
import { useUser } from "../../../hooks/useAuth";

export const FeedSettingsForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [backdatePending, setBackdatePending] = React.useState(false);

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

  const user = useUser();

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

  const [getApexDataLog] = useGetApexDataLog();

  const [apexSyncComplete] = useApexInitialSyncComplete();

  const handleBackdateApex = async () => {
    setBackdatePending(true);
    // generate a collection of dates for the past year, one per month including the current month
    const now = new Date();
    const months: { date: string; days: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      // Get number of days in the month
      const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      // Format date as yymmdd
      const year = String(d.getFullYear()).slice(2, 4);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const yymmdd = `${year}${month}${day}`;
      months.push({ date: yymmdd, days });
    }

    const promises = months.map(({ date, days }) => getApexDataLog(date, days));

    await Promise.all(promises).catch((error) => {
      console.log("Error backdating Apex data:", error);
    });

    await apexSyncComplete();

    setBackdatePending(false);
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

      {!user?.apexInitialSyncComplete ? (
        <View>
          <Text style={{ color: WHITE }}>
            Pressing the button below will collect upto 1 years worth of test
            data from the Apex device and send it to Aqua Docs. This will then
            be processed on our servers. You will be emailed when each month has
            finished processing. Your dashboard will gradually update and the
            reports will become much more enriched. Once the data is processed
            the app will continue to sync moving forward based on your set
            interval above.
          </Text>

          <Button
            title={
              backdatePending ? "Please Wait..." : "Sync Historic Apex Data"
            }
            style={{ backgroundColor: "orange" }}
            onPress={handleBackdateApex}
            disabled={backdatePending}
          />
        </View>
      ) : (
        <View>
          <Button
            title={"Transfer Complete"}
            style={{ backgroundColor: "green" }}
            disabled={backdatePending}
          />
        </View>
      )}
    </Grid>
  );
};
