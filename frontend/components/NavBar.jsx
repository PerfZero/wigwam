"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MiniCart from "./MiniCart";
import { apiUrl } from "../lib/api";
import styles from "./NavBar.module.css";

const topLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О нас" },
  { href: "/conditions", label: "Условия" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Контакты" },
];

export default function NavBar() {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", isMenuOpen);
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`${styles.navBar} ${!isHomePage ? styles.navBarStatic : ""}`}
    >
      <div className={styles.mobileHeader}>
        <div className={styles.mobileBar}>
          <Link className={styles.navBar__logo} href="/" onClick={closeMenu}>
            <img
              className={styles.navBar__logoImage}
              src="/svg/logo.svg"
              alt="Wigwam"
            />
          </Link>
          <div className={styles.mobileActions}>
            <MiniCart />
            <button
              className={styles.mobileMenuButton}
              type="button"
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        {!isMenuOpen && (
          <form className={styles.mobileSearch} action="/search">
            <input
              className={styles.mobileSearchInput}
              type="search"
              name="q"
              placeholder="Поиск среди 3 426 товаров..."
              aria-label="Поиск"
            />
            <button className={styles.mobileSearchButton} type="submit">
              <img src="/svg/search_m.svg" alt="" />
            </button>
          </form>
        )}
      </div>

      <div
        className={`${styles.mobileMenu} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <div className={styles.mobileMenuInner}>
          <nav className={styles.mobileMenuNav}>
            {topLinks.map((item) => (
              <Link
                key={item.href}
                className={styles.mobileMenuLink}
                href={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <hr className={styles.mobileMenuSeparator} />
          <nav className={styles.mobileMenuNav}>
            {categories.length === 0 && (
              <span className={styles.mobileMenuMuted}>Пока нет</span>
            )}
            {categories.map((category) => (
              <Link
                key={category.id}
                className={styles.mobileMenuLink}
                href={`/categories/${category.slug}`}
                onClick={closeMenu}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className={`${styles.container} ${styles.navBar__top}`}>
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
          <Link className={styles.iconButton} href="/search" aria-label="Поиск">
            <img className={styles.iconImage} src="/svg/search.svg" alt="" />
          </Link>
          <MiniCart />
        </div>
      </div>
      <div className={styles.navBar__container}>
        <hr className={styles.navBar__separator} />
      </div>

      <div className={styles.navBar__bottom}>
        <div className={`${styles.container} ${styles.navBar__bottomInner}`}>
          <nav className={`${styles.navBar__nav} ${styles.navBar__bottomNav}`}>
            {categories.length === 0 && (
              <span className={styles.muted}>Пока нет</span>
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
