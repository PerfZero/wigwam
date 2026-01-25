import { Suspense } from "react";
import SearchClient from "./SearchClient";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <div className={styles.page}>
      <Suspense fallback={<div className={styles.container}>Загрузка...</div>}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
