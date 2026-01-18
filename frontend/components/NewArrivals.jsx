import ui from "../styles/ui.module.css";
import styles from "./NewArrivals.module.css";

// узнавайте о новинках первым
// Подпишитесь на нашу рассылку
// Введите Вашу почту
// Подписаться

export default function NewArrivals() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>узнавайте о новинках первым</h2>
          <p className={styles.description}>Подпишитесь на нашу рассылку</p>
          <form className={styles.form}>
            <input
              type="email"
              placeholder="Введите Вашу почту"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Подписаться
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
