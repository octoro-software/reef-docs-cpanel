import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput as RNTextInput,
  Keyboard,
} from "react-native";
import { Button, Grid, Heading, ScreenWrapper, Text } from "../../components";
import { useLocation, useNavigate } from "react-router-native";
import {
  FORGOT_PASSWORD_CHANGE_PATH,
  LOGIN_PATH,
  REEF_DOCS_BLUE,
} from "../../constants";
import {
  usePasswordReset,
  useVerifyPasswordResetToken,
} from "../../hooks/useAuth";

export const ConfirmPasswordResetTokenScreen: React.FC = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [focusIndex, setFocusIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [requestVerificationCodeLoading, setRequestVerificationCodeLoading] =
    useState(false);

  const hiddenInputRef = useRef(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [handlePasswordReset] = usePasswordReset();
  const [handleVerifyPasswordResetToken] = useVerifyPasswordResetToken();

  const handleCodeChange = (text) => {
    if (!text) return;
    const chars = text.split("");
    const newCode = [...code];

    for (let i = 0; i < chars.length && focusIndex + i < 6; i++) {
      newCode[focusIndex + i] = chars[i];
    }

    const nextIndex = Math.min(focusIndex + chars.length, 5);
    setCode(newCode);
    setFocusIndex(nextIndex);
  };

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Backspace") {
      const newCode = [...code];
      if (code[focusIndex]) {
        newCode[focusIndex] = "";
      } else if (focusIndex > 0) {
        newCode[focusIndex - 1] = "";
        setFocusIndex(focusIndex - 1);
      }
      setCode(newCode);
    }
  };

  const handleBoxPress = (index) => {
    setFocusIndex(index);
    requestAnimationFrame(() => hiddenInputRef.current?.focus());
  };

  const handleCodeConfirmation = async () => {
    const token = code.join("");
    if (token.length < 6) {
      setErrorMessage("Please complete all 6 digits.");
      return;
    }

    try {
      const response = await handleVerifyPasswordResetToken({ token });
      if (response?.status === 200) {
        navigate(FORGOT_PASSWORD_CHANGE_PATH, { state: { token } });
      } else {
        setErrorMessage("Invalid code supplied. Please try again.");
      }
    } catch {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleClearInputs = () => {
    setCode(["", "", "", "", "", ""]);
    setFocusIndex(0);
    hiddenInputRef.current?.focus();
  };

  const getVerificationCode = async () => {
    if (timer > 0) return;
    setRequestVerificationCodeLoading(true);
    await handlePasswordReset({ email: state.forEmail });
    setRequestVerificationCodeLoading(false);
    setTimer(60);
  };

  return (
    <ScreenWrapper style={{ backgroundColor: "#fff" }}>
      <Grid justifyContent="center" direction="column" gap={16}>
        <Heading variant={1} weight="semiBold">
          Confirm Password Reset
        </Heading>

        <Heading variant={6} weight="semiBold">
          Please enter the code sent to your email address, check your spam. If
          you did not receive a code, please click the button below to resend.
        </Heading>

        <Text weight="semiBold" style={{ fontSize: 12 }}>
          Please note: The code is valid for 15 minutes
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {code.map((char, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleBoxPress(index)}
              style={{
                width: 48,
                height: 60,
                borderWidth: 2,
                borderColor: focusIndex === index ? REEF_DOCS_BLUE : "#ccc",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 24 }}>{char}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {errorMessage && (
          <Heading variant={6} weight="regular" style={{ color: "red" }}>
            {errorMessage}
          </Heading>
        )}

        <Button
          variant="secondary"
          title="Confirm Code"
          onPress={handleCodeConfirmation}
        />

        <Button title="Clear Code" onPress={handleClearInputs} />

        <Button
          variant="primary"
          title={timer > 0 ? `Resend Code in ${timer}s` : "Resend Code"}
          onPress={getVerificationCode}
          isLoading={requestVerificationCodeLoading}
          disabled={timer > 0}
        />

        <RNTextInput
          ref={hiddenInputRef}
          value=""
          onChangeText={handleCodeChange}
          onKeyPress={handleKeyPress}
          autoFocus={false}
          autoCapitalize="characters"
          keyboardType="default"
          maxLength={6}
          style={{ position: "absolute", opacity: 0, height: 1, width: 1 }}
        />

        <TouchableOpacity onPress={() => navigate(LOGIN_PATH)}>
          <Heading
            variant={6}
            weight="regular"
            style={{
              color: REEF_DOCS_BLUE,
              textDecorationLine: "underline",
              textDecorationColor: REEF_DOCS_BLUE,
            }}
          >
            Already have an account? Login Here
          </Heading>
        </TouchableOpacity>
      </Grid>
    </ScreenWrapper>
  );
};
