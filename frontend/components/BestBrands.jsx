import ui from "../styles/ui.module.css";
import styles from "./BestBrands.module.css";

//загорлвок и картинки массивом

const brands = [
  { id: 1, name: "Brand 1", image: "/img/brand1.webp" },
  { id: 2, name: "Brand 2", image: "/img/brand2.webp" },
  { id: 3, name: "Brand 3", image: "/img/brand3.webp" },
  { id: 4, name: "Brand 4", image: "/img/brand4.webp" },
  { id: 5, name: "Brand 5", image: "/img/brand5.webp" },
  { id: 6, name: "Brand 3", image: "/img/brand3.webp" },
  { id: 7, name: "Brand 2", image: "/img/brand2.webp" },
  { id: 8, name: "Brand 1", image: "/img/brand1.webp" },
  { id: 9, name: "Brand 4", image: "/img/brand4.webp" },
  { id: 10, name: "Brand 5", image: "/img/brand1.webp" },
  { id: 11, name: "Brand 1", image: "/img/brand2.webp" },
  { id: 12, name: "Brand 2", image: "/img/brand2.webp" },
  { id: 13, name: "Brand 3", image: "/img/brand3.webp" },
  { id: 14, name: "Brand 4", image: "/img/brand4.webp" },
  { id: 15, name: "Brand 5", image: "/img/brand5.webp" },
];

export default function BestBrands() {
  return (
    <section className={`${ui.ui__section} ${styles.section}`}>
      <h2 className={styles.title}>мы предлагаем лучшие бренды</h2>
      <div className={ui.ui__container}>
        <div className={styles.brands}>
          {brands.map((brand) => (
            <img
              key={brand.id}
              className={styles.brand}
              src={brand.image}
              alt={brand.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
