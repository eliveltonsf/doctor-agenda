export const formatCurrencyInCents = (valueInCents: number): string => {
  const valueInDollars = valueInCents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInDollars);
};
