import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-native";

import { useUpdatePassword } from "../../hooks/useAuth";

import {
  Button,
  Grid,
  Heading,
  Icon,
  ScreenWrapper,
  TextInput,
} from "../../components";

import { LOGIN_PATH } from "../../constants";
import { Logo } from "../../components/Logo/Logo";

export const PasswordResetScreen: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [handleUpdatePassword] = useUpdatePassword();

  const navigate = useNavigate();

  const { state } = useLocation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        password: yup.string().min(8).required("A Password is required"),
      })
    ),
  });

  const handlePasswordResetSubmit = async (data) => {
    const payload = {
      token: state?.token,
      password: data.password,
    };

    const response = await handleUpdatePassword(payload);

    if (response.status === 200) {
      navigate(LOGIN_PATH, {
        state: {
          message: "Password has been reset successfully",
          type: "success",
        },
      });
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: "#fff" }} persistTaps>
      <Grid alignItems="center" justifyContent="center" gap={16}>
        <Logo />
      </Grid>

      <Heading
        style={{ textAlign: "center", paddingBottom: 60 }}
        variant={1}
        weight="semiBold"
      >
        Set new Password
      </Heading>

      <View style={{ gap: 16 }}>
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

        <Button
          variant="secondary"
          title="Change Password"
          onPress={handleSubmit(handlePasswordResetSubmit)}
          isLoading={isSubmitting || isLoading}
        />

        <Button
          variant="primary"
          title="Home"
          onPress={() => navigate(LOGIN_PATH)}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: "center",
  },
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
});
