"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ui from "../styles/ui.module.css";
import styles from "../app/page.module.css";

const slides = [
  {
    title: "Форма ритуала",
    text: "Трубки, в которых важна не скорость, а процесс, пауза и ощущение контроля.",
    image: "/img/hero.webp",
  },
  {
    title: "Искра, проверенная временем",
    text: "Zippo — не аксессуар.\nЭто звук, вес и уверенность в каждом движении.",
    image: "/img/hero_2.webp",
  },
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  function goPrev() {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function goNext() {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className={styles.hero}>
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={`${styles.hero__media} ${styles.hero__mediaSlide} ${
            index === activeIndex ? styles.hero__mediaActive : ""
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-hidden="true"
        />
      ))}
      <div className={styles.hero__overlay} aria-hidden="true" />
      <button
        className={`${styles.hero__arrowButton} ${styles.hero__arrowButtonLeft}`}
        type="button"
        aria-label="Предыдущий слайд"
        onClick={goPrev}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.8164 20.4805C13.5234 20.4805 13.2305 20.3633 13.0312 20.1406L3.96094 10.8477C3.76172 10.6484 3.64453 10.3906 3.64453 10.0977C3.64453 9.48828 4.10156 9.01953 4.71094 9.01953C5.00391 9.01953 5.27344 9.13672 5.47266 9.32422L14.4492 18.5H13.1953L22.1719 9.32422C22.3594 9.13672 22.6289 9.01953 22.9336 9.01953C23.543 9.01953 24 9.48828 24 10.0977C24 10.3906 23.8828 10.6484 23.6836 10.8594L14.6133 20.1406C14.3906 20.3633 14.1211 20.4805 13.8164 20.4805Z"
            fill="#F2EDE0"
          />
        </svg>
      </button>
      <button
        className={`${styles.hero__arrowButton} ${styles.hero__arrowButtonRight}`}
        type="button"
        aria-label="Следующий слайд"
        onClick={goNext}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.1836 20.4805C14.4766 20.4805 14.7695 20.3633 14.9688 20.1406L24.0391 10.8477C24.2383 10.6484 24.3555 10.3906 24.3555 10.0977C24.3555 9.48828 23.8984 9.01953 23.2891 9.01953C22.9961 9.01953 22.7266 9.13672 22.5273 9.32422L13.5508 18.5H14.8047L5.82812 9.32422C5.64062 9.13672 5.37109 9.01953 5.06641 9.01953C4.45703 9.01953 4 9.48828 4 10.0977C4 10.3906 4.11719 10.6484 4.31641 10.8594L13.3867 20.1406C13.6094 20.3633 13.8789 20.4805 14.1836 20.4805Z"
            fill="#F2EDE0"
          />
        </svg>
      </button>
      <div className={`${styles.hero__content} ${ui.ui__container}`}>
        <div className={styles.hero__main}>
          <div key={activeIndex} className={styles.hero__textFade}>
            <h1 className={styles.hero__title}>{activeSlide.title}</h1>
            <p className={styles.hero__lead}>
              {activeSlide.text.split("\n").map((line, index, all) => (
                <span key={`${activeSlide.title}-${index}`}>
                  {line}
                  {index < all.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
          <div className={styles.hero__actions}>
            <Link
              className={`${ui.ui__button} ${styles.hero__button}`}
              href="/categories"
            >
              Перейти к каталогу
            </Link>
          </div>
          <div className={styles.hero__arrow}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.1836 20.4805C14.4766 20.4805 14.7695 20.3633 14.9688 20.1406L24.0391 10.8477C24.2383 10.6484 24.3555 10.3906 24.3555 10.0977C24.3555 9.48828 23.8984 9.01953 23.2891 9.01953C22.9961 9.01953 22.7266 9.13672 22.5273 9.32422L13.5508 18.5H14.8047L5.82812 9.32422C5.64062 9.13672 5.37109 9.01953 5.06641 9.01953C4.45703 9.01953 4 9.48828 4 10.0977C4 10.3906 4.11719 10.6484 4.31641 10.8594L13.3867 20.1406C13.6094 20.3633 13.8789 20.4805 14.1836 20.4805Z"
                fill="#F2EDE0"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
