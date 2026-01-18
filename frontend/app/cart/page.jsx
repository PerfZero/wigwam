"use client";

import { IMaskInput } from "react-imask";
import { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";
import { getCartToken, setCartToken } from "../../lib/cart";
import ui from "../../styles/ui.module.css";
import styles from "./page.module.css";
import Bestsellers from "../../components/Bestsellers";
import NewArrivals from "../../components/NewArrivals";

const publicBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [status, setStatus] = useState("loading");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [phone, setPhone] = useState("");

  async function loadCart() {
    setStatus("loading");
    const token = getCartToken();
    const response = await fetch(apiUrl("/api/cart/"), {
      headers: token ? { "X-Cart-Token": token } : undefined,
    });
    const data = await response.json();
    if (data?.token) {
      setCartToken(data.token);
    }
    setCart(data);
    setStatus("ready");
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateItem(itemId, quantity) {
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

  if (status === "loading") {
    return (
      <div className={`${ui.ui__container} ${ui.ui__stack}`}>
        <h1>Корзина</h1>
        <p>Загружаем корзину...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + Number(item.product?.price || 0) * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const formatPrice = (value) =>
    new Intl.NumberFormat("ru-RU").format(Number(value) || 0);

  const normalizeImageUrl = (url) => {
    if (!url) {
      return "/img/hero.webp";
    }
    return url.replace(/^http:\/\/backend:8000/, publicBase);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Корзина</h1>
        </div>
      </div>
      <div className={styles.container}>
        {items.length === 0 && <p className={styles.empty}>Корзина пустая.</p>}
        {items.length > 0 && (
          <div className={styles.layout}>
            <div className={styles.cartList}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.cartItem__media}>
                    <img
                      className={styles.cartItem__image}
                      src={normalizeImageUrl(item.product?.image_url)}
                      alt={item.product?.name || "Товар"}
                    />
                  </div>
                  <div className={styles.cartItem__main}>
                    <div className={styles.cartItem__topRow}>
                      <div className={styles.cartItem__rating}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span key={`${item.id}-star-${index}`}>★</span>
                        ))}
                      </div>
                      <div className={styles.cartItem__controls}>
                        <button
                          className={styles.cartItem__qtyButton}
                          type="button"
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <button
                          className={styles.cartItem__qtyButton}
                          type="button"
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          className={styles.cartItem__removeButton}
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
                    <div className={styles.cartItem__name}>
                      {item.product?.name}
                    </div>
                    <div className={styles.cartItem__meta}>
                      <span className={styles.cartItem__currency}>₸</span>
                      {formatPrice(item.product?.price)}{" "}
                      <div className={styles.quantity}> X {item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>Check-out</h2>
              <div className={styles.summaryRow}>
                <span>Количество товаров</span>
                <span>{totalItems}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Итого</span>
                <span className={styles.summaryTotal}>
                  ₸ {formatPrice(total)}
                </span>
              </div>
              <div className={styles.summaryDivider} />
              <button
                className={styles.summaryButton}
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Оформить заказ через WhatsApp
              </button>
              <p className={styles.summaryHint}>
                Оформление и оплата происходят через персонального менеджера.
              </p>
            </aside>
          </div>
        )}
      </div>

      <Bestsellers />
      <NewArrivals />

      {isCheckoutOpen && (
        <div className={styles.checkoutOverlay} role="dialog">
          <div className={styles.checkoutModal}>
            <button
              className={styles.checkoutClose}
              type="button"
              aria-label="Закрыть"
              onClick={() => setIsCheckoutOpen(false)}
            >
              ×
            </button>
            <img
              className={styles.checkoutLogo}
              src="/svg/logo_pop.svg"
              alt="Checkout Image"
            />
            <h3 className={styles.checkoutTitle}>
              Для оформления заказа - напишите номер телефона.
            </h3>
            <p className={styles.checkoutText}>
              Мы уважаем личное пространство.
            </p>
            <p className={styles.checkoutText}>
              Номер телефона используется только для персонального сервиса и
              общения по вашему заказу — без звонков и навязчивых сообщений.
            </p>
            <form className={styles.checkoutForm}>
              <IMaskInput
                className={styles.checkoutInput}
                type="tel"
                mask="+7 (000) 000-00-00"
                lazy={false}
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onAccept={(value) => setPhone(value)}
              />
              <a className={styles.checkoutButton} href="#">
                Перейти в WhatsApp
              </a>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
