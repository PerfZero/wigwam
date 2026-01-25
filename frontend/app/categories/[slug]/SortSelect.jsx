"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

const options = [
  { value: "", label: "По популярности" },
  { value: "new", label: "Сначала новые" },
  { value: "price_asc", label: "Цена по возрастанию" },
  { value: "price_desc", label: "Цена по убыванию" },
];

const sortIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4 6H14M4 10H12M4 14H10"
      stroke="#492516"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M15.5 7.5L17 6L18.5 7.5"
      stroke="#492516"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 6V14"
      stroke="#492516"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const chevronIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M5.75 7.5L10 11.75L14.25 7.5"
      stroke="#492516"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "";
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const updateSort = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className={styles.sorting}>
        <label className={styles.sortingDesktop}>
          <span className={styles.sortingLabel}>Сортировка:</span>
          <select
            className={styles.sortingSelect}
            value={currentSort}
            onChange={(event) => updateSort(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          className={styles.sortingMobileButton}
          type="button"
          onClick={() => setIsSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isSheetOpen}
        >
          <span className={styles.mobileButtonLeft}>
            <span className={styles.mobileButtonIcon}>{sortIcon}</span>
            Сортировка
          </span>
          <span className={styles.mobileButtonRight}>{chevronIcon}</span>
        </button>
      </div>

      <div
        className={`${styles.sortSheetBackdrop} ${
          isSheetOpen ? styles.sortSheetBackdropOpen : ""
        }`}
        onClick={() => setIsSheetOpen(false)}
      />
      <div
        className={`${styles.sortSheet} ${
          isSheetOpen ? styles.sortSheetOpen : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Сортировка"
      >
        <div className={styles.sortSheetHeader}>
          <span className={styles.sortSheetTitle}>Сортировка</span>
          <button
            className={styles.sortSheetClose}
            type="button"
            onClick={() => setIsSheetOpen(false)}
          >
            Закрыть
          </button>
        </div>
        <div className={styles.sortSheetBody}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.sortSheetOption} ${
                option.value === currentSort ? styles.sortSheetOptionActive : ""
              }`}
              onClick={() => {
                updateSort(option.value);
                setIsSheetOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
