import React, { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, StyleSheet, View } from "react-native";
import debounce from "lodash.debounce";

import { Button, TextInput } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import apiClient from "../../api/apiClient";
import {
  selectSearchActive,
  selectSearchTerm,
  setSearchActive,
  setSearchResults,
  setSearchTerm,
} from "../../store/slices/globalSlice";

import { APP_HEADER_HEIGHT, BLACK } from "../../constants";
import { sendEvent } from "../../utility/analytics";
import { socialPaths } from "../../screens/Layout/Layout";
import { useLocation } from "react-router-native";

export const Search = () => {
  const dispatch = useAppDispatch();
  const searchActive = useAppSelector(selectSearchActive);
  const searchTerm = useAppSelector(selectSearchTerm);
  const { control } = useForm();
  const location = useLocation();

  // Ref to store the AbortController instance
  const abortControllerRef = useRef(null);

  const fetchSearchResults = async (value) => {
    if (!value) return;

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const response = await apiClient.get(`/search?search=${value}`, {
        signal,
      });

      sendEvent("GLOBAL_SEARCH_QUERY", {
        query: value,
      });

      if (response.status === 200) {
        dispatch(setSearchResults(response.data.data));
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log("Search error:", error);
      }
    }
  };

  // Debounce function to prevent excessive API calls
  const debouncedSearch = useCallback(debounce(fetchSearchResults, 200), []);

  const isSocialPath = socialPaths.includes(location.pathname);

  const handleSearchChange = (value) => {
    dispatch(setSearchTerm(value));
    debouncedSearch(value);
  };

  const handleSearchClose = () => {
    Keyboard.dismiss();
    dispatch(setSearchActive(false));
    dispatch(setSearchTerm(""));
    dispatch(setSearchResults({ articles: [], livestock: [] }));
    searchRef.current?.blur();

    // Abort ongoing request if user clears search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const searchRef = useRef(null);

  useEffect(() => {
    if (searchActive) {
      const timeout = setTimeout(() => {
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }, 100); // Delay allows time for rendering

      return () => clearTimeout(timeout);
    }
  }, [searchActive]);

  useEffect(() => {
    if (searchActive) {
      // Focus the search input when search is active
    } else {
      // Clear the search term when search is not active
      dispatch(setSearchTerm(""));
      dispatch(setSearchResults({ articles: [], livestock: [] }));
    }
  }, [searchActive]);

  return (
    <View style={{ paddingTop: isSocialPath ? APP_HEADER_HEIGHT : 0 }}>
      <TextInput
        ref={searchRef}
        name="search"
        placeholder="Search"
        control={control}
        onChange={(e) => handleSearchChange(e)}
        value={searchTerm}
        style={{ borderRadius: 0 }}
      />
      <View
        style={{
          width: 50,
          position: "absolute",
          right: 0,
          backgroundColor: BLACK,
          height: 50,
        }}
      >
        <Button
          iconRight="close"
          onPress={handleSearchClose}
          style={{ borderRadius: 0, height: 50 }}
        />
      </View>
    </View>
  );
};
