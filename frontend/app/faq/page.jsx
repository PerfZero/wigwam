import { apiUrl } from "../../lib/api";
import FaqClient from "./FaqClient";
import styles from "./page.module.css";
import NewArrivals from "../../components/NewArrivals";
import BestSellers from "../../components/Bestsellers";

export const dynamic = "force-dynamic";

async function getFaq() {
  const response = await fetch(apiUrl("/api/faq/"), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return { results: [], categories: [] };
  }
  const data = await response.json();
  return {
    results: data.results || [],
    categories: data.categories || [],
  };
}

export default async function FaqPage() {
  const { results, categories } = await getFaq();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Часто задаваемые вопросы</h1>
        <FaqClient faq={results} categories={categories} />
      </div>
      <BestSellers />

      <NewArrivals />
    </div>
  );
}
