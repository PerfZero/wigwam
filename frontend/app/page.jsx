import Link from "next/link";
import { apiUrl } from "../lib/api";
import CategoryGrid from "../components/CategoryGrid";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import styles from "./page.module.css";
import ui from "../styles/ui.module.css";

export const dynamic = "force-dynamic";

async function getCategories() {
  const response = await fetch(apiUrl("/api/categories/?show_on_home=1"), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.results || [];
}

async function getNewProducts() {
  const response = await fetch(apiUrl("/api/products/?is_new=1"), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.results || [];
}

export default async function Home() {
  const [categories, newProducts] = await Promise.all([
    getCategories(),
    getNewProducts(),
  ]);

  return (
    <div className={styles.home}>
      <HeroSlider />

      <div className={`${ui.ui__container} ${ui.ui__stack}`}>
        <section className={ui.ui__section}>
          <div className={ui.ui__sectionHead}></div>
          <div className={ui.ui__grid}>
            {newProducts.length === 0 && <p>Новинки скоро появятся.</p>}
            {newProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className={styles.section_categories}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Категории</h2>
          </div>
          {categories.length === 0 && <p>Пока нет категорий.</p>}
          {categories.length > 0 && (
            <CategoryGrid categories={categories.slice(0, 6)} />
          )}
        </section>
      </div>
    </div>
  );
}
