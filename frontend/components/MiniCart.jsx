"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiUrl } from "../lib/api";
import { getCartToken, setCartToken } from "../lib/cart";
import styles from "./MiniCart.module.css";

export default function MiniCart() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      try {
        const token = getCartToken();
        const response = await fetch(apiUrl("/api/cart/"), {
          headers: token ? { "X-Cart-Token": token } : undefined,
        });
        const data = await response.json();
        if (data?.token) {
          setCartToken(data.token);
        }
        const total = (data?.items || []).reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        setCount(total);
      } catch (error) {
        setCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  return (
    <Link className={styles.ui__iconButton} href="/cart" aria-label="Корзина">
      <img className={styles.ui__iconImage} src="/svg/cart.svg" alt="" />
    </Link>
  );
}
