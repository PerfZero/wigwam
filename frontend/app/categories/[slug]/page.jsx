import Link from "next/link";
import { apiUrl } from "../../../lib/api";
import ProductCard from "../../../components/ProductCard";
import FiltersPanel from "./FiltersPanel";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function getProducts(slug) {
  const response = await fetch(apiUrl(`/api/products/?category=${slug}`), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.results || [];
}

export default async function CategoryDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const products = await getProducts(slug);
  const emptyParam = searchParams?.empty;
  const isEmpty =
    emptyParam === "1" ||
    emptyParam === 1 ||
    (Array.isArray(emptyParam) && emptyParam.includes("1"));
  const displayProducts = isEmpty ? [] : products;
  const bestsellerProducts = displayProducts.slice(0, 4);

  return (
    <div className={styles.page}>
      <section className={styles.sectionheader}>
        <div className={styles.container}>
          <h1 className={styles.title}>Трубки для курения</h1>
          <p className={styles.description}>Что это</p>

          <p className={styles.subdescription}>
            Трубка — это способ курения, построенный вокруг ритуала и контроля
            процесса.
          </p>
          <Link className={styles.link} href={`/categories/${slug}`}>
            Подробнее{" "}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 13.0771C9.87305 13.0771 9.76074 13.0283 9.66797 12.9355L5.88867 9.06836C5.80566 8.98047 5.75684 8.87305 5.75684 8.75098C5.75684 8.49707 5.94727 8.30176 6.20117 8.30176C6.32812 8.30176 6.44043 8.35059 6.51855 8.42871L10 11.9834L13.4766 8.42871C13.5596 8.35059 13.6719 8.30176 13.7939 8.30176C14.0479 8.30176 14.2383 8.49707 14.2383 8.75098C14.2383 8.87305 14.1895 8.98047 14.1064 9.06348L10.3271 12.9355C10.2441 13.0283 10.1221 13.0771 10 13.0771Z"
                fill="#492516"
              />
            </svg>
          </Link>
        </div>
      </section>

      <section className={styles.bestsellers}>
        <div className={styles.container}>
          <p className={styles.kicker}>Выбор постоянных клиентов</p>
          <h2 className={styles.sectionTitle}>Бестселлеры</h2>
          <div className={styles.bestsellersGrid}>
            {bestsellerProducts.length === 0 && (
              <p className={styles.emptyText}>Пока нет товаров.</p>
            )}
            {bestsellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.catalog}>
        <div className={styles.container}>
          <div className={styles.catalogBody}>
            <FiltersPanel />
            <div className={styles.products}>
              <div className={styles.catalogHeader}>
                <div className={styles.catalogSpacer} />
                <div className={styles.sorting}>
                  <span className={styles.sortingLabel}>
                    Сортировка: По популярности
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 10.4614C7.89844 10.4614 7.80859 10.4224 7.73438 10.3481L4.71191 7.25439C4.64551 7.18408 4.60645 7.09814 4.60645 7.00049C4.60645 6.79736 4.75879 6.64111 4.96191 6.64111C5.06348 6.64111 5.15332 6.68018 5.21582 6.74268L8 9.58838L10.7817 6.74268C10.8481 6.68018 10.9375 6.64111 11.0352 6.64111C11.2383 6.64111 11.3906 6.79736 11.3906 7.00049C11.3906 7.09814 11.3516 7.18408 11.2852 7.25049L8.26318 10.3481C8.18896 10.4224 8.09766 10.4614 8 10.4614Z"
                      fill="#492516"
                    />
                  </svg>
                </div>
              </div>
              <div className={styles.productsGrid}>
                {displayProducts.length === 0 && (
                  <p className={styles.emptyText}>
                    По Вашим критериям товаров нет. Попробуйте изменить поиск.
                  </p>
                )}
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
