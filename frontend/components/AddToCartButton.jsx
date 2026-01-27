"use client";

import { useState } from "react";
import { apiUrl } from "../lib/api";
import { getCartToken, setCartToken } from "../lib/cart";
import { useCart } from "../contexts/CartContext";
import styles from "./AddToCartButton.module.css";

export default function AddToCartButton({
  slug,
  variant = "text",
  className = "",
  label = "В корзину",
  iconSrc = "/svg/incart.svg",
  quantity = 1,
}) {
  const [status, setStatus] = useState("idle");
  const { updateCart } = useCart();

  async function handleAdd() {
    setStatus("loading");
    try {
      const token = getCartToken();
      const response = await fetch(apiUrl("/api/cart/items/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "X-Cart-Token": token } : {}),
        },
        body: JSON.stringify({ product_slug: slug, quantity }),
      });
      const data = await response.json();
      if (data?.token) {
        setCartToken(data.token);
      }
      setStatus("success");

      // Обновляем состояние корзины через context
      if (data?.items) {
        const totalCount = data.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        updateCart(totalCount, data.items);
      }
    } catch (error) {
      setStatus("error");
    }
  }

  const isIcon = variant === "icon";
  const buttonClassName = className;
  const baseClassName = `${styles.button} ${
    isIcon ? styles.iconButton : styles.textButton
  }`;

  return (
    <button
      type="button"
      className={`${baseClassName} ${buttonClassName}`.trim()}
      onClick={handleAdd}
      disabled={status === "loading"}
      aria-label={label}
    >
      {isIcon ? (
        <img src={iconSrc} alt="" />
      ) : status === "success" ? (
        "Добавлено"
      ) : (
        label
      )}
    </button>
  );
}
