"use client";

import Link from "next/link";
import { useState } from "react";
import { apiUrl } from "../lib/api";
import styles from "./ProductReviewForm.module.css";

export default function ProductReviewForm({
  slug,
  showTitle = true,
  onSuccess,
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    const payloadText = subject.trim() ? `${subject.trim()}\n\n${text}` : text;
    try {
      const response = await fetch(apiUrl(`/api/products/${slug}/reviews/`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          rating: Number(rating),
          text: payloadText,
        }),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      setName("");
      setRating(5);
      setSubject("");
      setText("");
      setStatus("success");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <form className={styles.review} onSubmit={handleSubmit}>
      {showTitle && (
        <div className={styles.review__header}>
          <h3 className={styles.review__title}>Отзыв</h3>
        </div>
      )}
      <div className={styles.review__rating}>
        <span className={styles.review__label}>Общий рейтинг</span>
        <div className={styles.review__stars} role="radiogroup">
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            return (
              <button
                key={`rating-${value}`}
                className={`${styles.review__star} ${
                  value <= rating ? styles.review__starActive : ""
                }`}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`Оценка ${value}`}
              >
                <svg
                  width="20"
                  height="19"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.42188 16.4375C3.10156 16.1953 3.03125 15.7969 3.22656 15.2266L4.85938 10.3672L0.6875 7.36719C0.203125 7.02344 0 6.66406 0.132812 6.27344C0.257812 5.89844 0.625 5.71875 1.22656 5.71875H6.34375L7.89844 0.867188C8.08594 0.289062 8.36719 0 8.76562 0C9.17188 0 9.45312 0.289062 9.64062 0.867188L11.1953 5.71875H16.3125C16.9141 5.71875 17.2812 5.89844 17.4062 6.27344C17.5312 6.66406 17.3359 7.02344 16.8516 7.36719L12.6797 10.3672L14.3125 15.2266C14.5078 15.7969 14.4375 16.1953 14.1172 16.4375C13.7891 16.6875 13.3906 16.6016 12.9062 16.25L8.76562 13.2109L4.63281 16.25C4.14844 16.6016 3.74219 16.6875 3.42188 16.4375Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles.review__fields}>
        <input
          className={styles.review__input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Как Ваше имя?"
          aria-label="Как Ваше имя?"
          required
        />
        <input
          className={styles.review__input}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="О чем Ваш отзыв?"
          aria-label="О чем Ваш отзыв?"
        />
        <textarea
          className={styles.review__textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Текст отзыва"
          aria-label="Текст отзыва"
          required
        />
      </div>
      <div className={styles.review__actions}>
        <button
          className={styles.review__primary}
          type="submit"
          disabled={status === "loading"}
        >
          Оставить отзыв
        </button>
        <Link className={styles.review__secondary} href="/categories">
          Продолжать покупки
        </Link>
      </div>
      {status === "error" && (
        <p className={styles.review__hint}>Не удалось отправить отзыв.</p>
      )}
    </form>
  );
}
