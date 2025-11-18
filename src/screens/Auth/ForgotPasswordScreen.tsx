import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-native";

import { usePasswordReset } from "../../hooks/useAuth";

import { Button, Grid, Heading, TextInput } from "../../components";

import {
  FORGOT_PASSWORD_CONFIRM_PATH,
  REEF_DOCS_BLUE,
  REGISTER_PATH,
} from "../../constants";
import { GuestScreenWrapper } from "../../components/GuestScreenWrapper/GuestScreenWrapper";
import { Logo } from "../../components/Logo/Logo";

export const ForgotPasswordScreen: React.FC = () => {
  const [handlePasswordReset, passwordResetLoading, passwordResetError] =
    usePasswordReset();

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Please enter a valid email")
          .required("This field is required"),
      })
    ),
  });

  const handlePasswordResetSubmit = async (data) => {
    const response = await handlePasswordReset(data);

    if (response.status === 200) {
      navigate(FORGOT_PASSWORD_CONFIRM_PATH, {
        state: {
          forEmail: data?.email,
        },
      });
    }
  };

  return (
    <GuestScreenWrapper style={{ backgroundColor: "#fff" }}>
      <Grid alignItems="center" justifyContent="center" gap={16}>
        <Logo />
      </Grid>

      <Heading
        style={{ textAlign: "center", paddingBottom: 20 }}
        variant={1}
        weight="semiBold"
      >
        Reset Password
      </Heading>

      <View style={{ gap: 16 }}>
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

        <Button
          variant="secondary"
          title="Send Reset Link"
          onPress={handleSubmit(handlePasswordResetSubmit)}
          isLoading={passwordResetLoading}
          error={passwordResetError}
        />

        <Button variant="primary" title="Back" onPress={() => navigate(-1)} />

        <TouchableOpacity onPress={() => navigate(REGISTER_PATH)}>
          <Heading
            variant={6}
            weight="regular"
            style={{
              color: REEF_DOCS_BLUE,
              textDecorationLine: "underline",
              textDecorationColor: REEF_DOCS_BLUE,
            }}
          >
            Need an Account ? Register Here
          </Heading>
        </TouchableOpacity>
      </View>
    </GuestScreenWrapper>
  );
};
