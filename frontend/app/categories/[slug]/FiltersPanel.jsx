"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { apiUrl } from "../../../lib/api";
import styles from "./page.module.css";

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

const filterIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 5.5H17M6.5 10H13.5M8.5 14.5H11.5"
      stroke="#492516"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

export default function FiltersPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [attributes, setAttributes] = useState([]);
  const [openGroups, setOpenGroups] = useState({
    filters: true,
    price: true,
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [priceMin, setPriceMin] = useState(searchParams.get("price_min") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("price_max") || "");
  const initialSelections = parseAttrParams(searchParams);
  const [inputValues, setInputValues] = useState(() =>
    buildInputValues(initialSelections),
  );
  const [selectedMap, setSelectedMap] = useState(initialSelections);
  const stateRef = useRef({
    selectedMap: initialSelections,
    priceMin: searchParams.get("price_min") || "",
    priceMax: searchParams.get("price_max") || "",
  });
  const pendingKeyRef = useRef("");
  const priceDirtyRef = useRef(false);
  const didMountRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    fetch(apiUrl("/api/attributes/"))
      .then((response) => {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted || !data?.results) {
          return;
        }
        setAttributes(data.results);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      attributes.forEach((attr) => {
        if (next[attr.slug] === undefined) {
          next[attr.slug] = true;
        }
      });
      return next;
    });
  }, [attributes]);

  useEffect(() => {
    stateRef.current = { selectedMap, priceMin, priceMax };
  }, [selectedMap, priceMin, priceMax]);

  useEffect(() => {
    const nextFilters = extractFilters(searchParams);
    const localKey = serializeFilterKey(stateRef.current);
    const nextKey = serializeFilterKey(nextFilters);
    if (nextKey === localKey) {
      pendingKeyRef.current = "";
      return;
    }
    if (pendingKeyRef.current && nextKey === pendingKeyRef.current) {
      pendingKeyRef.current = "";
      return;
    }
    setSelectedMap(nextFilters.selectedMap);
    setPriceMin(nextFilters.priceMin);
    setPriceMax(nextFilters.priceMax);
    setInputValues(buildInputValues(nextFilters.selectedMap));
  }, [searchParams]);

  function toggleGroup(key) {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function updateSearchParams(params) {
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function commitFilters(nextSelections, nextMin, nextMax) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("attr");
    params.delete("price_min");
    params.delete("price_max");
    const normalizedMin = normalizeNumberInput(nextMin);
    const normalizedMax = normalizeNumberInput(nextMax);
    if (normalizedMin) {
      params.set("price_min", normalizedMin);
    }
    if (normalizedMax) {
      params.set("price_max", normalizedMax);
    }
    const entries = buildAttrEntries(nextSelections);
    entries.forEach((entry) => params.append("attr", entry));
    pendingKeyRef.current = serializeFilterKey({
      selectedMap: nextSelections,
      priceMin: normalizedMin,
      priceMax: normalizedMax,
    });
    updateSearchParams(params);
  }

  function clearPrice() {
    setPriceMin("");
    setPriceMax("");
    priceDirtyRef.current = false;
    commitFilters(selectedMap, "", "");
  }

  function toggleOption(attrSlug, optionSlug) {
    const nextSelections = new Map(selectedMap);
    const current = new Set(nextSelections.get(attrSlug) || []);
    if (current.has(optionSlug)) {
      current.delete(optionSlug);
    } else {
      current.add(optionSlug);
    }
    nextSelections.set(attrSlug, current);
    setSelectedMap(nextSelections);
    commitFilters(nextSelections, priceMin, priceMax);
  }

  function applyAttributeValue(attrSlug, rawValue, type) {
    const value =
      type === "number" ? normalizeNumberInput(rawValue) : rawValue.trim();
    const nextSelections = new Map(selectedMap);
    if (!value) {
      nextSelections.delete(attrSlug);
    } else {
      nextSelections.set(attrSlug, new Set([value]));
    }
    setSelectedMap(nextSelections);
    commitFilters(nextSelections, priceMin, priceMax);
  }

  function clearAttribute(attrSlug) {
    setInputValues((prev) => ({ ...prev, [attrSlug]: "" }));
    const nextSelections = new Map(selectedMap);
    nextSelections.delete(attrSlug);
    setSelectedMap(nextSelections);
    commitFilters(nextSelections, priceMin, priceMax);
  }

  function handleInputKeyDown(event, attrSlug) {
    if (event.key === "Enter") {
      event.preventDefault();
      applyAttributeValue(
        attrSlug,
        inputValues[attrSlug] || "",
        event.currentTarget.dataset.type,
      );
    }
  }

  function handlePriceKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      priceDirtyRef.current = false;
      const normalizedMin = normalizeNumberInput(priceMin);
      const normalizedMax = normalizeNumberInput(priceMax);
      setPriceMin(normalizedMin);
      setPriceMax(normalizedMax);
      commitFilters(selectedMap, normalizedMin, normalizedMax);
    }
  }

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (!priceDirtyRef.current) {
      return;
    }
    const handle = setTimeout(() => {
      priceDirtyRef.current = false;
      commitFilters(selectedMap, priceMin, priceMax);
    }, 400);
    return () => clearTimeout(handle);
  }, [priceMin, priceMax, selectedMap]);

  const isFiltersOpen = openGroups.filters;

  return (
    <>
      <button
        className={styles.filtersMobileButton}
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isMobileOpen}
      >
        <span className={styles.mobileButtonLeft}>
          <span className={styles.mobileButtonIcon}>{filterIcon}</span>
          Фильтры
        </span>
        <span className={styles.mobileButtonRight}>{chevronIcon}</span>
      </button>

      <div
        className={`${styles.filtersBackdrop} ${
          isMobileOpen ? styles.filtersBackdropOpen : ""
        }`}
        onClick={() => setIsMobileOpen(false)}
      />
      <aside
        className={`${styles.filters} ${
          isMobileOpen ? styles.filtersOpen : ""
        }`}
      >
        <div className={styles.filtersMobileHeader}>
          <span className={styles.filtersMobileTitle}>Фильтры</span>
          <button
            className={styles.filtersMobileClose}
            type="button"
            onClick={() => setIsMobileOpen(false)}
          >
            Закрыть
          </button>
        </div>
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
                      value={priceMin}
                      onChange={(event) => {
                        priceDirtyRef.current = true;
                        setPriceMin(event.target.value);
                      }}
                      onBlur={() => {
                        priceDirtyRef.current = false;
                        const normalizedMin = normalizeNumberInput(priceMin);
                        const normalizedMax = normalizeNumberInput(priceMax);
                        setPriceMin(normalizedMin);
                        setPriceMax(normalizedMax);
                        commitFilters(
                          selectedMap,
                          normalizedMin,
                          normalizedMax,
                        );
                      }}
                      onKeyDown={handlePriceKeyDown}
                      inputMode="numeric"
                      type="text"
                    />
                  </label>
                  <label className={styles.filterInputGroup}>
                    <span className={styles.filterCurrency}>₸</span>
                    <input
                      className={styles.filterInput}
                      placeholder="до"
                      value={priceMax}
                      onChange={(event) => {
                        priceDirtyRef.current = true;
                        setPriceMax(event.target.value);
                      }}
                      onBlur={() => {
                        priceDirtyRef.current = false;
                        const normalizedMin = normalizeNumberInput(priceMin);
                        const normalizedMax = normalizeNumberInput(priceMax);
                        setPriceMin(normalizedMin);
                        setPriceMax(normalizedMax);
                        commitFilters(
                          selectedMap,
                          normalizedMin,
                          normalizedMax,
                        );
                      }}
                      onKeyDown={handlePriceKeyDown}
                      inputMode="numeric"
                      type="text"
                    />
                  </label>
                </div>
                <button
                  className={styles.filterClear}
                  type="button"
                  onClick={clearPrice}
                >
                  Очистить
                </button>
              </div>
            </div>

            {attributes
              .filter((attribute) => attribute.is_filterable !== false)
              .map((attribute) => {
                const isOpen = openGroups[attribute.slug];
                const selections = selectedMap.get(attribute.slug) || new Set();
                const inputValue = inputValues[attribute.slug] ?? "";
                const hasOptions = attribute.type === "select";
                const isBoolean = attribute.type === "boolean";

                return (
                  <div className={styles.filterGroupInner} key={attribute.slug}>
                    <button
                      className={styles.filterHeaderButton}
                      type="button"
                      onClick={() => toggleGroup(attribute.slug)}
                      aria-expanded={isOpen}
                      aria-controls={`filter-${attribute.slug}`}
                    >
                      <span className={styles.filterTitle}>
                        {attribute.name}
                      </span>
                      <span
                        className={`${styles.filterChevron} ${
                          isOpen ? styles.filterChevronOpen : ""
                        }`}
                      >
                        {chevronIcon}
                      </span>
                    </button>
                    <div
                      id={`filter-${attribute.slug}`}
                      className={`${styles.filterBody} ${
                        isOpen ? "" : styles.filterBodyHidden
                      }`}
                    >
                      {hasOptions ? (
                        attribute.options.map((option) => {
                          const isChecked = selections.has(option.slug);
                          return (
                            <label
                              key={option.slug}
                              className={styles.filterOption}
                              onClick={(event) => {
                                event.preventDefault();
                                toggleOption(attribute.slug, option.slug);
                              }}
                            >
                              <span className={styles.filterOptionLabel}>
                                {option.value}
                              </span>
                              <input
                                type="checkbox"
                                className={styles.filterCheckboxInput}
                                checked={isChecked}
                                readOnly
                              />
                              <span className={styles.filterCheckboxBox}>
                                {checkIcon}
                              </span>
                            </label>
                          );
                        })
                      ) : isBoolean ? (
                        [
                          { value: "true", label: "Да" },
                          { value: "false", label: "Нет" },
                        ].map((option) => {
                          const isChecked = selections.has(option.value);
                          return (
                            <label
                              key={option.value}
                              className={styles.filterOption}
                              onClick={(event) => {
                                event.preventDefault();
                                toggleOption(attribute.slug, option.value);
                              }}
                            >
                              <span className={styles.filterOptionLabel}>
                                {option.label}
                              </span>
                              <input
                                type="checkbox"
                                className={styles.filterCheckboxInput}
                                checked={isChecked}
                                readOnly
                              />
                              <span className={styles.filterCheckboxBox}>
                                {checkIcon}
                              </span>
                            </label>
                          );
                        })
                      ) : (
                        <label className={styles.filterOption}>
                          <span className={styles.filterOptionLabel}>
                            Значение
                          </span>
                          <input
                            className={styles.filterInput}
                            value={inputValue}
                            onChange={(event) =>
                              setInputValues((prev) => ({
                                ...prev,
                                [attribute.slug]: event.target.value,
                              }))
                            }
                            onBlur={() =>
                              applyAttributeValue(
                                attribute.slug,
                                inputValue,
                                attribute.type,
                              )
                            }
                            onKeyDown={(event) =>
                              handleInputKeyDown(event, attribute.slug)
                            }
                            data-type={attribute.type}
                            inputMode={
                              attribute.type === "number"
                                ? "decimal"
                                : undefined
                            }
                            type="text"
                          />
                        </label>
                      )}
                      <button
                        className={styles.filterClear}
                        type="button"
                        onClick={() => clearAttribute(attribute.slug)}
                      >
                        Очистить
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </aside>
    </>
  );
}

function parseAttrParams(searchParams) {
  const map = new Map();
  const rawAttrs = searchParams.getAll("attr");
  rawAttrs.forEach((raw) => {
    if (!raw || !raw.includes(":")) {
      return;
    }
    const [slug, rawValues] = raw.split(":");
    if (!slug) {
      return;
    }
    const values = rawValues ? rawValues.split(",").filter(Boolean) : [];
    if (!map.has(slug)) {
      map.set(slug, new Set());
    }
    values.forEach((value) => map.get(slug).add(value));
  });
  return map;
}

function extractFilters(searchParams) {
  return {
    selectedMap: parseAttrParams(searchParams),
    priceMin: searchParams.get("price_min") || "",
    priceMax: searchParams.get("price_max") || "",
  };
}

function buildInputValues(selections) {
  const next = {};
  for (const [slug, values] of selections.entries()) {
    next[slug] = Array.from(values)[0] || "";
  }
  return next;
}

function serializeFilterKey({ selectedMap, priceMin, priceMax }) {
  const parts = [];
  const normalizedMin = normalizeNumberInput(priceMin);
  const normalizedMax = normalizeNumberInput(priceMax);
  if (normalizedMin) {
    parts.push(`price_min=${normalizedMin}`);
  }
  if (normalizedMax) {
    parts.push(`price_max=${normalizedMax}`);
  }
  const entries = buildAttrEntries(selectedMap);
  entries.sort();
  entries.forEach((entry) => parts.push(`attr=${entry}`));
  return parts.join("&");
}

function buildAttrEntries(selections) {
  if (!selections || typeof selections.entries !== "function") {
    return [];
  }
  const entries = [];
  for (const [slug, values] of selections.entries()) {
    if (!values || values.size === 0) {
      continue;
    }
    entries.push(`${slug}:${Array.from(values).join(",")}`);
  }
  return entries;
}

function normalizeNumberInput(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  const normalized = raw.replace(",", ".").replace(/[^0-9.]/g, "");
  if (!normalized) {
    return "";
  }
  const [intPart, ...rest] = normalized.split(".");
  const fractional = rest.join("");
  if (!intPart && !fractional) {
    return "";
  }
  return fractional ? `${intPart}.${fractional}` : intPart;
}
