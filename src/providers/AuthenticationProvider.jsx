import React, { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-native";
import * as SecureStore from "expo-secure-store";

import { AuthStack } from "../navigation/AuthStack";
import { useGetUserProfile } from "../hooks/useAuth";
import { useAppDispatch } from "../hooks/useRedux";
import { clearUser } from "../store/slices/globalSlice";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "../constants/global";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [handleGetUserProfile] = useGetUserProfile();

  const handleClearDown = async () => {
    dispatch(clearUser(false));
    setAuthed(false);
    navigate("/");
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_STORAGE_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_STORAGE_KEY);
  };

  const getUserProfile = async () => {
    const result = await handleGetUserProfile().catch((error) => {
      if (error?.status === 401) {
        setAuthed(false);
      }
      setLoading(false);
    });

    if (result?.data) {
      setAuthed(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await getUserProfile();
    };
    init();
  }, []);

  if (loading) return <></>;

  return (
    <AuthenticationContext.Provider value={{ getUserProfile, setAuthed }}>
      {!authed ? <AuthStack /> : children}
    </AuthenticationContext.Provider>
  );
};
