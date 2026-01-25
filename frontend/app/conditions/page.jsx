"use client";

import { useState } from "react";
import styles from "./page.module.css";
import NewArrivals from "../../components/NewArrivals";

export default function ConditionsPage() {
  const tabs = [
    {
      key: "agreement",
      label: (
        <>
          Пользовательское
          <br />
          соглашение
        </>
      ),
      labelText: "Пользовательское соглашение",
    },
    {
      key: "privacy",
      label: (
        <>
          Политика
          <br />
          конфиденциальности
        </>
      ),
      labelText: "Политика конфиденциальности",
    },
    {
      key: "age",
      label: (
        <>
          Возрастное
          <br />
          ограничение 18+
        </>
      ),
      labelText: "Возрастное ограничение 18+",
    },
    {
      key: "delivery",
      label: (
        <>
          Условия
          <br />
          доставки и оплаты
        </>
      ),
      labelText: "Условия доставки и оплаты",
    },
    {
      key: "disclaimer",
      label: (
        <>
          Отказ
          <br />
          от ответственности
        </>
      ),
      labelText: "Отказ от ответственности",
    },
  ];
  const [activeTab, setActiveTab] = useState("agreement");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Условия</h1>
          <div className={styles.tabsSelect}>
            <select
              className={styles.tabsSelectInput}
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value)}
              aria-label="Раздел условий"
            >
              {tabs.map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.labelText}
                </option>
              ))}
            </select>
          </div>
          <nav className={styles.tabs}>
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
          </nav>
        </div>
      </header>

      <main className={styles.container}>
        {activeTab === "agreement" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Пользовательское соглашение</h2>
            <p className={styles.text}>
              Настоящее Пользовательское соглашение (далее — «Соглашение»)
              регулирует отношения между владельцем сайта Wig-Wam (далее —
              «Компания») и пользователем сайта (далее — «Пользователь») в
              рамках использования сайта, размещенного в сети Интернет.
            </p>
            <p className={styles.text}>
              Используя сайт, Пользователь подтверждает, что ознакомился с
              условиями настоящего Соглашения, понимает их и принимает в полном
              объеме.
            </p>
            <div className={styles.divider} />
            <h3 className={styles.blockTitle}>1. Общие положения</h3>
            <ol className={styles.list}>
              <li>
                Сайт Wig-Wam носит информационно-ознакомительный характер и
                предназначен для демонстрации ассортимента, философии и подхода
                Компании к табачной продукции.
              </li>
              <li>
                Размещение информации о товарах на сайте не является публичной
                офертой в соответствии с законодательством Республики Казахстан.
              </li>
              <li>
                Компания оставляет за собой право в любое время изменять
                содержание сайта, условия настоящего Соглашения, а также
                ассортимент без предварительного уведомления Пользователя.
              </li>
            </ol>
          </section>
        )}

        {activeTab === "privacy" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Политика конфиденциальности</h2>
            <p className={styles.text}>
              Компания бережно относится к персональным данным. Мы запрашиваем
              только ту информацию, которая необходима для связи и обработки
              обращений, не передаем ее третьим лицам без законных оснований и
              используем исключительно в рамках заявленных целей.
            </p>
          </section>
        )}

        {activeTab === "age" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Возрастные ограничения</h2>
            <ol className={styles.list}>
              <li>
                Использование сайта допускается исключительно лицами, достигшими
                21 года (либо иного возраста, установленного действующим
                законодательством Республики Казахстан для приобретения табачной
                продукции).
              </li>
              <li>
                Посещая сайт, Пользователь подтверждает, что он достиг
                установленного законом возраста и осознает характер
                представленной информации.
              </li>
              <li>
                Компания не несет ответственности за использование сайта лицами,
                не достигшими установленного возраста, в случае предоставления
                ими недостоверных данных.
              </li>
            </ol>
          </section>
        )}

        {activeTab === "delivery" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Условия доставки и оплаты</h2>
            <p className={styles.text}>
              Условия доставки и оплаты согласуются индивидуально после
              подтверждения заказа. Подробности уточняются менеджером при
              коммуникации с Пользователем.
            </p>
          </section>
        )}

        {activeTab === "disclaimer" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Отказ от ответственности</h2>
            <p className={styles.text}>
              Информация на сайте предоставляется в справочных целях. Компания
              не несет ответственности за возможные последствия самостоятельного
              использования материалов сайта без консультации со специалистом.
            </p>
          </section>
        )}
      </main>
      <NewArrivals />
    </div>
  );
}
