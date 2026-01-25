"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import styles from "../app/products/[slug]/page.module.css";

export default function PurchaseBlock({ slug, maxQuantity = 400 }) {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className={styles.purchase}>
      <div className={styles.purchaseTop}>
        <div className={styles.quantityBlock}>
          <div className={styles.quantityLabel}>
            Количество: <span>{quantity}</span>
          </div>
          <div className={styles.quantityControl}>
            <button
              className={styles.quantityButton}
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              –
            </button>
            <button
              className={styles.quantityButton}
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
          <div className={styles.quantityHint}>Макс: {maxQuantity}</div>
        </div>
        <div className={styles.actions}>
          <AddToCartButton
            slug={slug}
            label="Добавить в корзину"
            className={styles.addToCart}
            quantity={quantity}
          />
        </div>
      </div>
      <button className={styles.buyNow} type="button">
        Купить сейчас
      </button>
    </div>
  );
}
