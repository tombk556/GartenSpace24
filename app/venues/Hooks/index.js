export const formatCurrency = (value) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const calculatePricePerSquareMeter = (totalPrice, size) => {
  const pricePerSquareMeter = totalPrice / size;

  const formattedPricePerSquareMeter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(pricePerSquareMeter);

  return `Kaufpreis: ${formattedPricePerSquareMeter}/m²`;
};

export const SquareMeter = (size) => {
  return `${size} m²`;
};
