import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import {Grid, GridItem} from '../Grid/Grid';
import {Text} from '../Text/Text';
import {useClearRefinements} from 'react-instantsearch-core';

type AppliedFiltersProps = {
  filters: Array<{attribute: string; indexId: string; label: string}>;
};

export const AppliedFilters: React.FC<AppliedFiltersProps> = ({filters}) => {
  const {canRefine: canClear, refine: clear} = useClearRefinements();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Grid gap={16} direction="row">
        {filters?.map((item, key) => (
          <TouchableOpacity
            onPress={() => clear()}
            style={styles.indicator}
            key={key}>
            <Grid direction="row" justifyContent="center" gap={8}>
              <GridItem>
                <Text weight="semiBold">{item?.label}</Text>
              </GridItem>
              <GridItem>
                <Text weight="semiBold">x</Text>
              </GridItem>
            </Grid>
          </TouchableOpacity>
        ))}
      </Grid>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  indicator: {
    borderRadius: 16,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
});
