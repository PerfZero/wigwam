import "./globals.css";
import NavBar from "../components/NavBar";
import { Playfair_Display, Tenor_Sans } from "next/font/google";
import styles from "./layout.module.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const tenorSans = Tenor_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Wigwam",
  description: "Онлайн магазин без онлайн оплаты",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={`${playfair.variable} ${tenorSans.variable}`}>
        <NavBar />
        <main className={styles.layout__main}>{children}</main>
      </body>
    </html>
  );
}
