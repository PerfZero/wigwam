"use client";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";
import styles from "../app/page.module.css";
import swiperStyles from "../styles/swiper.module.css";
import ui from "../styles/ui.module.css";

export default function ProductSwiper({
  products,
  title,
  kicker,
  align = "center",
}) {
  const [mounted, setMounted] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const isLeft = align === "left";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className={ui.ui__section}>
        <div
          className={`${styles.sectionHead} ${
            isLeft ? styles.sectionHeadLeft : ""
          }`}
        >
          {kicker ? <p className={styles.sectionKicker}>{kicker}</p> : null}
          <h2 className={styles.sectionTitles}>{title}</h2>
        </div>
        <div className={swiperStyles.swiper}>
          <div className="product-swiper">
            {products?.map((product) => (
              <div
                key={product.id}
                style={{ width: "250px", margin: "0 10px" }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className={ui.ui__section}>
        <div
          className={`${styles.sectionHead} ${
            isLeft ? styles.sectionHeadLeft : ""
          }`}
        >
          {kicker ? <p className={styles.sectionKicker}>{kicker}</p> : null}
          <h2 className={styles.sectionTitles}>{title}</h2>
        </div>
        <p>Товары скоро появятся.</p>
      </section>
    );
  }

  return (
    <section className={ui.ui__section}>
      <div
        className={`${styles.sectionHead} ${
          isLeft ? styles.sectionHeadLeft : ""
        }`}
      >
        {kicker ? <p className={styles.sectionKicker}>{kicker}</p> : null}
        <h2 className={styles.sectionTitles}>{title}</h2>
      </div>
      <div className={`${swiperStyles.swiper} ${swiperStyles.swiperWrap}`}>
        <div className={swiperStyles.sliderRow}>
          <button
            type="button"
            className={swiperStyles.navButton}
            ref={prevRef}
            aria-label="Предыдущий слайд"
          >
            <img src="/svg/arrow-l.svg" alt="Предыдущий слайд" />
          </button>
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1.7}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              480: {
                slidesPerView: 1.6,
              },
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className={`${swiperStyles.productSwiper} product-swiper`}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            type="button"
            className={swiperStyles.navButton}
            ref={nextRef}
            aria-label="Следующий слайд"
          >
            <img src="/svg/arrow-r.svg" alt="Предыдущий слайд" />
          </button>
        </div>
      </div>
    </section>
  );
}
