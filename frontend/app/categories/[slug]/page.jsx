import Link from "next/link";
import { apiUrl } from "../../../lib/api";
import ProductCard from "../../../components/ProductCard";
import ProductSwiper from "../../../components/ProductSwiper";
import FiltersPanel from "./FiltersPanel";
import CategoryDescription from "./CategoryDescription";
import SortSelect from "./SortSelect";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

function buildProductsQuery(slug, searchParams) {
  const params = new URLSearchParams();
  params.set("category", slug);
  const attrParams = searchParams?.attr;
  if (attrParams) {
    if (Array.isArray(attrParams)) {
      attrParams.forEach((value) => params.append("attr", value));
    } else {
      params.append("attr", attrParams);
    }
  }
  const priceMin = searchParams?.price_min;
  if (priceMin) {
    params.set("price_min", String(priceMin));
  }
  const priceMax = searchParams?.price_max;
  if (priceMax) {
    params.set("price_max", String(priceMax));
  }
  const sort = searchParams?.sort;
  if (sort) {
    params.set("sort", String(sort));
  }
  return params.toString();
}

function buildBestsellersQuery(slug) {
  const params = new URLSearchParams();
  params.set("category", slug);
  return params.toString();
}

async function getProducts(slug, searchParams) {
  const query = buildProductsQuery(slug, searchParams);
  const response = await fetch(apiUrl(`/api/products/?${query}`), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.results || [];
}

async function getBestsellers(slug) {
  const query = buildBestsellersQuery(slug);
  const response = await fetch(apiUrl(`/api/products/?${query}`), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.results || [];
}

async function getCategory(slug) {
  const response = await fetch(apiUrl("/api/categories/"), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data?.results?.find((category) => category.slug === slug) || null;
}

export default async function CategoryDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const [products, bestsellerSource, category] = await Promise.all([
    getProducts(slug, resolvedSearchParams),
    getBestsellers(slug),
    getCategory(slug),
  ]);
  const emptyParam = resolvedSearchParams?.empty;
  const isEmpty =
    emptyParam === "1" ||
    emptyParam === 1 ||
    (Array.isArray(emptyParam) && emptyParam.includes("1"));
  const displayProducts = isEmpty ? [] : products;
  const bestsellerProducts = bestsellerSource.slice(0, 4);

  return (
    <div className={styles.page}>
      <section className={styles.sectionheader}>
        <div className={styles.container}>
          <h1 className={styles.title}>{category?.name || "Категория"}</h1>
          {category?.description ? (
            <CategoryDescription html={category.description} />
          ) : null}
        </div>
      </section>

      <section className={styles.bestsellers}>
        <div className={styles.container}>
          <ProductSwiper
            products={bestsellerProducts}
            title="Бестселлеры"
            kicker="Выбор постоянных клиентов"
            align="left"
          />
        </div>
      </section>

      <section className={styles.catalog}>
        <div className={styles.container}>
          <div className={styles.catalogBody}>
            <FiltersPanel />
            <div className={styles.products}>
              <div className={styles.catalogHeader}>
                <div className={styles.catalogSpacer} />
                <SortSelect />
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
