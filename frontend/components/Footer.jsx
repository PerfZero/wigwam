import Link from "next/link";
import styles from "./Footer.module.css";

// Пользовательское соглашение
// Политика конфиденциальности
// Возрастное ограничение 18+
// Условия доставки и оплаты
// Отказ от ответственности

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={`${styles.container} ${styles.footer__inner}`}>
        <div className={styles.footer__links}>
          <Link href="/terms">Пользовательское соглашение</Link>
          <Link href="/privacy">Политика конфиденциальности</Link>
          <Link href="/age">Возрастное ограничение 18+</Link>
          <Link href="/delivery">Условия доставки и оплаты</Link>
          <Link href="/disclaimer">Отказ от ответственности</Link>
        </div>
        <div className={styles.footer__separator}></div>
        <div className={styles.footer__bottom}>
          <div className={styles.footer__logo}>
            <img src="/svg/logo.svg" width="80" alt="Wig-Wam" />
          </div>
          <div className={styles.footer__copyright}>
            Copyright © 2025 Wig-Wam
          </div>
        </div>
      </div>
    </div>
  );
}
