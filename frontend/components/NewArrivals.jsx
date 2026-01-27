"use client";

import { useState } from "react";
import { apiUrl } from "../lib/api";
import styles from "./NewArrivals.module.css";

export default function NewArrivals() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, email:", email);
    if (!email) {
      console.log("No email provided");
      return;
    }

    setIsLoading(true);

    try {
      const url = apiUrl("/api/subscribe/");
      console.log("Making request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Response:", response.status, data);

      if (response.ok) {
        setIsSubscribed(true);
      } else {
        // Если email уже существует, всё равно показываем успех
        if (response.status === 409) {
          setIsSubscribed(true);
        } else {
          console.error("Subscribe error:", data);
          alert("Ошибка подписки: " + (data.error || "Попробуйте позже"));
        }
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      alert("Ошибка подписки. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h2 className={styles.title}>Благодарим за интерес!</h2>
            <p className={styles.description}>
              Переодически мы будем отправлять интересные позиции
            </p>
            <button
              className={styles.button}
              onClick={() => setIsSubscribed(false)}
            >
              ОК
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>узнавайте о новинках первым</h2>
          <p className={styles.description}>Подпишитесь на нашу рассылку</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Введите Вашу почту"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Подписка..." : "Подписаться"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
