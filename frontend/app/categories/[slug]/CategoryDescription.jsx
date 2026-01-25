"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function CategoryDescription({ html }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`${styles.categoryDetails} ${
        isOpen ? styles.categoryDetailsOpen : styles.categoryDetailsCollapsed
      }`}
      id="category-description"
    >
      <div
        className={styles.categoryContent}
        id="category-description-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <button
        className={styles.categoryToggle}
        type="button"
        aria-expanded={isOpen}
        aria-controls="category-description-content"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "Скрыть подробности" : "Подробнее"}
        <svg
          className={styles.toggleIcon}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 13.0771C9.87305 13.0771 9.76074 13.0283 9.66797 12.9355L5.88867 9.06836C5.80566 8.98047 5.75684 8.87305 5.75684 8.75098C5.75684 8.49707 5.94727 8.30176 6.20117 8.30176C6.32812 8.30176 6.44043 8.35059 6.51855 8.42871L10 11.9834L13.4766 8.42871C13.5596 8.35059 13.6719 8.30176 13.7939 8.30176C14.0479 8.30176 14.2383 8.49707 14.2383 8.75098C14.2383 8.87305 14.1895 8.98047 14.1064 9.06348L10.3271 12.9355C10.2441 13.0283 10.1221 13.0771 10 13.0771Z"
            fill="#492516"
          />
        </svg>
      </button>
    </div>
  );
}
