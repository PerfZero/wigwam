import { apiUrl } from "../../lib/api";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function getDocuments() {
  const response = await fetch(apiUrl("/api/documents/"), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.results || [];
}

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className={`${styles.container} ${styles.stack}`}>
      <h1>Документы</h1>
      {documents.length === 0 && <p>Документы еще не добавлены.</p>}
      {documents.map((doc) => (
        <div key={doc.id} className={styles.card}>
          <h3>{doc.title}</h3>
          <p>{doc.body}</p>
        </div>
      ))}
    </div>
  );
}
