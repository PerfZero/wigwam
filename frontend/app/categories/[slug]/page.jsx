import Link from "next/link";
import { apiUrl } from "../../../lib/api";
import ProductCard from "../../../components/ProductCard";
import ui from "../../../styles/ui.module.css";

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

export default async function CategoryDetailPage({ params }) {
  const { slug } = await params;
  const products = await getProducts(slug);

  return (
    <div className={`${ui.ui__container} ${ui.ui__stack}`}>
      <div className={ui.ui__sectionHead}>
        <h1>Категория: {slug}</h1>
        <Link className={ui.ui__textLink} href="/categories">
          Назад к категориям
        </Link>
      </div>
      <div className={ui.ui__grid}>
        {products.length === 0 && <p>В этой категории пока нет товаров.</p>}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
