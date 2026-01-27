export const formatPrice = (value) =>
  new Intl.NumberFormat("ru-RU")
    .format(Number(value) || 0)
    .replace(/\u00A0|\u202F/g, " ");
