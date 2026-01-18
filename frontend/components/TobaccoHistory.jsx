import styles from "./TobaccoHistory.module.css";

// Такой тест
// история табачной
// компании wig-wam
// Wig-Wam — выверенное табачное пространство, основанное на качестве, традициях и уважении к вкусу. Мы работаем напрямую с проверенными производителями и предлагаем отборный ассортимент для ценителей культуры курения.
// Почитать историю

export default function TobaccoHistory() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>история табачной компании wig-wam</h2>
        <p className={styles.text}>
          Wig-Wam — выверенное табачное пространство, основанное на качестве,
          традициях и уважении к вкусу. Мы работаем напрямую с проверенными
          производителями и предлагаем отборный ассортимент для ценителей
          культуры курения.
        </p>
        <button className={styles.button}>Почитать историю</button>
      </div>
      <div className={styles.emptyBlock}></div>
    </section>
  );
}
