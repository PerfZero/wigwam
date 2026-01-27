"use client";

import { useEffect, useState } from "react";
import styles from "./AgeGate.module.css";

const DELAY_MS = 2000;

export default function AgeGate() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [isVisible]);

  const handleYes = () => {
    setIsVisible(false);
    setIsDenied(false);
  };

  const handleNo = () => {
    setIsDenied(true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src="/svg/logo_pop.svg" alt="WigWam Logo" />
        </div>
        <h1 className={styles.title}>
          ДОБРО ПОЖАЛОВАТЬ В ИНТЕРНЕТ-МАГАЗИН
          <br />
          АКСЕССУАРОВ ДЛЯ ТАБАЧНЫХ ИЗДЕЛИЙ
        </h1>
        <div className={styles.text}>
          <p>
            Мы представляем аксессуары, связанные с культурой и эстетикой
            табачных изделий. Табак и сигареты на сайте не реализуются.
          </p>
          <p>
            Курение оказывает негативное влияние на здоровье. Доступ к сайту
            предоставляется исключительно лицам старше 18 лет.
          </p>
        </div>
        <p className={styles.question}>Вам есть 18 лет?</p>
        <div className={styles.actions}>
          <button className={styles.buttonPrimary} onClick={handleYes}>
            Да
          </button>
          <button className={styles.buttonSecondary} onClick={handleNo}>
            Нет
          </button>
        </div>
        {isDenied && (
          <div className={styles.notice} role="alert">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.5625 13.1243C2.94026 13.1243 -2.93832e-07 10.1841 -2.93832e-07 6.56181C-2.93832e-07 2.93957 2.94026 -0.000689481 6.5625 -0.000689481C10.1847 -0.000689481 13.125 2.93957 13.125 6.56181C13.125 10.1841 10.1847 13.1243 6.5625 13.1243ZM6.5625 12.0306C9.5864 12.0306 12.0312 9.58571 12.0312 6.56181C12.0312 3.53791 9.5864 1.09306 6.5625 1.09306C3.5386 1.09306 1.09375 3.53791 1.09375 6.56181C1.09375 9.58571 3.5386 12.0306 6.5625 12.0306ZM6.55607 7.7199C6.23437 7.7199 6.05423 7.53975 6.04779 7.21163L5.96415 3.80813C5.95772 3.48001 6.20221 3.24196 6.54963 3.24196C6.89062 3.24196 7.14798 3.48644 7.14154 3.81457L7.04504 7.21163C7.0386 7.54619 6.85846 7.7199 6.55607 7.7199ZM6.55607 9.81089C6.1829 9.81089 5.86121 9.5085 5.86121 9.14177C5.86121 8.77505 6.17647 8.47266 6.55607 8.47266C6.92923 8.47266 7.24449 8.76861 7.24449 9.14177C7.24449 9.51494 6.92279 9.81089 6.55607 9.81089Z"
                fill="#FF3A3A"
              />
            </svg>
            К сожалению, ваш возраст не позволяет вам войти на сайт в данный
            момент.
          </div>
        )}
      </div>
    </div>
  );
}
