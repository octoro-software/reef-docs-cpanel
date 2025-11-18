import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  Text,
  TextInput,
} from "../../components";
import {
  useConfirmVerificationCode,
  useRequestVerificationCode,
  useUser,
} from "../../hooks/useAuth";
import { ErrorText } from "../../components/Form/ErrorText/ErrorText";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { getAppDimensions } from "../../utility/dimensions";

export const PhoneVerificationConfirmationForm = ({ handleNextStep }) => {
  const [canRequestNewCode, setCanRequestNewCode] = React.useState(false);
  const [countdown, setCountdown] = React.useState(60);

  const [requestVerificationCode, requestCodeLoading, requestCodeError] =
    useRequestVerificationCode();

  const [confirmVerificationCode, loading, confirmError, success] =
    useConfirmVerificationCode();

  const user = useUser();

  const handleClearInputs = () => {
    inputRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.clear();
      }
    });

    inputRefs[0].current.focus();

    reset();
  };

  const handleNewCodeRequest = async () => {
    if (!canRequestNewCode) return;

    // You can call the API to request a new code here
    // For now we reuse handleCodeConfirmation as placeholder
    await requestVerificationCode(user?.phone);

    // Restart the timer
    setCanRequestNewCode(false);
    setCountdown(60);
  };

  const handleCodeConfirmation = async () => {
    const validated = await trigger();

    if (validated) {
      const data = getValues();
      const payload = {
        phone: user?.phone,
        code: `${data.code1}${data.code2}${data.code3}${data.code4}`,
      };
      const response = await confirmVerificationCode(
        payload.phone,
        payload.code
      );

      if (response?.status === 200) {
        handleNextStep(1);
      }
    }
  };

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(
      yup.object().shape({
        code1: yup.string().max(1).required(""),
        code2: yup.string().max(1).required(""),
        code3: yup.string().max(1).required(""),
        code4: yup.string().max(1).required(""),
      })
    ),
  });
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

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

    if (code1 && !code2) {
      inputRefs[1]?.current?.focus();
    } else if (code2 && !code3) {
      inputRefs[2]?.current?.focus();
    } else if (code3 && !code4) {
      inputRefs[3]?.current?.focus();
    }
  }, [code1, code2, code3, code4]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!canRequestNewCode) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanRequestNewCode(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, []);

  const hasCodeError =
    errors?.code1 || errors?.code2 || errors?.code3 || errors?.code4;

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={8}>
            <Button
              title="Verify"
              success={success}
              successMessage="Phone number verified successfully"
              isLoading={loading}
              error={confirmError}
              errorMessage="Code was invalid, please try again"
              onPress={handleCodeConfirmation}
            />
            <Button
              title={
                canRequestNewCode
                  ? "Request New Code"
                  : `New Code in (${countdown}s)`
              }
              disabled={!canRequestNewCode}
              variant="secondary"
              onPress={handleNewCodeRequest}
              isLoading={requestCodeLoading}
              error={requestCodeError}
              errorMessage="Error requesting new code, please try again"
            />
            <Button title={"Clear Code"} onPress={handleClearInputs} />
          </Grid>
        );
      }}
    >
      <ModalHeader
        icon="smartPhone"
        title="Phone Verification Confirmation"
        content="To prevent spam and to protect manipulation, before you contribute you must verify your mobile phone number. It will be used for the purpose of verification only and is only required once."
      />

      <Text style={styles.phoneNumberText} weight="bold">
        {user?.phone}
      </Text>

      <Grid direction="row" gap={8}>
        {["code1", "code2", "code3", "code4"].map((name, index) => (
          <GridItem flex={1} key={name}>
            <TextInput
              ref={inputRefs[index]}
              control={control}
              keyboardType="numeric"
              name={name}
              maxLength={1}
              center
            />
          </GridItem>
        ))}
      </Grid>

      <Grid gap={8}>
        {hasCodeError && (
          <ErrorText
            text={
              "Please enter a valid code. The code is 6 digits long and must be entered in the correct order."
            }
          />
        )}
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start", // or "space-between" if you want spacing between blocks
  },
  phoneNumberText: {
    textAlign: "center",
    marginVertical: 8,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  codeBox: {},
});
