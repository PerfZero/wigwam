import ui from "../../styles/ui.module.css";

export default function ContactsPage() {
  return (
    <div className={`${ui.ui__container} ${ui.ui__stack}`}>
      <h1>Контакты</h1>
      <div className={ui.ui__card}>
        <p>
          <strong>Телефон:</strong> +7 (000) 000-00-00
        </p>
        <p>
          <strong>Email:</strong> hello@wigwam.store
        </p>
        <p>
          <strong>Адрес:</strong> Город, улица, дом
        </p>
      </div>
      <div className={ui.ui__card}>
        <h3>График</h3>
        <p>Пн–Пт: 10:00–19:00</p>
        <p>Сб–Вс: 11:00–17:00</p>
      </div>
    </div>
  );
}
