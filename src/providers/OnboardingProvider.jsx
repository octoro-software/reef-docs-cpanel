import React, { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-native";
import { useSelector } from "react-redux";
import { EXPLORE_PATH } from "../constants";
import { selectUser } from "../store/slices/globalSlice";
import { OnBoardingStack } from "../navigation/OnBoardingStack";

export const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [isOnBoarding, setIsOnBoarding] = useState(null);
  const [onBoardingComplete, setOnBoardingComplete] = useState(false);
  const navigate = useNavigate();

  const profile = useSelector(selectUser);

  // Set onboarding stage
  useEffect(() => {
    if (profile) {
      if (!profile.onBoarding?.profile) {
        setIsOnBoarding("profile");
      } else {
        setIsOnBoarding(false);
      }
    }
  }, [profile]);

  // Navigate once onboarding is complete
  useEffect(() => {
    if (isOnBoarding === false && profile) {
      navigate(EXPLORE_PATH, { replace: true });
    }
  }, [isOnBoarding, profile]);

  // Navigate after onboarding complete trigger
  useEffect(() => {
    if (onBoardingComplete) {
      navigate(EXPLORE_PATH, { replace: true });
    }
  }, [onBoardingComplete]);

  if (profile === null || isOnBoarding === null) {
    return null; // or a splash/loading component
  }

  return (
    <OnboardingContext.Provider value={{ isOnBoarding, setIsOnBoarding }}>
      {isOnBoarding && profile ? (
        <OnBoardingStack isOnBoarding={isOnBoarding} />
      ) : (
        children
      )}
    </OnboardingContext.Provider>
  );
};
