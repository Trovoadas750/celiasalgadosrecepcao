import { Nunito } from "next/font/google";
import { NOME } from "@/lib/config";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--fonte",
  display: "swap",
});

export const metadata = {
  title: NOME,
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#F2DBC9",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}
