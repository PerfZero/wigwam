"use client";

import { useState } from "react";
import { apiUrl } from "../lib/api";
import { getCartToken, setCartToken } from "../lib/cart";
import ui from "../styles/ui.module.css";
import styles from "./ProductCard.module.css";

export default function AddToCartButton({
  slug,
  variant = "text",
  className = "",
  label = "В корзину",
  iconSrc = "/svg/incart.svg",
}) {
  const [status, setStatus] = useState("idle");

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
        body: JSON.stringify({ product_slug: slug, quantity: 1 }),
      });
      const data = await response.json();
      if (data?.token) {
        setCartToken(data.token);
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  }

  const isIcon = variant === "icon";
  const buttonClassName = isIcon
    ? className
    : `${ui.ui__button} ${className}`.trim();

  return (
    <button
      type="button"
      className={`${buttonClassName} ${styles.productCard__cartButtons}`}
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
