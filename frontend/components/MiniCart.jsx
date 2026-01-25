"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../contexts/CartContext";
import { apiUrl } from "../lib/api";
import { getCartToken } from "../lib/cart";
import styles from "./MiniCart.module.css";

export default function MiniCart() {
  const { count, items, loading, loadCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    loadCart();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loadCart]);

  async function updateItem(itemId, quantity) {
    if (quantity < 1) {
      return;
    }
    const token = getCartToken();
    await fetch(apiUrl(`/api/cart/items/${itemId}/`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Cart-Token": token } : {}),
      },
      body: JSON.stringify({ quantity }),
    });
    loadCart();
  }

  async function removeItem(itemId) {
    const token = getCartToken();
    await fetch(apiUrl(`/api/cart/items/${itemId}/remove/`), {
      method: "DELETE",
      headers: token ? { "X-Cart-Token": token } : {},
    });
    loadCart();
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.product?.price || 0) * item.quantity,
    0,
  );

  const formatPrice = (value) =>
    new Intl.NumberFormat("ru-RU").format(Number(value) || 0);

  return (
    <div className={styles.miniCart} ref={rootRef}>
      <button
        className={styles.miniCart__iconButton}
        type="button"
        aria-label="Открыть корзину"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          className={styles.miniCart__iconImage}
          src="/svg/cart.svg"
          alt=""
        />
        <span className={styles.miniCart__badge}>{count}</span>
      </button>

      {isOpen &&
        isMounted &&
        createPortal(
          <>
            <div
              className={styles.miniCart__overlay}
              aria-hidden="true"
              onClick={() => setIsOpen(false)}
            />
            <div
              className={styles.miniCart__panel}
              role="dialog"
              aria-label="Корзина"
            >
              <div className={styles.miniCart__header}>
                <span className={styles.miniCart__title}>
                  Корзина / {count}
                </span>
                <button
                  className={styles.miniCart__closeButton}
                  type="button"
                  aria-label="Закрыть"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.82031 16.3047C6.61719 16.5078 6.27344 16.5156 6.07031 16.3047C5.85938 16.1016 5.86719 15.7578 6.07031 15.5547L10.25 11.375L6.07031 7.1875C5.86719 6.98438 5.85938 6.64844 6.07031 6.44531C6.27344 6.23438 6.61719 6.24219 6.82031 6.44531L11 10.625L15.1797 6.44531C15.3828 6.24219 15.7266 6.23438 15.9297 6.44531C16.1406 6.64844 16.1328 6.98438 15.9297 7.1875L11.75 11.375L15.9297 15.5547C16.1328 15.7578 16.1406 16.1016 15.9297 16.3047C15.7266 16.5156 15.3828 16.5078 15.1797 16.3047L11 12.125L6.82031 16.3047Z"
                      fill="#492516"
                    />
                  </svg>
                </button>
              </div>
              <div className={styles.miniCart__body}>
                {loading && (
                  <p className={styles.miniCart__muted}>Загружаем корзину...</p>
                )}
                {!loading && items.length === 0 && (
                  <p className={styles.miniCart__empty}>
                    Ваша корзина пока пуста. Ознакомьтесь с ассортиментом и
                    выберите то, что вам подойдёт.
                  </p>
                )}
                {!loading && items.length > 0 && (
                  <div className={styles.miniCart__items}>
                    {items.map((item) => (
                      <div key={item.id} className={styles.miniCart__item}>
                        <div className={styles.miniCart__itemMedia}>
                          <img
                            className={styles.miniCart__itemImage}
                            src={item.product?.image_url || "/img/hero.webp"}
                            alt={item.product?.name || "Товар"}
                          />
                        </div>
                        <div className={styles.miniCart__itemInfo}>
                          <span className={styles.miniCart__itemName}>
                            {item.product?.name}
                          </span>
                          <div className={styles.miniCart__itemRow}>
                            <span className={styles.miniCart__itemMeta}>
                              ₸ {formatPrice(item.product?.price)}{" "}
                              <div className={styles.miniCart__itemQuantity}>
                                X {item.quantity}{" "}
                              </div>
                            </span>
                            <div className={styles.miniCart__itemControls}>
                              <button
                                className={styles.miniCart__qtyButton}
                                type="button"
                                onClick={() =>
                                  updateItem(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <button
                                className={styles.miniCart__qtyButton}
                                type="button"
                                onClick={() =>
                                  updateItem(item.id, item.quantity + 1)
                                }
                              >
                                +
                              </button>
                              <button
                                className={styles.miniCart__removeButton}
                                type="button"
                                onClick={() => removeItem(item.id)}
                                aria-label="Удалить"
                              >
                                <svg
                                  width="8"
                                  height="9"
                                  viewBox="0 0 8 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1.99219 8.69922C1.42578 8.69922 1.05859 8.33984 1.03125 7.78125L0.757812 2.09766H0.292969C0.136719 2.09766 0 1.96484 0 1.80078C0 1.64062 0.136719 1.50781 0.292969 1.50781H2.06641V0.910156C2.06641 0.34375 2.43359 0 3.03516 0H4.51953C5.12109 0 5.48828 0.34375 5.48828 0.910156V1.50781H7.27344C7.43359 1.50781 7.5625 1.64062 7.5625 1.80078C7.5625 1.96094 7.43359 2.09766 7.27344 2.09766H6.80469L6.53516 7.77734C6.50781 8.33594 6.13281 8.69922 5.57422 8.69922H1.99219ZM2.6875 0.949219V1.50781H4.86719V0.949219C4.86719 0.726562 4.71094 0.582031 4.47656 0.582031H3.07812C2.84375 0.582031 2.6875 0.726562 2.6875 0.949219ZM2.04688 8.10938H5.51172C5.74219 8.10938 5.91016 7.94531 5.91797 7.71094L6.17578 2.09766H1.37109L1.64453 7.71094C1.65625 7.94141 1.82422 8.10938 2.04688 8.10938ZM2.625 7.44141C2.48047 7.44141 2.38281 7.35156 2.37891 7.21094L2.26172 3.03516C2.25781 2.89844 2.35547 2.80469 2.50391 2.80469C2.64453 2.80469 2.74219 2.89453 2.74609 3.03125L2.86719 7.21094C2.87109 7.34766 2.77344 7.44141 2.625 7.44141ZM3.78125 7.44141C3.63281 7.44141 3.53125 7.34766 3.53125 7.21094V3.03516C3.53125 2.89844 3.63281 2.80469 3.78125 2.80469C3.92969 2.80469 4.03516 2.89844 4.03516 3.03516V7.21094C4.03516 7.34766 3.92969 7.44141 3.78125 7.44141ZM4.94141 7.44141C4.79297 7.44141 4.69531 7.34766 4.69922 7.21094L4.81641 3.03516C4.82031 2.89453 4.91797 2.80469 5.05859 2.80469C5.20703 2.80469 5.30469 2.89844 5.30078 3.03516L5.18359 7.21094C5.17969 7.35156 5.08203 7.44141 4.94141 7.44141Z"
                                    fill="white"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.miniCart__footer}>
                {!loading && items.length > 0 ? (
                  <>
                    <div className={styles.miniCart__summary}>
                      <span className={styles.miniCart__summaryLabel}>
                        Итого
                      </span>
                      <span className={styles.miniCart__summaryValue}>
                        <span>􁑊</span>
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                    <div className={styles.miniCart__actions}>
                      <Link
                        className={styles.miniCart__primary}
                        href="/cart"
                        onClick={() => setIsOpen(false)}
                      >
                        Оформить заказ
                      </Link>
                      <Link
                        className={styles.miniCart__secondary}
                        href="/categories"
                        onClick={() => setIsOpen(false)}
                      >
                        Продолжить покупки
                      </Link>
                    </div>
                  </>
                ) : (
                  <Link
                    className={styles.miniCart__cta}
                    href="/categories"
                    onClick={() => setIsOpen(false)}
                  >
                    Перейти к ассортименту
                  </Link>
                )}
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
