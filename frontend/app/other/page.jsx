import styles from "./page.module.css";

export default function OtherPage() {
  return (
    <div className={`${styles.container} ${styles.stack}`}>
      <h1>Прочее</h1>
      <p>Здесь можно разместить новости, акции или полезные ссылки.</p>
      <div className={styles.card}>
        <h3>Идеи для раздела</h3>
        <ul>
          <li>Истории бренда и команды</li>
          <li>Сертификаты и гарантии</li>
          <li>Полезные материалы</li>
        </ul>
      </div>
    </div>
  );
}
