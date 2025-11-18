import React, { useState } from "react";

import { Button, ButtonProps, ButtonVariants } from "../Button/Button";

type ButtonWithConfirmationProps = ButtonProps & {
  confirmationTitle: string;
  confirmationVariant: ButtonVariants;
};

export const ButtonWithConfirmation: React.FC<ButtonWithConfirmationProps> = ({
  title,
  onPress,
  confirmationTitle,
  confirmationVariant,
  variant,
  ...rest
}) => {
  const [confirming, setConfirming] = useState(false);

  const handlepress = () => {
    if (!confirming) return setConfirming(true);

    onPress();
  };

  const buttonTitle = confirming ? confirmationTitle : title;

  const buttonVariant = confirming ? confirmationVariant : variant;

  return (
    <Button
      onPress={handlepress}
      title={buttonTitle}
      variant={buttonVariant}
      {...rest}
    />
  );
};
