import React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Grid, GridItem, Icon, Text } from "../../components";

import { SearchInput } from "../../elements/SearchInput/SearchInput";

import { BLACK, REEF_DOCS_BLUE, WHITE } from "../../constants";

export const LiveStockHeader = ({
  searchOpen,
  searchValue,
  onSearchChange,
  onSearchClose,
  onOpenSearch,
  onOpenSort,
  onOpenFilter,
  onClearFilters,
  totalFilters,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (searchOpen.state && searchOpen.focus) {
      const timeout = setTimeout(() => {
        ref?.current?.focus();
      }, 100); // 100–200ms is usually safe

      return () => clearTimeout(timeout);
    }
  }, [searchOpen]);

  return (
    <Grid
      gap={8}
      direction="row"
      alignItems="space-between"
      justifyContent="center"
    >
      {!searchOpen.state && (
        <TouchableOpacity style={styles.actionButton} onPress={onOpenSearch}>
          <GridItem>
            <Icon name="search" fill={BLACK} />
          </GridItem>
        </TouchableOpacity>
      )}

      {searchOpen.state && (
        <GridItem flex={8}>
          <SearchInput
            ref={ref}
            styles={{ paddingTop: 4, paddingBottom: 4 }}
            onChange={onSearchChange}
            value={searchValue}
          />
          <TouchableOpacity
            onPress={onSearchClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <Icon name="close" fill={BLACK} />
          </TouchableOpacity>
        </GridItem>
      )}

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onOpenSort()}
      >
        <GridItem>
          <Icon name="sort" fill={BLACK} />
        </GridItem>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onOpenFilter}>
        <GridItem>
          <Icon name="filter" fill={BLACK} />
          {totalFilters > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalFilters?.toString()}</Text>
            </View>
          )}
        </GridItem>
      </TouchableOpacity>

      {totalFilters > 0 && (
        <TouchableOpacity style={styles.actionButton} onPress={onClearFilters}>
          <GridItem>
            <Icon name="close" fill={BLACK} />
          </GridItem>
        </TouchableOpacity>
      )}
    </Grid>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: WHITE,
    flex: 1,
    alignItems: "center",
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  badge: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: REEF_DOCS_BLUE,
    top: -2,
    right: -6,
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: WHITE,
    fontSize: 8,
  },
});
