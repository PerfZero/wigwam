import ui from "../../styles/ui.module.css";
import styles from "./page.module.css";
import NewArrivals from "../../components/NewArrivals";

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.hero__media} aria-hidden="true" />
        <div className={styles.hero__overlay} aria-hidden="true" />
        <div className={`${styles.hero__content} ${ui.ui__container}`}>
          <div className={styles.hero__main}>
            <div className={styles.hero__textFade}>
              <h1 className={styles.hero__title}>О компании Wig-Wam</h1>
              <p className={styles.hero__lead}>
                Осознанный выбор табака и культуры курения.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.page}>
        <section className={styles.section}>
          <div className={ui.ui__container}>
            <h2 className={styles.sectionTitle}>Основа табачной культуры</h2>
            <p className={styles.sectionText}>
              Wig-Wam появился в тот момент, когда табачная культура в городе
              только формировалась. С самого начала это было не просто торговое
              пространство, а место для людей, которые искали вкус, качество и
              осознанное отношение к курению.
            </p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={ui.ui__container}>
            <h2 className={styles.sectionTitle}>
              Прямые связи. Проверенные источники
            </h2>
            <p className={styles.sectionText}>
              Основатель Wig-Wam одним из первых начал выстраивать прямые
              отношения с зарубежными производителями, делая ставку не на
              объёмы, а на уровень и репутацию.
            </p>
            <br />
            <p className={styles.sectionText}>
              Со временем партнёрский портфель пополнился брендами из Германии,
              Ирландии, Дании, Бельгии и стран Ближнего Востока — регионов с
              сильными табачными традициями и высокими стандартами качества.
            </p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={ui.ui__container}>
            <p className={styles.standaloneQuote}>
              "Каждый новый бренд в ассортименте — это осознанный выбор, а не
              компромисс."
            </p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={ui.ui__container}>
            <h2 className={styles.sectionTitle}>
              Ассортимент без случайных позиций
            </h2>
            <div className={styles.assortmentGrid}>
              <div className={styles.assortmentCard}>
                <img
                  className={styles.assortmentImage}
                  src="/img/about_1.png"
                  alt="Сигары и сигариллы"
                />
                <p className={styles.assortmentCaption}>Сигары и сигариллы</p>
              </div>
              <div className={styles.assortmentCard}>
                <img
                  className={styles.assortmentImage}
                  src="/img/about_2.png"
                  alt="Трубочный табак"
                />
                <p className={styles.assortmentCaption}>Трубочный табак</p>
              </div>
              <div className={styles.assortmentCard}>
                <img
                  className={styles.assortmentImage}
                  src="/img/about_3.png"
                  alt="Самокруточные смеси"
                />
                <p className={styles.assortmentCaption}>Самокруточные смеси</p>
              </div>
              <div className={styles.assortmentCard}>
                <img
                  className={styles.assortmentImage}
                  src="/img/about_4.png"
                  alt="Редкие и интересные сигареты"
                />
                <p className={styles.assortmentCaption}>
                  Редкие и интересные сигареты
                </p>
              </div>
            </div>
            <p className={styles.assortmentQuote}>
              "Мы одними из первых начали системно развивать культуру самокруток
              — как способ получить более чистый вкус, полный контроль над
              качеством и удовольствие от процесса, а не просто от результата."
            </p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={ui.ui__container}>
            <h2 className={styles.sectionTitle}>Наши преимущества</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <img
                  className={styles.benefitImage}
                  src="/img/benefit_1.png"
                  alt="Осознанный отбор"
                />
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>Осознанный отбор</h3>
                  <p className={styles.benefitText}>
                    Мы работаем только с теми продуктами, за которые можем
                    отвечать. Никаких случайных позиций и временных трендов.
                  </p>
                </div>
              </div>
              <div className={styles.benefitCard}>
                <img
                  className={styles.benefitImage}
                  src="/img/benefit_2.png"
                  alt="Правильное хранение"
                />
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>Правильное хранение</h3>
                  <p className={styles.benefitText}>
                    Условия хранения соблюдаются с максимальным вниманием — от
                    влажности до температуры, чтобы табак сохранял вкус и
                    характер.
                  </p>
                </div>
              </div>
              <div className={styles.benefitCard}>
                <img
                  className={styles.benefitImage}
                  src="/img/benefit_3.png"
                  alt="Экспертные консультации"
                />
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>
                    Экспертные консультации
                  </h3>
                  <p className={styles.benefitText}>
                    Мы помогаем подобрать продукт под вкус, опыт и настроение, а
                    не просто продаем с полки.
                  </p>
                </div>
              </div>
              <div className={styles.benefitCard}>
                <img
                  className={styles.benefitImage}
                  src="/img/benefit_4.png"
                  alt="Глубина выбора"
                />
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>Глубина выбора</h3>
                  <p className={styles.benefitText}>
                    У нас можно найти то, что редко встречается в массовых
                    магазинах — от нишевых брендов до нестандартных форматов.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div className={ui.ui__container}>
            <h2 className={styles.sectionTitle}>
              Уважение к истории и деталям
            </h2>
            <div className={styles.quoteCard}>
              <p className={styles.quoteLead}>
                "Для нас табак — это не просто продукт."
              </p>
              <p className={styles.quoteText}>
                Это культура, ремесло и традиция, формировавшиеся десятилетиями.
                Именно поэтому мы уделяем внимание каждой детали: от
                происхождения табака до того, как он попадает в руки клиента.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section_down}>
          <div className={styles.hero_down}>
            <div className={styles.hero__content_down}>
              <h1 className={styles.hero__title_down}>Wig-Wam сегодня</h1>
              <p className={styles.hero__text_down}>
                Сегодня Wig-Wam — это продолжение той же философии, с которой
                всё начиналось: качественный табак, честный выбор и живое
                удовольствие от курения для тех, кто ценит вкус, историю и
                осознанность.
              </p>
              <button className={styles.hero__button_down}>
                Перейти к ассортиментам
              </button>
            </div>
          </div>
        </section>
        <NewArrivals />
      </div>
    </>
  );
}
