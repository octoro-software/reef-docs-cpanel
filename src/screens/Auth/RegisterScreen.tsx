import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAppEnv } from "../../utility/environment";

import { useGetTimeZones, useRegisterUser } from "../../hooks/useAuth";

import {
  Button,
  Grid,
  Heading,
  TextInput,
  ProgressBar,
  CheckboxField,
  Icon,
  RichText,
  SlideInModal,
  Select,
  Text,
} from "../../components";
import { heightValues } from "../../providers/ModalProvider";

import { GuestScreenWrapper } from "../../components/GuestScreenWrapper/GuestScreenWrapper";

import {
  CONFIRM_EMAIL_PATH,
  LOGIN_PATH,
  PROFILE_PATH,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
} from "../../constants";
import { MARKETING_OPTIONS } from "../../constants/global";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import WebView from "react-native-webview";

export const RegisterScreen: React.FC = () => {
  const [handleRegister, registerLoading, registerError] = useRegisterUser();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    url: string;
  } | null>(null);

  const [getTimeZones] = useGetTimeZones();

  const [timezones, setTimezones] = useState([]);

  const handleGetTimeZones = async () => {
    const result = await getTimeZones();

    setTimezones(result?.data);
  };

  useEffect(() => {
    handleGetTimeZones();
  }, []);

  const navigate = useNavigate();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .test(
            "no-spaces",
            "Email cannot contain spaces",
            (value) => value === undefined || !/\s/.test(value)
          )
          .email("Please enter a valid email address")
          .required("An Email Address is required"),
        password: yup.string().min(8).required("A Password is required"),
        server: yup.string().required("A Server is required"),
        acceptedTerms: yup
          .boolean()
          .isTrue("You must accept the Terms and Conditions")
          .required("You must accept the Terms and Conditions"),
        timezone: yup.string().required("A Timezone is required"),
        whereDidYouHearAboutUs: yup.string(),
        referralCode: yup.string().nullable(),
      })
    ),
  });

  const handleAccountRegistration = async (data) => {
    const campaign = await AsyncStorage.getItem("campaign");

    if (campaign) {
      const { campaignId, channel } = JSON.parse(campaign);
      data.campaignId = campaignId;
      data.channel = channel;
    }

    const registerUser = await handleRegister(data);

    if (registerUser?.status === 201) {
      await AsyncStorage.removeItem("campaign");

      await navigate(PROFILE_PATH);
    }

    const errors = registerUser?.response?.data?.errors;

    if (errors?.email) {
      setError("email", {
        type: "manual",
        message:
          "This email is in use, please login to your account or use another email",
      });
    }
  };

  const setLocalStorageUS = async (result) => {
    await AsyncStorage.setItem("usServer", result?.toString() || "false");
  };

  const handleGetCountry = async () => {
    const locale = Localization.locale;

    if (getAppEnv() !== "production") {
      await setLocalStorageUS(false);
      return setValue("server", "uk");
    }

    if (locale === "en-GB") {
      setValue("server", "uk");
      await setLocalStorageUS(false);
    } else {
      setValue("server", "us");
      await setLocalStorageUS(true);
    }
  };

  const handleSetServer = async () => {
    setValue("server", "uk");
    await setLocalStorageUS(false);
  };

  useEffect(() => {
    handleGetCountry();
    handleSetServer();
  }, []);

  useEffect(() => {
    if (timezones?.length > 0) {
      // Flatten all timezone names from children arrays
      let found = null;
      for (const group of timezones) {
        if (Array.isArray(group.children)) {
          for (const tz of group.children) {
            if (tz.value === userTimeZone || tz.name === userTimeZone) {
              found = tz.value || tz.name;
              break;
            }
          }
        }
        if (found) break;
      }

      setValue("timezone", found || "UTC");
    }
  }, [userTimeZone, timezones]);

  const [acceptedTerms, whereDidYouHearAboutUs, timezone] = watch([
    "acceptedTerms",
    "whereDidYouHearAboutUs",
    "timezone",
  ]);

  const openLocalModal = (title: string, url: string) => {
    setModalContent({ title, url });
    setModalVisible(true);
  };

  return (
    <GuestScreenWrapper style={{ backgroundColor: "#fff" }} persistTaps>
      <KeyboardAvoidingView
        bottomOffset={20}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Grid justifyContent="center" direction="column" gap={16}>
          <ProgressBar percentage={5} height={5} />

          <Heading variant={1} weight="semiBold">
            Register
          </Heading>

          <TextInput
            control={control}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            label="Email"
            name="email"
            placeholder="Please enter your email address"
            hasError={errors?.email?.message}
          />
          <View>
            <TouchableOpacity
              style={styles.visibilityButton}
              onPress={() => setPasswordVisible((prev) => !prev)}
            >
              <Icon
                width={24}
                height={24}
                name={!passwordVisible ? "visibility" : "visibilityOff"}
              />
            </TouchableOpacity>
            <TextInput
              control={control}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              autoComplete="password"
              label="Password"
              name="password"
              placeholder="Please enter your password"
              hasError={errors?.password?.message}
            />
          </View>

          <Select
            label="Timezone"
            title="Timezone"
            grouped
            options={timezones}
            labelKey="name"
            valueKey="name"
            onConfirm={(value) => setValue("timezone", value)}
            value={timezone}
          />

          <View>
            <Select
              label="Where did you hear about us?"
              valueKey="value"
              labelKey="label"
              title="Where did you hear about us?"
              value={whereDidYouHearAboutUs}
              onConfirm={(value) => setValue("whereDidYouHearAboutUs", value)}
              options={MARKETING_OPTIONS}
            />
          </View>

          <TextInput
            control={control}
            autoCapitalize="none"
            label="Referral Code (Optional)"
            name="referralCode"
          />

          <Grid
            direction="row"
            gap={8}
            alignItems="center"
            style={{ flexWrap: "wrap" }}
          >
            <View>
              <CheckboxField
                checked={acceptedTerms}
                onChange={(e) => setValue("acceptedTerms", e.target.value)}
                hasError={errors?.acceptedTerms?.message}
              />
            </View>
            <View style={{ flex: 1 }}>
              <RichText
                styles={{
                  p: { margin: 0 },
                  a: { color: REEF_DOCS_BLUE },
                }}
                html={`<p>By registering I accept the <a href="terms">Terms and Conditions</a> and have read the <a href="privacy">Privacy Policy</a>.</p>`}
                renderersProps={{
                  a: {
                    onPress: (_, href) => {
                      if (href === "about:///terms") {
                        openLocalModal(
                          "Terms and Conditions",
                          "https://app.termly.io/policy-viewer/policy.html?policyUUID=c33f8ec3-7493-4192-8c1d-201867aa7bcb"
                        );
                      } else if (href === "about:///privacy") {
                        openLocalModal(
                          "Privacy Policy",
                          "https://app.termly.io/policy-viewer/policy.html?policyUUID=d96fd513-10ab-4d65-94ec-5d151f6eb522"
                        );
                      }
                    },
                  },
                }}
              />
            </View>
          </Grid>

          <Button
            variant="secondary"
            title="Register"
            onPress={handleSubmit(handleAccountRegistration)}
            isLoading={registerLoading}
            error={registerError}
          />

          <TouchableOpacity
            style={styles.loginButtonLower}
            onPress={() => navigate(LOGIN_PATH)}
          >
            <Heading
              variant={6}
              weight="regular"
              style={{
                color: REEF_DOCS_BLUE,
                textDecorationLine: "underline",
                textDecorationColor: REEF_DOCS_BLUE,
              }}
            >
              Already have an account ? Login Here
            </Heading>
          </TouchableOpacity>
        </Grid>

        <SlideInModal
          visible={modalVisible}
          height={heightValues.large}
          onClose={() => setModalVisible(false)}
          title={modalContent?.title}
        >
          <WebView source={{ uri: modalContent?.url }} />
        </SlideInModal>
      </KeyboardAvoidingView>
    </GuestScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loginButtonLower: {},
  visibilityButton: {
    position: "absolute",
    right: 2,
    top: 20,
    height: 55,
    width: 55,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  serverText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
});
