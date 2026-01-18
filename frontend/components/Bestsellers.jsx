"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "../lib/api";
import ProductCard from "./ProductCard";
import ui from "../styles/ui.module.css";
import styles from "./Bestsellers.module.css";

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

  return (
    <section className={`${ui.ui__section} ${styles.section}`}>
      <div className={ui.ui__container}>
        <p className={styles.kicker}>Выбор постоянных клиентов</p>
        <h2 className={styles.title}>Бестселлеры</h2>
        <div className={ui.ui__grid}>
          {loading && <p>Загружаем подборку...</p>}
          {!loading && newProducts.length === 0 && (
            <p>Новинки скоро появятся.</p>
          )}
          {newProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
