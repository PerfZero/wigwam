import Link from "next/link";
import { apiUrl } from "../../lib/api";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function getCategories() {
  const response = await fetch(apiUrl("/api/categories/"), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.results || [];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className={`${styles.container} ${styles.stack}`}>
      <h1>Категории</h1>
      <div className={styles.grid}>
        {categories.length === 0 && <p>Категории еще не добавлены.</p>}
        {categories.map((category) => (
          <Link
            key={category.id}
            className={styles.card}
            href={`/categories/${category.slug}`}
          >
            <h3>{category.name}</h3>
            <p>{category.description || "Описание скоро будет."}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
