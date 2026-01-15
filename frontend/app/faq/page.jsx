import { apiUrl } from "../../lib/api";
import ui from "../../styles/ui.module.css";

export const dynamic = "force-dynamic";

async function getFaq() {
  const response = await fetch(apiUrl("/api/faq/"), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.results || [];
}

export default async function FaqPage() {
  const faq = await getFaq();

  return (
    <div className={`${ui.ui__container} ${ui.ui__stack}`}>
      <h1>FAQ</h1>
      {faq.length === 0 && <p>Раздел пока пустой.</p>}
      {faq.map((item) => (
        <div key={item.id} className={ui.ui__card}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </div>
  );
}
