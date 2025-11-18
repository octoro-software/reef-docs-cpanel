import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Grid, ModalHeader } from "../../components";
import PhoneInput from "react-native-phone-number-input";
import { WHITE } from "../../constants";
import { useRequestVerificationCode } from "../../hooks/useAuth";
import { ErrorText } from "../../components/Form/ErrorText/ErrorText";

export const PhoneVerificationForm = ({ handleNextStep }) => {
  const phoneInput = useRef<PhoneInput>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [validationError, setValidationError] = useState(false);

  const [requestVerificationCode, loading, error] =
    useRequestVerificationCode();

  const handleRequestVerification = async () => {
    const isValid = phoneInput?.current?.isValidNumber(phoneNumber);

    if (!isValid) {
      return setValidationError(true);
    } else {
      setValidationError(false);
    }

    const response = await requestVerificationCode(formattedValue);
    if (response?.status === 200) {
      handleNextStep(1);
    }
  };

  return (
    <View>
      <ModalHeader
        icon="smartPhone"
        title="Phone Verification"
        content="To prevent spam and to keep rewards fair, before you contribute you must verify your mobile phone number. It will be used for the purpose of verification only."
      />

      <Grid gap={16} style={styles.container}>
        <PhoneInput
          ref={phoneInput}
          defaultValue={phoneNumber}
          defaultCode="GB"
          layout="first"
          onChangeText={(text) => setPhoneNumber(text)}
          onChangeFormattedText={(text) => setFormattedValue(text)}
          withDarkTheme={false}
          withShadow
          autoFocus
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textInput}
        />

        {validationError && (
          <ErrorText text="Please enter a valid phone number" />
        )}

        <Button
          title="Verify"
          isLoading={loading}
          onPress={handleRequestVerification}
        />
      </Grid>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  phoneContainer: {
    width: "100%",
    height: 60,
    borderRadius: 8,
    backgroundColor: WHITE,
  },
  textInput: {
    paddingVertical: 0,
    backgroundColor: WHITE,
  },
});
