"use client";

import { useState } from "react";
import styles from "./page.module.css";

const subcategoryOptions = [
  "Трубки из дерева",
  "Бриаровые (вересковые) трубки",
  "Железные трубки",
  "Трубки из глины",
];

const brandOptions = ["Tobacco Premium", "Tobachos", "Chinitos", "Nachoritos"];

const chevronIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 13.0771C9.87305 13.0771 9.76074 13.0283 9.66797 12.9355L5.88867 9.06836C5.80566 8.98047 5.75684 8.87305 5.75684 8.75098C5.75684 8.49707 5.94727 8.30176 6.20117 8.30176C6.32812 8.30176 6.44043 8.35059 6.51855 8.42871L10 11.9834L13.4766 8.42871C13.5596 8.35059 13.6719 8.30176 13.7939 8.30176C14.0479 8.30176 14.2383 8.49707 14.2383 8.75098C14.2383 8.87305 14.1895 8.98047 14.1064 9.06348L10.3271 12.9355C10.2441 13.0283 10.1221 13.0771 10 13.0771Z"
      fill="#492516"
    />
  </svg>
);

const checkIcon = (
  <svg
    width="7"
    height="7"
    viewBox="0 0 7 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.39453 6.55469C2.26953 6.55469 2.17969 6.50391 2.09375 6.39062L0.0859375 3.92188C0.0273438 3.84766 0 3.77344 0 3.70703C0 3.54297 0.117188 3.42969 0.28125 3.42969C0.390625 3.42969 0.464844 3.47266 0.539062 3.57031L2.37891 5.875L6.01562 0.148438C6.08203 0.0429688 6.14844 0 6.26562 0C6.42578 0 6.53516 0.109375 6.53516 0.273438C6.53516 0.335938 6.51562 0.402344 6.46094 0.488281L2.67969 6.39844C2.61328 6.5 2.51953 6.55469 2.39453 6.55469Z"
      fill="#492516"
    />
  </svg>
);

export default function FiltersPanel() {
  const [openGroups, setOpenGroups] = useState({
    filters: true,
    subcategory: true,
    price: true,
    brand: true,
  });

  function toggleGroup(key) {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const isFiltersOpen = openGroups.filters;

  return (
    <aside className={styles.filters}>
      <div className={styles.filterGroup}>
        <button
          className={styles.filterHeaderButtons}
          type="button"
          onClick={() => toggleGroup("filters")}
          aria-expanded={isFiltersOpen}
          aria-controls="filters-body"
        >
          <span className={styles.filterTitles}>Фильтры</span>
          <span
            className={`${styles.filterChevron} ${
              isFiltersOpen ? styles.filterChevronOpen : ""
            }`}
          >
            {chevronIcon}
          </span>
        </button>
        <div
          id="filters-body"
          className={`${styles.filterBody} ${
            isFiltersOpen ? "" : styles.filterBodyHidden
          }`}
        >
          <div className={styles.filterGroupInner}>
            <button
              className={styles.filterHeaderButton}
              type="button"
              onClick={() => toggleGroup("subcategory")}
              aria-expanded={openGroups.subcategory}
              aria-controls="filter-subcategory"
            >
              <span className={styles.filterTitle}>Подкатегория</span>
              <span
                className={`${styles.filterChevron} ${
                  openGroups.subcategory ? styles.filterChevronOpen : ""
                }`}
              >
                {chevronIcon}
              </span>
            </button>
            <div
              id="filter-subcategory"
              className={`${styles.filterBody} ${
                openGroups.subcategory ? "" : styles.filterBodyHidden
              }`}
            >
              {subcategoryOptions.map((option) => (
                <label key={option} className={styles.filterOption}>
                  <span className={styles.filterOptionLabel}>{option}</span>
                  <input
                    type="checkbox"
                    className={styles.filterCheckboxInput}
                  />
                  <span className={styles.filterCheckboxBox}>{checkIcon}</span>
                </label>
              ))}
              <button className={styles.filterClear} type="button">
                Очистить
              </button>
            </div>
          </div>

          <div className={styles.filterGroupInner}>
            <button
              className={styles.filterHeaderButton}
              type="button"
              onClick={() => toggleGroup("price")}
              aria-expanded={openGroups.price}
              aria-controls="filter-price"
            >
              <span className={styles.filterTitle}>Стоимость</span>

              <span
                className={`${styles.filterChevron} ${
                  openGroups.price ? styles.filterChevronOpen : ""
                }`}
              >
                {chevronIcon}
              </span>
            </button>
            <div
              id="filter-price"
              className={`${styles.filterBody} ${
                openGroups.price ? "" : styles.filterBodyHidden
              }`}
            >
              <div className={styles.filterRange}>
                <label className={styles.filterInputGroup}>
                  <span className={styles.filterCurrency}>₸</span>
                  <input
                    className={styles.filterInput}
                    placeholder="от"
                    type="text"
                  />
                </label>
                <label className={styles.filterInputGroup}>
                  <span className={styles.filterCurrency}>₸</span>
                  <input
                    className={styles.filterInput}
                    placeholder="до"
                    type="text"
                  />
                </label>
              </div>
              <button className={styles.filterClear} type="button">
                Очистить
              </button>
            </div>
          </div>

          <div className={styles.filterGroupInner}>
            <button
              className={styles.filterHeaderButton}
              type="button"
              onClick={() => toggleGroup("brand")}
              aria-expanded={openGroups.brand}
              aria-controls="filter-brand"
            >
              <span className={styles.filterTitle}>Бренд</span>
              <span
                className={`${styles.filterChevron} ${
                  openGroups.brand ? styles.filterChevronOpen : ""
                }`}
              >
                {chevronIcon}
              </span>
            </button>
            <div
              id="filter-brand"
              className={`${styles.filterBody} ${
                openGroups.brand ? "" : styles.filterBodyHidden
              }`}
            >
              {brandOptions.map((option) => (
                <label key={option} className={styles.filterOption}>
                  <span className={styles.filterOptionLabel}>{option}</span>
                  <input
                    type="checkbox"
                    className={styles.filterCheckboxInput}
                  />
                  <span className={styles.filterCheckboxBox}>{checkIcon}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
