import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Clipboard from "expo-clipboard";

import {
  useRequestEmailVerificationCode,
  useUser,
  useVerifyEmail,
} from "../../hooks/useAuth";

import {
  Button,
  Grid,
  Heading,
  TextInput,
  ProgressBar,
  Text,
} from "../../components";

import { PROFILE_PATH } from "../../constants";

import { GuestScreenWrapper } from "../../components/GuestScreenWrapper/GuestScreenWrapper";

export const ConfirmEmailScreen: React.FC = () => {
  const user = useUser();

  const [cooldown, setCooldown] = React.useState(0); // 60 second cooldown

  const [handleVerifyEmail, verifyEmailLoading, verifyEmailError] =
    useVerifyEmail();

  const [
    handleRequestVerificationCode,
    requestVerificationCodeLoading,
    requestVerificationCodeError,
  ] = useRequestEmailVerificationCode();

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        code1: yup.string().max(1).required(""),
        code2: yup.string().max(1).required(""),
        code3: yup.string().max(1).required(""),
        code4: yup.string().max(1).required(""),
      })
    ),
  });

  // Refs for text inputs
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleEmailConfirmation = async (data) => {
    setErrorMessage(null);

    const payload = {
      token: `${data.code1}${data.code2}${data.code3}${data.code4}`,
    };

    const verifyEmail = await handleVerifyEmail(payload);

    if (verifyEmail?.status === 200) {
      await navigate(PROFILE_PATH);
    } else {
      setErrorMessage("Invalid code supplied. Please try again.");
    }
  };

  const handleSkipForNow = async () => {
    await navigate(PROFILE_PATH);
  };

  const getVerificationCode = async () => {
    await handleRequestVerificationCode();

    // Start 60-second cooldown
    setCooldown(60);
  };

  const [code1, code2, code3, code4] = watch([
    "code1",
    "code2",
    "code3",
    "code4",
  ]);

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(null);
    }

    if (code1 && !code2 && !code3) {
      inputRefs[1]?.current?.focus();
    } else if (code2 && !code3) {
      inputRefs[2]?.current?.focus();
    } else if (code3 && !code4) {
      inputRefs[3]?.current?.focus();
    }
  }, [code1, code2, code3, code4]);

  const handlePasteCode = async () => {
    const clipboardContent = await Clipboard.getStringAsync();

    const code = clipboardContent.replace(/\s/g, "").slice(0, 4); // clean and trim to 4 digits

    if (code.length === 4) {
      code.split("").forEach((char, index) => {
        const fieldName = `code${index + 1}`;
        // @ts-ignore
        setValue(fieldName, char);
      });

      inputRefs[3]?.current?.focus(); // focus last input
    } else {
      setErrorMessage("Clipboard must contain a valid 4-digit code.");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [cooldown]);

  const hasErrorMessage = errorMessage;

  return (
    <GuestScreenWrapper style={{ backgroundColor: "#fff" }}>
      <Grid justifyContent="center" direction="column" gap={16}>
        <ProgressBar percentage={20} height={5} />

        <Heading variant={1} weight="semiBold">
          Confirm Email
        </Heading>

        {user?.email && (
          <Heading variant={5} weight="bold">
            {user.email}
          </Heading>
        )}
        <Heading variant={6} weight="regular">
          Please enter the code sent to your email address, check your{" "}
          <Heading variant={6} weight="bold">
            spam / junk
          </Heading>
          . If you did not receive a code, please click the button below to
          resend.
        </Heading>

        <View style={{ flex: 1, flexDirection: "row", gap: 16 }}>
          {["code1", "code2", "code3", "code4"].map((name, index) => (
            <View style={{ flex: 1 }} key={name}>
              <TextInput
                ref={inputRefs[index]}
                control={control}
                keyboardType="numeric"
                name={name}
                maxLength={1}
                center
                noErrorMessage
                onChangeText={(text) => {
                  if (text.length > 1) {
                    // User pasted the whole code
                    const chars = text.split("").slice(0, 4); // Only take 4 characters
                    chars.forEach((char, idx) => {
                      const fieldName = `code${idx + 1}`;
                      // @ts-ignore
                      control.setValue(fieldName, char);
                    });
                    inputRefs[3]?.current?.focus(); // Focus last input
                  } else {
                    // Normal typing
                    // @ts-ignore
                    control.setValue(name, text);
                    if (text && index < inputRefs.length - 1) {
                      inputRefs[index + 1]?.current?.focus();
                    }
                  }
                }}
              />
            </View>
          ))}
        </View>

        {hasErrorMessage && (
          <Heading variant={6} weight="regular" style={{ color: "red" }}>
            {hasErrorMessage}
          </Heading>
        )}

        <Button
          variant="secondary"
          title="Confirm Email"
          onPress={handleSubmit(handleEmailConfirmation)}
          isLoading={verifyEmailLoading}
          error={verifyEmailError}
        />
        <Button
          variant="secondary"
          title="Paste Code"
          onPress={handlePasteCode}
        />
        <Button
          variant="primary"
          title={cooldown > 0 ? `Resend Code (${cooldown})` : "Resend Code"}
          onPress={getVerificationCode}
          isLoading={requestVerificationCodeLoading}
          error={requestVerificationCodeError}
          disabled={cooldown > 0}
        />

        <Button
          variant="secondary"
          title="Skip for now"
          onPress={handleSkipForNow}
        />
      </Grid>
    </GuestScreenWrapper>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: "center",
  },
  loginButtonLower: {},
});
