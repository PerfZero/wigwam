import Link from "next/link";
import { apiUrl } from "../../../lib/api";
import AddToCartButton from "../../../components/AddToCartButton";
import ProductReviewForm from "../../../components/ProductReviewForm";
import ui from "../../../styles/ui.module.css";

export const dynamic = "force-dynamic";

async function getProduct(slug) {
  const url = apiUrl(`/api/products/${slug}/`);
  console.log("Fetching product from:", url);
  const response = await fetch(url, {
    next: { revalidate: 30 },
  });
  console.log("Response status:", response.status);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className={`${ui.ui__container} ${ui.ui__stack}`}>
        <h1>Товар не найден</h1>
        <Link className={ui.ui__textLink} href="/categories">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className={`${ui.ui__container} ${ui.ui__stack}`}>
      <div className={ui.ui__sectionHead}>
        <div>
          <p className={ui.ui__muted}>{product.category?.name}</p>
          <h1>{product.name}</h1>
        </div>
        <Link className={ui.ui__textLink} href="/categories">
          Каталог
        </Link>
      </div>

      <div className={`${ui.ui__grid} ${ui.ui__gridTwo}`}>
        <div className={ui.ui__card}>
          <p className={ui.ui__price}>{product.price} ₸</p>
          <p>{product.description || "Описание товара появится позже."}</p>
          <AddToCartButton slug={product.slug} />
        </div>
        <div className={ui.ui__card}>
          <h3>Доставка и оплата</h3>
          <ul>
            <li>Онлайн оплаты нет — подтверждаем заказ вручную.</li>
            <li>Сроки доставки уточняем после заявки.</li>
            <li>Чек и документы доступны на странице «Документы».</li>
          </ul>
        </div>
      </div>

      <section className={ui.ui__section}>
        <h2>Отзывы</h2>
        <div className={ui.ui__stack}>
          {product.reviews?.length === 0 && <p>Пока нет отзывов.</p>}
          {product.reviews?.map((review) => (
            <div key={review.id} className={ui.ui__card}>
              <strong>{review.name}</strong>
              <p className={ui.ui__muted}>Оценка: {review.rating}/5</p>
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductReviewForm slug={product.slug} />
    </div>
  );
}
