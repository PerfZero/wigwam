import ui from "../../styles/ui.module.css";

export default function ConditionsPage() {
  return (
    <div className={`${ui.ui__container} ${ui.ui__stack}`}>
      <h1>Условия</h1>
      <p>
        Здесь будут условия покупки, доставки и возврата. Пока вы можете
        оформить заказ через корзину, а мы подтвердим детали вручную.
      </p>
      <div className={ui.ui__card}>
        <h3>Документы</h3>
        <p>Полные документы доступны на странице «Документы».</p>
      </div>
    </div>
  );
}
