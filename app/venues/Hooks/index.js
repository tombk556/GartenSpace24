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

  return `Preis: ${formattedPricePerSquareMeter}/m²`;
};

export const SquareMeter = (size) => {
  return `${size} m²`;
};


export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};
