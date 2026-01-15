export const CART_TOKEN_KEY = 'wigwam_cart_token';

export function getCartToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(CART_TOKEN_KEY);
}

export function setCartToken(token) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(CART_TOKEN_KEY, token);
}
