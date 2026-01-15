import { apiUrl } from "../../lib/api";
import ui from "../../styles/ui.module.css";

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
    <div className={`${ui.ui__container} ${ui.ui__stack}`}>
      <h1>Документы</h1>
      {documents.length === 0 && <p>Документы еще не добавлены.</p>}
      {documents.map((doc) => (
        <div key={doc.id} className={ui.ui__card}>
          <h3>{doc.title}</h3>
          <p>{doc.body}</p>
        </div>
      ))}
    </div>
  );
}
