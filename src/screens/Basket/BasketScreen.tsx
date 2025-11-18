import React, { Fragment, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useAppSelector } from "../../hooks/useRedux";

import { selectBasket } from "../../store/slices/basketSlice";
import { useBasket, useUpdateBasketQuantity } from "../../hooks/useBasket";
import {
  AppImage,
  Grid,
  GridItem,
  Heading,
  Icon,
  Text,
} from "../../components";
import {
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
  WHITE,
} from "../../constants";
import { RawTextInput } from "../../components/Form/RawTextInput/RawTextInput";
import { currencyFormat } from "../../utility/currencyFormat";
import { PaymentElement } from "../../elements/PaymentElement/PaymentElement";

export const BasketScreen: React.FC = () => {
  const basket = useAppSelector(selectBasket);

  const [getBasket] = useBasket();

  const [updateBasketQuantity] = useUpdateBasketQuantity();

  const handleBasketUpdate = async (listingId, quantity) => {
    await updateBasketQuantity(listingId, quantity);
  };

  useEffect(() => {
    getBasket();
  }, []);

  return (
    <View style={{ marginBottom: 80 }}>
      <Heading variant={3} weight="semiBold">
        Basket
      </Heading>
      <Grid direction="column" gap={16}>
        {basket?.vendors?.map((vendor, vendorKey) => {
          return (
            <Grid gap={16} key={vendorKey}>
              <Grid direction="row" gap={8} alignItems="center">
                <AppImage
                  width={32}
                  height={32}
                  path={vendor?.vendor?.image}
                  style={{ borderRadius: 60 }}
                />
                <Heading variant={5} weight="semiBold">
                  {vendor?.vendor?.name}
                </Heading>
              </Grid>

              {vendor?.items?.map((item, itemKey) => {
                return (
                  <BasketItemCard
                    key={itemKey}
                    item={item}
                    handleBasketUpdate={handleBasketUpdate}
                  />
                );
              })}
              <PricingSummary
                pricing={vendor?.pricing}
                hasDryShipping={vendor?.items?.some(
                  (item) => item?.listings?.type === "dry"
                )}
                hasLiveShipping={vendor?.items?.some(
                  (item) => item?.listings?.type !== "dry"
                )}
              />

              <PaymentElement
                vendorId={vendor?.vendorId}
                buttonTitle={`Checkout ${vendor?.vendor?.name}`}
              />
            </Grid>
          );
        })}

        <Grid gap={16}>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: REEF_DOCS_GREY,
            }}
          />

          <PricingSummary pricing={basket?.pricing} />

          <PaymentElement buttonTitle={`Checkout All`} />
        </Grid>
      </Grid>
    </View>
  );
};

const BasketItemCard = ({ item, handleBasketUpdate }) => {
  const [quantity, setQuantity] = React.useState(item?.quantity?.toString());

  const handleQuantityChange = (up = false) => {
    let newQuantity = parseInt(quantity) || 0;
    if (up) {
      newQuantity += 1;
    } else {
      newQuantity = Math.max(1, newQuantity - 1);
    }
    setQuantity(newQuantity.toString());

    handleBasketUpdate(item?.listings?.id, newQuantity);
  };

  const deductDisabled = Number(quantity) <= 1;
  const addDisabled = Number(quantity) >= item?.listings?.quantity;

  return (
    <View style={styles.card}>
      <View>
        <AppImage
          path={item?.listings?.images?.[0]}
          width={64}
          height={64}
          style={{ borderRadius: 8 }}
        />
      </View>
      <Grid direction="column" gap={8} style={{ flex: 1 }}>
        <Text weight="bold">{item?.listings?.name}</Text>

        <Grid
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid direction="row">
            <TouchableOpacity
              style={{
                backgroundColor: deductDisabled ? "gray" : REEF_DOCS_BLUE,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                padding: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
              disabled={deductDisabled}
              onPress={() => handleQuantityChange(false)}
            >
              <Icon name="minus" width={24} height={24} />
            </TouchableOpacity>
            <RawTextInput
              keyboardType="numeric"
              value={quantity}
              style={{
                borderRadius: 0,
              }}
              onChange={(v) => setQuantity(v)}
            />
            <TouchableOpacity
              style={{
                backgroundColor: addDisabled ? "gray" : REEF_DOCS_BLUE,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
                padding: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
              disabled={addDisabled}
              onPress={() => handleQuantityChange(true)}
            >
              <Icon name="add" width={24} height={24} />
            </TouchableOpacity>
          </Grid>

          <View>
            <Text>{currencyFormat(item?.listings?.pricing?.priceInclVat)}</Text>
          </View>
        </Grid>
      </Grid>
    </View>
  );
};

const PricingSummary = ({ pricing, hasDryShipping, hasLiveShipping }) => {
  return (
    <Grid style={{ backgroundColor: WHITE, borderRadius: 8 }}>
      <GridItem style={styles.summaryRow}>
        <Text weight="bold">Vendor Summary</Text>
      </GridItem>
      {hasDryShipping && (
        <Grid
          direction="row"
          justifyContent="space-between"
          style={styles.summaryRow}
        >
          <Text>Dry Goods Shipping</Text>
          <Text weight="bold">
            {Number(pricing?.dryShippingInclVat) === 0
              ? "Free"
              : currencyFormat(Number(pricing?.dryShippingInclVat))}
          </Text>
        </Grid>
      )}
      {hasLiveShipping && (
        <Grid
          direction="row"
          justifyContent="space-between"
          style={styles.summaryRow}
        >
          <Text>Live Goods Shipping</Text>
          <Text weight="bold">
            {Number(pricing?.liveShippingInclVat) === 0
              ? "Free"
              : currencyFormat(Number(pricing?.liveShippingInclVat))}
          </Text>
        </Grid>
      )}
      <Grid
        direction="row"
        justifyContent="space-between"
        style={styles.summaryRow}
      >
        <Text>Price</Text>
        <Text weight="bold">
          {currencyFormat(Number(pricing?.priceInclVat))}
        </Text>
      </Grid>
      <Grid
        direction="row"
        justifyContent="space-between"
        style={styles.summaryRow}
      >
        <Text>Total</Text>
        <Text weight="bold">
          {currencyFormat(Number(pricing?.grandTotalInclVat))}
        </Text>
      </Grid>
    </Grid>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
  },
  summaryRow: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: INPUT_BORDER_COLOR,
  },
});
