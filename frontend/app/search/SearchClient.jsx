"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiUrl } from "../../lib/api";
import ProductCard from "../../components/ProductCard";
import styles from "./page.module.css";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initialQuery = (searchParams.get("q") || "").trim();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");

  async function runSearch(term) {
    const trimmed = term.trim();
    if (!trimmed) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch(
        apiUrl(`/api/products/?q=${encodeURIComponent(trimmed)}`),
      );
      const data = await response.json();
      setResults(data.results || []);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    runSearch(query);
  }

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      runSearch(initialQuery);
    }
  }, [initialQuery]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Поиск</h1>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              className={styles.searchInput}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Что ищем?"
              aria-label="Поиск"
              name="q"
            />
            <button className={styles.searchButton} type="submit">
              Найти
            </button>
          </form>
        </div>
      </header>

      <main className={styles.container}>
        {status === "error" && (
          <p className={styles.message}>Не удалось выполнить поиск.</p>
        )}
        {status === "ready" && results.length === 0 && (
          <p className={styles.message}>Ничего не найдено.</p>
        )}
        {results.length > 0 && (
          <div className={styles.grid}>
            {results.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
