import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ModalFixedFooterWrapper } from "./components/ModalFixedFooterWrapper";
import { FixedFooter } from "./components/FixedFooter";
import { Keyboard, KeyboardEvent } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export const ModalComposition = ({
  renderFooter = false,
  children = null,
  footerFix = false,
  padding = false,
  footerStyle = {},
  footerWrapperStyle = {},
  disableScroll,
  stickyFooter = false,
  keyboardShouldPersistTaps = "handled",
}) => {
  const [footerHeight, setFooterHeight] = useState(0);

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setFooterHeight(height - 40);
  };

  const keyboardHeight = useKeyboardHeight();

  const safeKeyboardHeight =
    typeof keyboardHeight === "number"
      ? Math.max(0, Math.abs(keyboardHeight))
      : 0;

  return (
    <ModalFixedFooterWrapper style={[{ flex: 1 }, footerWrapperStyle]}>
      <View style={{ flex: 1 }}>
        {disableScroll ? (
          children
        ) : (
          <KeyboardAwareScrollView
            bottomOffset={footerHeight + 16}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: padding ? 16 : 0,
              paddingBottom: footerHeight + 64,
            }}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          >
            {children}
          </KeyboardAwareScrollView>
        )}

        {/* FIXED FOOTER OUTSIDE THE SCROLLVIEW */}
        {renderFooter && renderFooter() && (
          <FixedFooter
            style={[
              footerStyle,
              stickyFooter ? { marginBottom: safeKeyboardHeight } : {},
            ]}
            fix={footerFix}
            handleLayout={handleLayout}
          >
            {renderFooter()}
          </FixedFooter>
        )}
      </View>
    </ModalFixedFooterWrapper>
  );
};

/**
 * Shows height of keyboard when shown
 */
function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function onKeyboardShow(event: KeyboardEvent) {
    setKeyboardHeight(event.endCoordinates.height);
  }

  function onKeyboardHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const onShow = Keyboard.addListener("keyboardDidShow", onKeyboardShow);
    const onHide = Keyboard.addListener("keyboardDidHide", onKeyboardHide);

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  return keyboardHeight;
}
