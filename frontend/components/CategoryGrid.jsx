"use client";

import Link from "next/link";
import styles from "./CategoryGrid.module.css";

const publicBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const layoutClasses = [
  styles.categoryGrid__itemWide,
  "",
  "",
  "",
  "",
  styles.categoryGrid__itemWide,
];

export default function CategoryGrid({ categories }) {
  return (
    <div className={styles.categoryGrid}>
      {categories.map((category, index) => {
        const wideClass = layoutClasses[index] || "";
        const imageUrl = category.image_url
          ? category.image_url.replace(/^http:\/\/backend:8000/, publicBase)
          : "";
        return (
          <Link
            key={category.id}
            className={`${styles.categoryGrid__item} ${wideClass}`.trim()}
            href={`/categories/${category.slug}`}
          >
            {imageUrl && (
              <img
                className={styles.categoryGrid__image}
                src={imageUrl}
                alt={category.name}
              />
            )}
            <div className={styles.categoryGrid__overlay} aria-hidden="true" />
            <span className={styles.categoryGrid__content}>
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
