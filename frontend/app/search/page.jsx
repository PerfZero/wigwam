"use client";

import { useState } from "react";
import { apiUrl } from "../../lib/api";
import ProductCard from "../../components/ProductCard";
import ui from "../../styles/ui.module.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");

  async function handleSearch(event) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch(apiUrl("/api/products/"));
      const data = await response.json();
      const list = data.results || [];
      const filtered = list.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filtered);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <div className={`${ui.ui__container} ${ui.ui__stack}`}>
      <h1>Поиск</h1>
      <form className={`${ui.ui__card} ${ui.ui__form}`} onSubmit={handleSearch}>
        <label className={ui.ui__formLabel}>
          Что ищем
          <input
            className={ui.ui__input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button className={ui.ui__button} type="submit">
          Найти
        </button>
      </form>
      {status === "error" && <p>Не удалось выполнить поиск.</p>}
      {status === "ready" && results.length === 0 && <p>Ничего не найдено.</p>}
      {results.length > 0 && (
        <div className={ui.ui__grid}>
          {results.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
