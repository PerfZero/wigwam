"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ProductReviewForm from "./ProductReviewForm";
import styles from "./ReviewDrawer.module.css";

export default function ReviewDrawer({ className, children, slug }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className={className}
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </button>
      {isOpen &&
        isMounted &&
        createPortal(
          <>
            <div
              className={styles.reviewDrawer__overlay}
              aria-hidden="true"
              onClick={() => setIsOpen(false)}
            />
            <div
              className={styles.reviewDrawer__panel}
              role="dialog"
              aria-label="Отзыв"
            >
              <div className={styles.reviewDrawer__header}>
                <h3 className={styles.reviewDrawer__title}>Отзыв</h3>
                <button
                  className={styles.reviewDrawer__close}
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
              <ProductReviewForm
                slug={slug}
                showTitle={false}
                onSuccess={() => {
                  setIsOpen(false);
                  setShowSuccess(true);
                }}
              />
            </div>
          </>,
          document.body,
        )}
      {showSuccess &&
        isMounted &&
        createPortal(
          <div
            className={styles.reviewDrawer__successOverlay}
            role="dialog"
            aria-label="Оставить отзыв"
          >
            <div className={styles.reviewDrawer__success}>
              <h4 className={styles.reviewDrawer__successTitle}>
                Благодарим за обратную связь!
              </h4>
              <p className={styles.reviewDrawer__successText}>
                Ваш отзыв будет опубликован в ближайшее время после модерации.
              </p>
              <button
                className={styles.reviewDrawer__successButton}
                type="button"
                onClick={() => setShowSuccess(false)}
              >
                ОК
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
