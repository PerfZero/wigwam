import styles from "./CheckoutProcess.module.css";

export default function CheckoutProcess() {
  //номер, картинка, заголовок, описание

  const steps = [
    {
      number: 1,
      image: "./img/step_1.webp",
      title: "Выбор продукции",
      description:
        "Изучите отобранный ассортимент табачной продукции и аксессуаров",
    },
    {
      number: 2,
      image: "./img/step_2.webp",
      title: "Подтверждение",
      description:
        "Добавьте товары в корзину и подтвердите заказ через WhatsApp",
    },
    {
      number: 3,
      image: "./img/step_3.webp",
      title: "Завершение",
      description: "Удалённая оплата и доставка в кратчайшие сроки",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Процесс оформления заказа</h2>
        <ol className={styles.list}>
          {steps.map((step, index) => (
            <li key={index} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <img
                src={step.image}
                alt={step.title}
                className={styles.stepImage}
              />
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
