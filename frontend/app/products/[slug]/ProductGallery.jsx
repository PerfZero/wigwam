"use client";

import { useMemo, useState } from "react";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import styles from "./page.module.css";

const arrowIcon = (
  <svg
    width="4"
    height="7"
    viewBox="0 0 4 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.82031 3.39062C3.82031 3.48828 3.78125 3.57422 3.70703 3.64844L0.613281 6.67578C0.542969 6.74609 0.457031 6.78125 0.355469 6.78125C0.15625 6.78125 0 6.62891 0 6.42578C0 6.32422 0.0390625 6.23828 0.101562 6.17188L2.94531 3.39062L0.101562 0.609375C0.0390625 0.542969 0 0.453125 0 0.355469C0 0.152344 0.15625 0 0.355469 0C0.457031 0 0.542969 0.0351562 0.613281 0.101562L3.70703 3.13281C3.78125 3.20312 3.82031 3.29297 3.82031 3.39062Z"
      fill="#492516"
    />
  </svg>
);

export default function ProductGallery({ images = [], name }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const slides = useMemo(() => {
    if (images.length > 0) return images;
    return [""];
  }, [images]);

  return (
    <div className={styles.gallery}>
      <div className={styles.thumbs}>
        <Swiper
          direction="vertical"
          slidesPerView={4}
          spaceBetween={12}
          onSwiper={setThumbsSwiper}
          watchSlidesProgress
          className={styles.thumbsSwiper}
        >
          {slides.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`} className={styles.thumbSlide}>
              <div className={styles.thumbButton}>
                {src ? (
                  <img
                    className={styles.thumbImage}
                    src={src}
                    alt={`${name} ${index + 1}`}
                  />
                ) : (
                  <div className={styles.thumbPlaceholder} />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={styles.mainImageWrapper}>
        <Swiper
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          navigation={{
            nextEl: ".product-gallery-next",
            prevEl: ".product-gallery-prev",
          }}
          className={styles.mainSwiper}
        >
          {slides.map((src, index) => (
            <SwiperSlide key={`${src}-main-${index}`} className={styles.mainSlide}>
              {src ? (
                <img className={styles.mainImage} src={src} alt={name} />
              ) : (
                <div className={styles.mainPlaceholder} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          type="button"
          className={`${styles.mainNavButton} ${styles.mainNavPrev} product-gallery-prev`}
          aria-label="Предыдущее фото"
        >
          {arrowIcon}
        </button>
        <button
          type="button"
          className={`${styles.mainNavButton} ${styles.mainNavNext} product-gallery-next`}
          aria-label="Следующее фото"
        >
          {arrowIcon}
        </button>
      </div>
    </div>
  );
}
