export default function priceToString(price) {
  return `$${Number(price / 100.0).toFixed(2)}`;
}
