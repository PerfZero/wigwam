"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

const fallbackFaq = [
  {
    id: "faq-1",
    question: "С какого возраста можно пользоваться сайтом Wig-Wam?",
    answer:
      "Сайт предназначен исключительно для лиц, достигших 18 лет. Используя сайт, вы подтверждаете своё совершеннолетие.",
    category: { slug: "top", name: "Топ-вопросы" },
  },
  {
    id: "faq-2",
    question: "Можно ли купить табачную продукцию напрямую через сайт?",
    answer:
      "Мы не отображаем табачную продукцию в открытом каталоге и не осуществляем прямую продажу на сайте. Все детали заказа согласуются индивидуально.",
    category: { slug: "top", name: "Топ-вопросы" },
  },
  {
    id: "faq-3",
    question: "Как происходит оформление заказа?",
    answer:
      "После заявки менеджер связывается с вами, подтверждает детали и предлагает удобный способ оплаты и доставки.",
    category: { slug: "top", name: "Топ-вопросы" },
  },
  {
    id: "faq-4",
    question: "Проверяется ли возраст при получении?",
    answer:
      "Да, при необходимости мы можем запросить подтверждение возраста для соблюдения законодательства.",
    category: { slug: "top", name: "Топ-вопросы" },
  },
  {
    id: "faq-5",
    question: "Можно ли получить консультацию перед покупкой?",
    answer:
      "Да, мы всегда готовы проконсультировать по ассортименту, способам хранения и аксессуарам.",
    category: { slug: "top", name: "Топ-вопросы" },
  },
];

const fallbackTabs = [
  { key: "top", label: "Топ-вопросы" },
  { key: "orders", label: "Заказы и консультации" },
  { key: "tobacco", label: "Табачная продукция и ассортимент" },
  { key: "quality", label: "Качество и хранение" },
  { key: "legal", label: "Возрастные и юридические вопросы" },
  { key: "returns", label: "Возврат и ответственность" },
  { key: "company", label: "О компании Wig-Wam" },
];

export default function FaqClient({ faq, categories }) {
  const items = useMemo(
    () => (faq && faq.length > 0 ? faq : fallbackFaq),
    [faq],
  );
  const tabs = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((category) => ({
        key: category.slug,
        label: category.name,
      }));
    }
    return fallbackTabs;
  }, [categories]);

  const defaultTabKey = tabs[0]?.key || "top";
  const [activeTab, setActiveTab] = useState(defaultTabKey);
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (item.category?.slug) {
        return item.category.slug === activeTab;
      }
      return activeTab === defaultTabKey;
    });
  }, [items, activeTab, defaultTabKey]);
  const [openId, setOpenId] = useState(filteredItems[0]?.id || null);

  useEffect(() => {
    setOpenId(filteredItems[0]?.id || null);
  }, [filteredItems]);

  function toggleItem(id) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className={styles.faq}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${
              activeTab === tab.key ? styles.tabActive : ""
            }`}
            type="button"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.sectionTitle}>
        {tabs.find((tab) => tab.key === activeTab)?.label}
      </div>

      <div className={styles.list}>
        {filteredItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className={styles.item}>
              <button
                className={styles.itemToggle}
                type="button"
                onClick={() => toggleItem(item.id)}
              >
                <span className={styles.itemQuestion}>{item.question}</span>
                <span
                  className={`${styles.itemIcon} ${
                    isOpen ? styles.itemIconOpen : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.1836 20.4805C14.4766 20.4805 14.7695 20.3633 14.9688 20.1406L24.0391 10.8477C24.2383 10.6484 24.3555 10.3906 24.3555 10.0977C24.3555 9.48828 23.8984 9.01953 23.2891 9.01953C22.9961 9.01953 22.7266 9.13672 22.5273 9.32422L13.5508 18.5H14.8047L5.82812 9.32422C5.64062 9.13672 5.37109 9.01953 5.06641 9.01953C4.45703 9.01953 4 9.48828 4 10.0977C4 10.3906 4.11719 10.6484 4.31641 10.8594L13.3867 20.1406C13.6094 20.3633 13.8789 20.4805 14.1836 20.4805Z"
                      fill="#492516"
                    />
                  </svg>
                </span>
              </button>
              {isOpen && <p className={styles.itemAnswer}>{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
