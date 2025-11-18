import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-native";

import { useLogin } from "../../hooks/useAuth";

import { Button, Grid, Heading, Text, TextInput } from "../../components";
import { GuestScreenWrapper } from "../../components/GuestScreenWrapper/GuestScreenWrapper";

import { Logo } from "../../components/Logo/Logo";

import {
  FORGOT_PASSWORD_PATH,
  REEF_DOCS_BLUE,
  REGISTER_PATH,
} from "../../constants";

import BootSplash from "react-native-bootsplash";

export const LoginScreen: React.FC = () => {
  const { state } = useLocation();

  const [handleLogin] = useLogin();

  const navigate = useNavigate();

  const handleForgotPassword = () => navigate(FORGOT_PASSWORD_PATH);
  BootSplash.hide();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isLoading },
    setError,
    clearErrors,
    trigger,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Please enter a valid email")
          .required("This field is required"),
        password: yup.string().required("This field is required"),
        server: yup.string().required("This field is required"),
      })
    ),
    defaultValues: {
      server: "uk",
    },
  });

  const handleLoginAttempt = async (data) => {
    const valid = await trigger(["server"]);

    if (!valid) return;

    try {
      const response = await handleLogin(data);

      if (response?.status === 400) {
        // Specific check if the backend returned 400
        setError("email", {
          type: "manual",
          message: "Invalid email or password",
        });
        setError("password", {
          type: "manual",
          message: "Invalid email or password",
        });

        setTimeout(() => {
          clearErrors();
        }, 5000);
      }
    } catch (error) {
      // If any error happened during login
      setError("email", {
        type: "manual",
        message: "Invalid email or password",
      });
      setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });

      setTimeout(() => {
        clearErrors();
      }, 5000);
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
        Login
      </Heading>

      {state?.message && (
        <View
          style={{
            padding: 8,
            backgroundColor: "#3d9f3d",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 13 }}>
            Your password has been updated successfully. You can now login with
            your new password!
          </Text>
        </View>
      )}

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
        />

        <TextInput
          control={control}
          secureTextEntry
          keyboardType="default"
          autoCapitalize="none"
          autoComplete="password"
          label="Password"
          name="password"
          placeholder="Please enter your password"
        />

        <Button
          variant="secondary"
          title="Login"
          onPress={handleSubmit(handleLoginAttempt)}
          isLoading={isSubmitting || isLoading}
        />

        <Button
          variant="primary"
          title="Forgot Password?"
          onPress={handleForgotPassword}
        />

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
