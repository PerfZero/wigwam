"use client";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import styles from "./ProductCard.module.css";

const publicBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProductCard({ product }) {
  const imageUrl = product.image_url
    ? product.image_url.replace(/^http:\/\/backend:8000/, publicBase)
    : "";

  return (
    <div className={styles.productCard}>
      <Link
        className={styles.productCard__media}
        href={`/products/${product.slug}`}
      >
        {imageUrl ? (
          <img
            className={styles.productCard__image}
            src={imageUrl}
            alt={product.name}
          />
        ) : (
          <div
            className={styles.productCard__mediaFallback}
            aria-hidden="true"
          />
        )}
      </Link>
      <div className={styles.productCard__body}>
        <Link
          className={styles.productCard__title}
          href={`/products/${product.slug}`}
        >
          {product.name}
        </Link>

        <div className={styles.productCard__footer}>
          <span className={styles.productCard__price}>{product.price} ₸</span>
          <AddToCartButton
            slug={product.slug}
            variant="icon"
            className={styles.productCard__cartButton}
            label="Добавить в корзину"
          />
        </div>
      </div>
    </div>
  );
}
