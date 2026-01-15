import ui from "../../styles/ui.module.css";

export default function OtherPage() {
  return (
    <div className={`${ui.ui__container} ${ui.ui__stack}`}>
      <h1>Прочее</h1>
      <p>Здесь можно разместить новости, акции или полезные ссылки.</p>
      <div className={ui.ui__card}>
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
