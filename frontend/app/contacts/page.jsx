import styles from "./page.module.css";
import Bestsellers from "../../components/Bestsellers";
import NewArrivals from "../../components/NewArrivals";

export default function ContactsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.info}>
            <h1 className={styles.title}>Контакты</h1>
            <ul className={styles.list}>
              <li className={styles.item}>
                <span className={styles.icon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M6.6 2.8c.4-.4 1-.5 1.4-.2l3.1 2.2c.4.3.6.9.4 1.4l-1.2 2.8c-.2.4-.1.9.2 1.2l2.7 2.7c.3.3.8.4 1.2.2l2.8-1.2c.5-.2 1.1 0 1.4.4l2.2 3.1c.3.4.2 1-.2 1.4l-1.7 1.7c-.7.7-1.8 1-2.8.7-2.7-.7-5.5-2.3-8.1-4.9-2.6-2.6-4.2-5.4-4.9-8.1-.3-1 .1-2.1.7-2.8z" />
                  </svg>
                </span>
                <a className={styles.link} href="tel:+77272790530">
                  +7 727 279 05 30
                </a>
              </li>
              <li className={styles.item}>
                <span className={styles.icon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M12 2.5c-5 0-9 3.9-9 8.7 0 5.6 5.7 9.9 8.2 10.9.5.2 1.1.2 1.6 0 2.5-1 8.2-5.3 8.2-10.9 0-4.8-4-8.7-9-8.7zm0 12.3c-2 0-3.6-1.5-3.6-3.5s1.6-3.5 3.6-3.5 3.6 1.5 3.6 3.5-1.6 3.5-3.6 3.5z" />
                  </svg>
                </span>
                <a className={styles.link} href="tel:+77710309339">
                  +7 771 030 93 39
                </a>
              </li>
              <li className={styles.item}>
                <span className={styles.icon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M3 5.5c0-1 1-1.8 2.1-1.8h13.8c1.2 0 2.1.8 2.1 1.8v13c0 1-1 1.8-2.1 1.8H5.1C4 20.3 3 19.5 3 18.5v-13zm2.5.5 6.5 5 6.5-5H5.5zm13 12v-9.3l-6.5 5-6.5-5V18h13z" />
                  </svg>
                </span>
                <a className={styles.link} href="mailto:hello@wig-wam.kz">
                  hello@wig-wam.kz
                </a>
              </li>
              <li className={styles.item}>
                <span className={styles.icon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M12 2.5c-4.3 0-7.7 3.3-7.7 7.5 0 5.1 5.1 9.9 7.2 11.7.3.3.8.3 1.1 0 2.1-1.8 7.2-6.6 7.2-11.7 0-4.2-3.4-7.5-7.8-7.5zm0 10.6c-1.7 0-3.1-1.3-3.1-3.1S10.3 7 12 7s3.1 1.3 3.1 3.1-1.4 3.1-3.1 3.1z" />
                  </svg>
                </span>
                <div className={styles.text}>
                  050004, Алматы, Алмалинский р-н,
                  <br />
                  ул. Желтоксан, 78/86
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.map}>
            <iframe
              title="Карта Wigwam"
              src="https://www.google.com/maps?q=%D0%96%D0%B5%D0%BB%D1%82%D0%BE%D0%BA%D1%81%D0%B0%D0%BD%2078%2F86%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <div className={styles.sectionGap}>
        <Bestsellers />
      </div>
      <div className={styles.sectionGap}>
        <NewArrivals />
      </div>
    </div>
  );
}
