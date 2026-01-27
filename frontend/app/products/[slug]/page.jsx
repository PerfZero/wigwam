import Link from "next/link";
import { apiUrl } from "../../../lib/api";
import { formatPrice } from "../../../lib/format";
import PurchaseBlock from "../../../components/PurchaseBlock";
import ReviewDrawer from "../../../components/ReviewDrawer";
import ProductGallery from "./ProductGallery";
import styles from "./page.module.css";
import NewArrivals from "../../../components/NewArrivals";
import Bestsellers from "../../../components/Bestsellers";

export const dynamic = "force-dynamic";
const publicBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getProduct(slug) {
  const url = apiUrl(`/api/products/${slug}/`);
  const response = await fetch(url, {
    next: { revalidate: 30 },
  });
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <h1>Товар не найден</h1>
            <Link href="/categories">Вернуться в каталог</Link>
          </div>
        </div>
      </div>
    );
  }

  const normalizeImageUrl = (url) => {
    if (!url) {
      return "";
    }
    return url.replace(/^http:\/\/backend:8000/, publicBase);
  };
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
          .map((image) => normalizeImageUrl(image?.image_url))
          .filter(Boolean)
      : product.image_url
        ? [normalizeImageUrl(product.image_url)]
        : [];
  const reviewCount = product.reviews?.length || 0;
  const averageRating = reviewCount
    ? Math.round(
        product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount,
      )
    : 0;
  const maxQuantity = product.stock ?? product.quantity ?? 400;
  const attributeRows = Array.isArray(product.attributes)
    ? product.attributes
        .map((attribute) => {
          const label = attribute?.name;
          if (!label) {
            return null;
          }
          const value = formatAttributeValue(attribute);
          if (!value) {
            return null;
          }
          return { label, value };
        })
        .filter(Boolean)
    : [];
  const stars = Array.from({ length: 5 }, (_, index) => (
    <svg
      key={`star-${index}`}
      width="18"
      height="17"
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.42188 16.4375C3.10156 16.1953 3.03125 15.7969 3.22656 15.2266L4.85938 10.3672L0.6875 7.36719C0.203125 7.02344 0 6.66406 0.132812 6.27344C0.257812 5.89844 0.625 5.71875 1.22656 5.71875H6.34375L7.89844 0.867188C8.08594 0.289062 8.36719 0 8.76562 0C9.17188 0 9.45312 0.289062 9.64062 0.867188L11.1953 5.71875H16.3125C16.9141 5.71875 17.2812 5.89844 17.4062 6.27344C17.5312 6.66406 17.3359 7.02344 16.8516 7.36719L12.6797 10.3672L14.3125 15.2266C14.5078 15.7969 14.4375 16.1953 14.1172 16.4375C13.7891 16.6875 13.3906 16.6016 12.9062 16.25L8.76562 13.2109L4.63281 16.25C4.14844 16.6016 3.74219 16.6875 3.42188 16.4375Z"
        fill="#492516"
        fillOpacity={index < averageRating ? "1" : "0.25"}
      />
    </svg>
  ));
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <div className={styles.container}>
          <Link href={`/categories/${product.category?.slug || ""}`}>
            {product.category?.name || "Категория"}
          </Link>
          <span className={styles.breadcrumbsDivider}>/</span>
          <span>{product.name}</span>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.product}>
          <h1 className={`${styles.title} ${styles.titleMobile}`}>
            {product.name}
          </h1>
          <ProductGallery images={images} name={product.name} />

          <div className={styles.info}>
            {product.brand && (
              <div className={styles.brand}>{product.brand}</div>
            )}
            <h1 className={`${styles.title} ${styles.titleDesktop}`}>
              {product.name}
            </h1>
            <div className={styles.rating}>
              <span className={styles.stars}>{stars}</span>
              <span className={styles.reviewCount}>
                {reviewCount > 0 ? `Отзывов: ${reviewCount}` : "Отзывов нет"}
              </span>
              <ReviewDrawer className={styles.reviewLink} slug={product.slug}>
                Оставить отзыв
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.0771 8C11.0771 8.12695 11.0283 8.23926 10.9355 8.33203L7.06836 12.1113C6.98047 12.1943 6.87305 12.2432 6.75098 12.2432C6.49707 12.2432 6.30176 12.0527 6.30176 11.7988C6.30176 11.6719 6.35059 11.5596 6.42871 11.4814L9.9834 8L6.42871 4.52344C6.35059 4.44043 6.30176 4.32812 6.30176 4.20605C6.30176 3.95215 6.49707 3.76172 6.75098 3.76172C6.87305 3.76172 6.98047 3.81055 7.06348 3.89355L10.9355 7.67285C11.0283 7.75586 11.0771 7.87793 11.0771 8Z"
                    fill="#492516"
                  />
                </svg>
              </ReviewDrawer>
            </div>
            <div className={styles.price}>
              <span>₸</span> {formatPrice(product.price)}
            </div>
            <PurchaseBlock slug={product.slug} maxQuantity={maxQuantity} />

            <div className={styles.details}>
              <details className={styles.detailsItem} open>
                <summary className={styles.detailsSummary}>
                  <span>Описание</span>
                  <span
                    className={styles.detailsSummaryIcon}
                    aria-hidden="true"
                  >
                    <svg
                      width="9"
                      height="5"
                      viewBox="0 0 9 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.23828 0.000976562C4.36523 0.000976562 4.47754 0.0498047 4.57031 0.142578L8.34961 4.00977C8.43262 4.09766 8.48145 4.20508 8.48145 4.32715C8.48145 4.58105 8.29102 4.77637 8.03711 4.77637C7.91016 4.77637 7.79785 4.72754 7.71973 4.64941L4.23828 1.09473L0.761719 4.64941C0.678711 4.72754 0.566406 4.77637 0.444336 4.77637C0.19043 4.77637 0 4.58105 0 4.32715C0 4.20508 0.0488281 4.09766 0.131836 4.01465L3.91113 0.142578C3.99414 0.0498047 4.11621 0.000976562 4.23828 0.000976562Z"
                        fill="#492516"
                      />
                    </svg>
                  </span>
                </summary>
                <div className={styles.detailsBody}>
                  {product.description || "Описание товара появится позже."}
                </div>
              </details>
              {reviews.length > 0 && (
                <details className={styles.detailsItem} open>
                  <summary className={styles.detailsSummary}>
                    <span>Отзывы</span>
                    <span
                      className={styles.detailsSummaryIcon}
                      aria-hidden="true"
                    >
                      <svg
                        width="9"
                        height="5"
                        viewBox="0 0 9 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.23828 0.000976562C4.36523 0.000976562 4.47754 0.0498047 4.57031 0.142578L8.34961 4.00977C8.43262 4.09766 8.48145 4.20508 8.48145 4.32715C8.48145 4.58105 8.29102 4.77637 8.03711 4.77637C7.91016 4.77637 7.79785 4.72754 7.71973 4.64941L4.23828 1.09473L0.761719 4.64941C0.678711 4.72754 0.566406 4.77637 0.444336 4.77637C0.19043 4.77637 0 4.58105 0 4.32715C0 4.20508 0.0488281 4.09766 0.131836 4.01465L3.91113 0.142578C3.99414 0.0498047 4.11621 0.000976562 4.23828 0.000976562Z"
                          fill="#492516"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className={styles.detailsBody}>
                    <div className={styles.reviewList}>
                      {reviews.map((review) => {
                        const { title, body } = splitReviewText(review?.text);
                        return (
                          <div key={review.id} className={styles.reviewItem}>
                            <div className={styles.reviewStars}>
                              {Array.from({ length: 5 }, (_, index) => (
                                <svg
                                  key={`review-${review.id}-star-${index}`}
                                  width="18"
                                  height="17"
                                  viewBox="0 0 18 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3.42188 16.4375C3.10156 16.1953 3.03125 15.7969 3.22656 15.2266L4.85938 10.3672L0.6875 7.36719C0.203125 7.02344 0 6.66406 0.132812 6.27344C0.257812 5.89844 0.625 5.71875 1.22656 5.71875H6.34375L7.89844 0.867188C8.08594 0.289062 8.36719 0 8.76562 0C9.17188 0 9.45312 0.289062 9.64062 0.867188L11.1953 5.71875H16.3125C16.9141 5.71875 17.2812 5.89844 17.4062 6.27344C17.5312 6.66406 17.3359 7.02344 16.8516 7.36719L12.6797 10.3672L14.3125 15.2266C14.5078 15.7969 14.4375 16.1953 14.1172 16.4375C13.7891 16.6875 13.3906 16.6016 12.9062 16.25L8.76562 13.2109L4.63281 16.25C4.14844 16.6016 3.74219 16.6875 3.42188 16.4375Z"
                                    fill="#492516"
                                    fillOpacity={
                                      index < (review?.rating || 0)
                                        ? "1"
                                        : "0.2"
                                    }
                                  />
                                </svg>
                              ))}
                            </div>
                            {title && (
                              <div className={styles.reviewTitle}>{title}</div>
                            )}
                            <div className={styles.reviewMeta}>
                              {review?.name || "Гость"} /{" "}
                              {formatReviewDate(review?.created_at)}
                            </div>
                            {body && (
                              <div className={styles.reviewText}>{body}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </details>
              )}

              <details className={styles.detailsItem}>
                <summary className={styles.detailsSummary}>
                  <span>Характеристики</span>
                  <span
                    className={styles.detailsSummaryIcon}
                    aria-hidden="true"
                  >
                    <svg
                      width="9"
                      height="5"
                      viewBox="0 0 9 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.23828 0.000976562C4.36523 0.000976562 4.47754 0.0498047 4.57031 0.142578L8.34961 4.00977C8.43262 4.09766 8.48145 4.20508 8.48145 4.32715C8.48145 4.58105 8.29102 4.77637 8.03711 4.77637C7.91016 4.77637 7.79785 4.72754 7.71973 4.64941L4.23828 1.09473L0.761719 4.64941C0.678711 4.72754 0.566406 4.77637 0.444336 4.77637C0.19043 4.77637 0 4.58105 0 4.32715C0 4.20508 0.0488281 4.09766 0.131836 4.01465L3.91113 0.142578C3.99414 0.0498047 4.11621 0.000976562 4.23828 0.000976562Z"
                        fill="#492516"
                      />
                    </svg>
                  </span>
                </summary>
                <div className={styles.detailsBody}>
                  <div className={styles.specList}>
                    <div className={styles.specRow}>
                      <span>Категория</span>
                      <span>{product.category?.name || "—"}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span>Артикул</span>
                      <span>{product.sku || product.id || "—"}</span>
                    </div>
                    {attributeRows.map((row) => (
                      <div key={row.label} className={styles.specRow}>
                        <span>{row.label}</span>
                        <span>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </details>

              <details className={styles.detailsItem}>
                <summary className={styles.detailsSummary}>
                  <span>Доставка и возврат</span>
                  <span
                    className={styles.detailsSummaryIcon}
                    aria-hidden="true"
                  >
                    <svg
                      width="9"
                      height="5"
                      viewBox="0 0 9 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.23828 0.000976562C4.36523 0.000976562 4.47754 0.0498047 4.57031 0.142578L8.34961 4.00977C8.43262 4.09766 8.48145 4.20508 8.48145 4.32715C8.48145 4.58105 8.29102 4.77637 8.03711 4.77637C7.91016 4.77637 7.79785 4.72754 7.71973 4.64941L4.23828 1.09473L0.761719 4.64941C0.678711 4.72754 0.566406 4.77637 0.444336 4.77637C0.19043 4.77637 0 4.58105 0 4.32715C0 4.20508 0.0488281 4.09766 0.131836 4.01465L3.91113 0.142578C3.99414 0.0498047 4.11621 0.000976562 4.23828 0.000976562Z"
                        fill="#492516"
                      />
                    </svg>
                  </span>
                </summary>
                <div className={styles.detailsBody}>
                  Бесплатная доставка по Казахстану при заказе от 25,000 тенге.
                  <br />
                  <a href="/delivery">Условия доставки</a>
                  <br />
                  Возврат товара возможен в течение 14 дней со дня получения.
                  <br />
                  <a href="/returns">Условия возврата</a>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      <Bestsellers />
      <NewArrivals />
    </div>
  );
}

function formatAttributeValue(attribute) {
  if (!attribute) {
    return "";
  }
  if (attribute.type === "boolean") {
    if (attribute.value === true) {
      return "Да";
    }
    if (attribute.value === false) {
      return "Нет";
    }
  }
  if (
    attribute.value === undefined ||
    attribute.value === null ||
    attribute.value === ""
  ) {
    return "";
  }
  const baseValue = String(attribute.value);
  const unit = attribute.unit ? ` ${attribute.unit}` : "";
  return `${baseValue}${unit}`;
}

function splitReviewText(text) {
  if (!text) {
    return { title: "", body: "" };
  }
  const normalized = String(text).trim();
  if (!normalized) {
    return { title: "", body: "" };
  }
  const parts = normalized.split(/\n\s*\n/);
  if (parts.length > 1) {
    return {
      title: parts[0].trim(),
      body: parts.slice(1).join("\n\n").trim(),
    };
  }
  return { title: "", body: normalized };
}

function formatReviewDate(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("ru-RU");
}
