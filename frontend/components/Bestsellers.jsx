"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "../lib/api";
import ProductSwiper from "./ProductSwiper";
import ui from "../styles/ui.module.css";
import styles from "../app/page.module.css";

export default function Bestsellers() {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const response = await fetch(apiUrl("/api/products/?is_new=1"));
        if (!response.ok) {
          if (isMounted) {
            setNewProducts([]);
          }
          return;
        }
        const data = await response.json();
        if (isMounted) {
          setNewProducts(data.results || []);
        }
      } catch (error) {
        if (isMounted) {
          setNewProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className={ui.ui__section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitles}>Бестселлеры</h2>
        </div>
        <p>Загружаем подборку...</p>
      </section>
    );
  }

  return <ProductSwiper products={newProducts} title="Бестселлеры" />;
}
