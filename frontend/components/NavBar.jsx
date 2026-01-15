"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MiniCart from "./MiniCart";
import { apiUrl } from "../lib/api";
import styles from "./NavBar.module.css";
import ui from "../styles/ui.module.css";

const topLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О нас" },
  { href: "/conditions", label: "Условия" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Контакты" },
];

export default function NavBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const response = await fetch(apiUrl("/api/categories/?show_in_nav=1"));
        const data = await response.json();
        if (isMounted) {
          setCategories(data?.results || []);
        }
      } catch (error) {
        if (isMounted) {
          setCategories([]);
        }
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className={styles.navBar}>
      <div className={`${ui.ui__container} ${styles.navBar__top}`}>
        <nav className={`${styles.navBar__nav} ${styles.navBar__topNav}`}>
          {topLinks.map((item) => (
            <Link
              key={item.href}
              className={styles.navBar__navLink}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className={styles.navBar__logo} href="/">
          <img
            className={styles.navBar__logoImage}
            src="/svg/logo.svg"
            alt="Wigwam"
          />
        </Link>
        <div className={styles.navBar__actions}>
          <Link
            className={styles.ui__iconButton}
            href="/search"
            aria-label="Поиск"
          >
            <img
              className={styles.ui__iconImage}
              src="/svg/search.svg"
              alt=""
            />
          </Link>
          <MiniCart />
        </div>
      </div>
      <div className={styles.navBar__container}>
        <hr className={styles.navBar__separator} />
      </div>

      <div className={styles.navBar__bottom}>
        <div className={`${ui.ui__container} ${styles.navBar__bottomInner}`}>
          <nav className={`${styles.navBar__nav} ${styles.navBar__bottomNav}`}>
            {categories.length === 0 && (
              <span className={ui.ui__muted}>Пока нет</span>
            )}
            {categories.map((category) => (
              <Link
                key={category.id}
                className={styles.navBar__bottomLink}
                href={`/categories/${category.slug}`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
