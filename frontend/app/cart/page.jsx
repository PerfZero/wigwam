"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";
import { getCartToken, setCartToken } from "../../lib/cart";
import ui from "../../styles/ui.module.css";
import styles from "./page.module.css";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [status, setStatus] = useState("loading");

  async function loadCart() {
    setStatus("loading");
    const token = getCartToken();
    const response = await fetch(apiUrl("/api/cart/"), {
      headers: token ? { "X-Cart-Token": token } : undefined,
    });
    const data = await response.json();
    if (data?.token) {
      setCartToken(data.token);
    }
    setCart(data);
    setStatus("ready");
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateItem(itemId, quantity) {
    const token = getCartToken();
    await fetch(apiUrl(`/api/cart/items/${itemId}/`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Cart-Token": token } : {}),
      },
      body: JSON.stringify({ quantity }),
    });
    loadCart();
  }

  async function removeItem(itemId) {
    const token = getCartToken();
    await fetch(apiUrl(`/api/cart/items/${itemId}/remove/`), {
      method: "DELETE",
      headers: token ? { "X-Cart-Token": token } : {},
    });
    loadCart();
  }

  if (status === "loading") {
    return (
      <div className={`${ui.ui__container} ${ui.ui__stack}`}>
        <h1>Корзина</h1>
        <p>Загружаем корзину...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price || 0) * item.quantity,
    0,
  );

  return (
    <div className={`${ui.ui__container} ${ui.ui__stack}`}>
      <h1>Корзина</h1>
      {items.length === 0 && <p>Корзина пустая.</p>}
      {items.length > 0 && (
        <div className={ui.ui__stack}>
          {items.map((item) => (
            <div
              key={item.id}
              className={`${ui.ui__card} ${styles.cart__item}`}
            >
              <div>
                <strong>{item.product.name}</strong>
                <p className={ui.ui__muted}>{item.product.price} ₸</p>
              </div>
              <div className={styles.cart__actions}>
                <button
                  className={styles.cart__qtyButton}
                  onClick={() => updateItem(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className={styles.cart__qtyButton}
                  onClick={() => updateItem(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className={styles.cart__removeButton}
                  onClick={() => removeItem(item.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
          <div className={`${ui.ui__card} ${styles.cart__total}`}>
            <strong>Итого: {total.toFixed(2)} ₸</strong>
            <p className={ui.ui__muted}>
              Онлайн оплаты нет — подтвердим заказ по телефону.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
