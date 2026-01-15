"use client";

import { useState } from "react";
import { apiUrl } from "../lib/api";
import ui from "../styles/ui.module.css";

export default function ProductReviewForm({ slug }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch(apiUrl(`/api/products/${slug}/reviews/`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating: Number(rating), text }),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      setName("");
      setRating(5);
      setText("");
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <form className={`${ui.ui__card} ${ui.ui__form}`} onSubmit={handleSubmit}>
      <h3>Оставить отзыв</h3>
      <label className={ui.ui__formLabel}>
        Имя
        <input
          className={ui.ui__input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className={ui.ui__formLabel}>
        Оценка
        <select
          className={ui.ui__select}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className={ui.ui__formLabel}>
        Текст
        <textarea
          className={ui.ui__textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </label>
      <button
        className={ui.ui__button}
        type="submit"
        disabled={status === "loading"}
      >
        Отправить
      </button>
      {status === "success" && (
        <p className={ui.ui__hint}>Спасибо! Отзыв отправлен.</p>
      )}
      {status === "error" && (
        <p className={ui.ui__hint}>Не удалось отправить отзыв.</p>
      )}
    </form>
  );
}
