// src/utility/currencyFormat.ts

/**
 * Formats a number as a currency string (e.g., £1,234.56)
 * @param value The number to format
 * @param currency The currency code (default: 'GBP')
 * @param locale The locale string (default: 'en-GB')
 */
export function currencyFormat(
  value: number,
  currency: string = "GBP",
  locale: string = "en-GB"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
