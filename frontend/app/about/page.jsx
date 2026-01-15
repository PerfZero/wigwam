import ui from "../../styles/ui.module.css";

export default function AboutPage() {
  return (
    <div className={`${ui.ui__container} ${ui.ui__stack}`}>
      <h1>О нас</h1>
      <p>
        Wigwam — небольшой магазин с ручной сборкой заказов. Мы принимаем заявки
        через корзину и связываемся с вами для подтверждения.
      </p>
      <div className={ui.ui__card}>
        <h3>Почему без онлайн оплаты</h3>
        <p>
          Мы уточняем наличие и детали доставки, поэтому подтверждаем заказ
          вручную. Это снижает количество отмен и ошибок.
        </p>
      </div>
    </div>
  );
}
